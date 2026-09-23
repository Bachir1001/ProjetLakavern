import React, { useEffect, useMemo, useState } from 'react';

import {
  ArrowLeft,
  Check,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
} from 'lucide-react';

import {
  formatStorePrice,
  wooApi,
  type StoreApiProduct,
} from '../services/woocommerce';

import { useCart } from '../context/CartContext';

interface ProductDetailsProps {
  product: StoreApiProduct;
  onBack: () => void;
  // Permet de naviguer directement vers un produit similaire, sans repasser
  // par la grille de la boutique.
  onSelectProduct?: (product: StoreApiProduct) => void;
}

const RELATED_PRODUCTS_COUNT = 4;

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onBack,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const [relatedProducts, setRelatedProducts] = useState<StoreApiProduct[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  const variationAttribute = useMemo(() => {
    return product.attributes?.find(
      (attribute) =>
        attribute.has_variations &&
        attribute.terms &&
        attribute.terms.length > 0
    );
  }, [product]);

  const [selectedTermSlug, setSelectedTermSlug] = useState<string>(
    variationAttribute?.terms?.[0]?.slug ?? ''
  );

  const selectedTerm = variationAttribute?.terms?.find(
    (term) => term.slug === selectedTermSlug
  );

  const selectedVariation = product.variations?.find((variation) =>
    variation.attributes?.some(
      (attribute) => attribute.value === selectedTermSlug
    )
  );

  const hasVariations =
    Boolean(variationAttribute) &&
    Boolean(product.variations?.length);

  // Remet à zéro la galerie/quantité/variation choisie et fait remonter la
  // page en haut à chaque fois qu'on change de produit (ex: via "Produits similaires").
  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
    setSelectedTermSlug(variationAttribute?.terms?.[0]?.slug ?? '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  // Charge les produits de la même catégorie pour la section "Produits similaires"
  useEffect(() => {
    const categoryId = product.categories?.[0]?.id;

    if (!categoryId) {
      setRelatedProducts([]);
      return;
    }

    setRelatedLoading(true);

    wooApi
      .getProducts({ category: categoryId, per_page: 8 })
      .then((items) => {
        const filtered = items
          .filter((p) => p.id !== product.id)
          .slice(0, RELATED_PRODUCTS_COUNT);
        setRelatedProducts(filtered);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des produits similaires :', err);
        setRelatedProducts([]);
      })
      .finally(() => setRelatedLoading(false));
  }, [product.id]);

  const handleAddToCart = () => {
    if (hasVariations && !selectedVariation) {
      return;
    }

    addToCart(
      product,
      quantity,
      selectedVariation?.id,
      selectedTerm
        ? `${variationAttribute?.name} : ${selectedTerm.name}`
        : undefined
    );
  };

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((current) =>
      current > 1 ? current - 1 : 1
    );
  };

  // Clic sur une carte "produit similaire" : on ouvre sa fiche directement
  const handleSelectRelated = (relatedProduct: StoreApiProduct) => {
    if (onSelectProduct) {
      onSelectProduct(relatedProduct);
    }
  };

  // Ajout rapide au panier depuis une carte "produit similaire"
  const handleRelatedQuickAdd = (
    event: React.MouseEvent,
    relatedProduct: StoreApiProduct
  ) => {
    event.stopPropagation();

    const relatedHasVariations =
      relatedProduct.variations && relatedProduct.variations.length > 0;

    if (relatedHasVariations) {
      handleSelectRelated(relatedProduct);
      return;
    }

    addToCart(relatedProduct, 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">

      {/* RETOUR */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-[#00c8db] font-semibold mb-8 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Retour à la boutique
      </button>

      {/* PARTIE PRINCIPALE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

        {/* ========================= */}
        {/* GALERIE PHOTOS */}
        {/* ========================= */}

        <div>

          <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-square flex items-center justify-center">

            {product.images?.[selectedImage] ? (
              <img
                src={product.images[selectedImage].src}
                alt={
                  product.images[selectedImage].alt ||
                  product.name
                }
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-gray-400">
                Pas d'image
              </span>
            )}

          </div>

          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">

              {product.images.map((image, index) => (
                <button
                  key={image.id || index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-xl overflow-hidden border-2 cursor-pointer bg-gray-50 ${
                    selectedImage === index
                      ? 'border-[#00c8db]'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.thumbnail || image.src}
                    alt={image.alt || product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}

            </div>
          )}

        </div>

        {/* ========================= */}
        {/* INFORMATIONS PRODUIT */}
        {/* ========================= */}

        <div>

          {/* CATÉGORIES */}
          {product.categories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">

              {product.categories.map((category) => (
                <span
                  key={category.id}
                  className="bg-cyan-50 text-[#00aebf] px-3 py-1 rounded-full text-xs font-bold"
                >
                  {category.name}
                </span>
              ))}

            </div>
          )}

          {/* NOM */}
          <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
            {product.name}
          </h1>

          {/* PRIX */}
          <div className="mt-5">

            <span className="text-3xl font-extrabold text-[#00c8db]">
              {formatStorePrice(product.prices)} FCFA
            </span>

          </div>

          {/* STOCK */}
          <div className="mt-4">

            {product.is_in_stock !== false ? (
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <Check className="w-5 h-5" />
                En stock
              </div>
            ) : (
              <span className="font-semibold text-red-500">
                Rupture de stock
              </span>
            )}

          </div>

          {/* DESCRIPTION COURTE */}
          {product.short_description && (
            <div
              className="mt-6 text-gray-600 leading-7 product-description"
              dangerouslySetInnerHTML={{
                __html: product.short_description,
              }}
            />
          )}

          {/* ========================= */}
          {/* COULEURS / VARIATIONS */}
          {/* ========================= */}

          {variationAttribute && (
            <div className="mt-8">

              <p className="font-extrabold text-gray-900 mb-3">
                {variationAttribute.name}
              </p>

              <div className="flex flex-wrap gap-3">

                {variationAttribute.terms.map((term) => {

                  const selected =
                    selectedTermSlug === term.slug;

                  return (
                    <button
                      key={term.id}
                      onClick={() =>
                        setSelectedTermSlug(term.slug)
                      }
                      className={`px-5 py-3 rounded-lg border-2 font-semibold transition-all cursor-pointer ${
                        selected
                          ? 'border-[#00c8db] bg-cyan-50 text-[#00aebf]'
                          : 'border-gray-200 text-gray-700 hover:border-[#00c8db]'
                      }`}
                    >
                      {term.name}
                    </button>
                  );
                })}

              </div>

            </div>
          )}

          {/* QUANTITÉ */}
          <div className="mt-8">

            <p className="font-extrabold text-gray-900 mb-3">
              Quantité
            </p>

            <div className="flex items-center gap-4">

              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">

                <button
                  onClick={decreaseQuantity}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="w-12 text-center font-extrabold">
                  {quantity}
                </span>

                <button
                  onClick={increaseQuantity}
                  className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>

              </div>

              <button
                onClick={handleAddToCart}
                disabled={
                  product.is_in_stock === false ||
                  (hasVariations && !selectedVariation)
                }
                className="flex-1 min-h-12 bg-[#00c8db] hover:bg-[#00b3c4] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-extrabold rounded-xl px-5 flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                AJOUTER AU PANIER
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ================================= */}
      {/* DESCRIPTION COMPLÈTE */}
      {/* ================================= */}

      <div className="mt-16 border-t border-gray-100 pt-10">

        <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
          Description
        </h2>

        {product.description ? (
          <div
            className="text-gray-600 leading-8 space-y-4"
            dangerouslySetInnerHTML={{
              __html: product.description,
            }}
          />
        ) : (
          <p className="text-gray-500">
            Aucune description disponible.
          </p>
        )}

      </div>

      {/* ================================= */}
      {/* CARACTÉRISTIQUES */}
      {/* ================================= */}

      {product.short_description && (
        <div className="mt-12 bg-gray-50 rounded-2xl p-6 sm:p-8">

          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            Caractéristiques
          </h2>

          <div
            className="text-gray-700 leading-8"
            dangerouslySetInnerHTML={{
              __html: product.short_description,
            }}
          />

        </div>
      )}

      {/* ================================= */}
      {/* CATÉGORIES */}
      {/* ================================= */}

      {product.categories?.length > 0 && (
        <div className="mt-10">

          <h2 className="text-xl font-extrabold text-gray-900 mb-4">
            Catégories
          </h2>

          <div className="flex flex-wrap gap-2">

            {product.categories.map((category) => (
              <span
                key={category.id}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-700"
              >
                {category.name}
              </span>
            ))}

          </div>

        </div>
      )}

      {/* ================================= */}
      {/* PRODUITS SIMILAIRES */}
      {/* ================================= */}

      {relatedLoading ? (
        <div className="mt-16 border-t border-gray-100 pt-10 flex justify-center py-10 text-[#00c8db]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : relatedProducts.length > 0 ? (
        <div className="mt-16 border-t border-gray-100 pt-10">

          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            Produits similaires
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {relatedProducts.map((related) => (
              <div
                key={related.id}
                onClick={() => handleSelectRelated(related)}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-4 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="h-40 w-full bg-gray-50 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                    {related.images?.[0] ? (
                      <img
                        src={related.images[0].src}
                        alt={related.images[0].alt || related.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">Pas d'image</span>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-800 text-sm line-clamp-2 mb-1 group-hover:text-[#00c8db] transition-colors">
                    {related.name}
                  </h3>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-base font-extrabold text-[#00c8db]">
                    {related.prices ? `${formatStorePrice(related.prices)} FCFA` : 'Prix N/A'}
                  </span>

                  <button
                    onClick={(event) => handleRelatedQuickAdd(event, related)}
                    className="bg-[#00c8db] hover:bg-[#00b3c4] text-white p-2 rounded-lg transition-colors cursor-pointer"
                    aria-label={
                      related.variations?.length
                        ? `Choisir les options de ${related.name}`
                        : `Ajouter ${related.name} au panier`
                    }
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

          </div>

        </div>
      ) : null}

    </div>
  );
};
