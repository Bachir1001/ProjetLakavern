import React, {
  useEffect,
  useState,
} from 'react';

import {
  wooApi,
  formatStorePrice,
  type StoreApiProduct,
  type StoreApiCategory,
} from '../services/woocommerce';

import {
  ShoppingCart,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import {
  useCart,
} from '../context/CartContext';

import {
  ProductDetails,
} from './ProductDetails';

interface ShopProps {
  // Catégorie choisie depuis le menu bleu "PARCOURIR LES CATÉGORIES" de la Navbar.
  // Optionnelle : la page fonctionne aussi seule (affiche tout) si non fournie.
  selectedCategoryId?: number | null;
}

const PRODUCTS_PER_PAGE = 20;

export const Shop: React.FC<ShopProps> = ({ selectedCategoryId = null }) => {

  const [products, setProducts] =
    useState<StoreApiProduct[]>([]);

  const [categories, setCategories] =
    useState<StoreApiCategory[]>([]);

  const [selectedCategory, setSelectedCategory] =
    useState<number | null>(selectedCategoryId);

  const [selectedProduct, setSelectedProduct] =
    useState<StoreApiProduct | null>(null);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>('');

  // Pagination : garde le même nombre de colonnes/lignes, mais permet
  // de naviguer entre les pages pour voir tous les produits du site.
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  // On sait s'il existe une page suivante en regardant si la page reçue
  // est "pleine" (20 produits) — indépendant des en-têtes de pagination.
  const [hasMore, setHasMore] = useState(false);

  const { addToCart } = useCart();

  /*
   * SYNCHRO AVEC LA CATÉGORIE CHOISIE DEPUIS LA NAVBAR
   * (on revient à la page 1 quand la catégorie change)
   */
  useEffect(() => {
    setSelectedCategory(selectedCategoryId);
    setCurrentPage(1);
  }, [selectedCategoryId]);

  /*
   * CHARGEMENT DES CATÉGORIES
   */
  useEffect(() => {

    wooApi
      .getCategories({
        per_page: 20,
      })
      .then(setCategories)
      .catch((err) => {
        console.error(
          'Erreur chargement des catégories :',
          err
        );
      });

  }, []);

  /*
   * CHARGEMENT DES PRODUITS DE LA PAGE ACTUELLE
   */
  useEffect(() => {

    const fetchProducts = async () => {

      setLoading(true);
      setError('');

      try {

        const { items, total } =
          await wooApi.getProductsPaged({
            per_page: PRODUCTS_PER_PAGE,
            page: currentPage,
            category: selectedCategory ?? undefined,
          });

        setProducts(items);
        setTotalProducts(total);
        // On ignore désormais totalPages (en-têtes non fiables sur ce site) :
        // on se base uniquement sur le nombre de produits reçus pour savoir
        // s'il existe une page suivante.
        setHasMore(items.length === PRODUCTS_PER_PAGE);

        // Remonte en haut de la grille à chaque changement de page
        window.scrollTo({ top: 0, behavior: 'smooth' });

      } catch (err) {

        console.error(
          'Erreur lors de la récupération depuis WooCommerce :',
          err
        );

        setError(
          'Impossible de charger les produits pour le moment. Réessayez dans un instant.'
        );

      } finally {

        setLoading(false);

      }
    };

    fetchProducts();

  }, [selectedCategory, currentPage]);

  /*
   * OUVRIR LA FICHE PRODUIT
   */
  const handleOpenProduct = (
    product: StoreApiProduct
  ) => {

    setSelectedProduct(product);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

  };

  /*
   * RETOUR À LA BOUTIQUE
   */
  const handleBackToShop = () => {

    setSelectedProduct(null);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

  };

  /*
   * AJOUT RAPIDE AU PANIER
   */
  const handleQuickAdd = (
    event: React.MouseEvent,
    product: StoreApiProduct
  ) => {

    event.stopPropagation();

    const hasVariations =
      product.variations &&
      product.variations.length > 0;

    if (hasVariations) {

      handleOpenProduct(product);

      return;
    }

    addToCart(product, 1);

  };

  if (selectedProduct) {

    return (
      <ProductDetails
        product={selectedProduct}
        onBack={handleBackToShop}
        onSelectProduct={handleOpenProduct}
      />
    );

  }

  const activeCategoryName = selectedCategory
    ? categories.find((c) => c.id === selectedCategory)?.name
    : null;

  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">

      <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
        Notre Boutique
      </h1>

      {activeCategoryName ? (
        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm text-gray-500">
            Catégorie : <span className="font-semibold text-[#00c8db]">{activeCategoryName}</span>
          </p>
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-xs text-gray-400 hover:text-gray-600 underline cursor-pointer"
          >
            Réinitialiser
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-2">Tous les produits</p>
      )}

      {!loading && !error && (totalProducts > 0 || products.length > 0) && (
        <p className="text-xs text-gray-400 mb-8">
          {totalProducts > 0
            ? `${totalProducts} produit${totalProducts > 1 ? 's' : ''} au total`
            : `Page ${currentPage}`}
        </p>
      )}

      {loading ? (

        <div className="flex justify-center items-center py-20 text-[#00c8db]">

          <Loader2 className="w-10 h-10 animate-spin" />

        </div>

      ) : error ? (

        <div className="text-center py-20">

          <p className="text-red-500 font-medium">
            {error}
          </p>

        </div>

      ) : products.length === 0 ? (

        <div className="text-center py-20">

          <p className="text-gray-500">
            Aucun produit trouvé dans cette catégorie.
          </p>

        </div>

      ) : (

        <>
          {/* GRILLE DES PRODUITS — même nombre de colonnes sur toutes les pages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {products.map((product) => (

              <div
                key={product.id}
                onClick={() =>
                  handleOpenProduct(product)
                }
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all p-4 flex flex-col justify-between cursor-pointer group"
              >

                <div>

                  <div className="h-48 w-full bg-gray-50 rounded-lg overflow-hidden mb-4 flex items-center justify-center">

                    {product.images?.[0] ? (

                      <img
                        src={product.images[0].src}
                        alt={
                          product.images[0].alt ||
                          product.name
                        }
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                    ) : (

                      <span className="text-gray-400 text-xs">
                        Pas d'image
                      </span>

                    )}

                  </div>

                  <h3 className="font-bold text-gray-800 text-base line-clamp-2 mb-2 group-hover:text-[#00c8db] transition-colors">

                    {product.name}

                  </h3>

                  {product.categories?.[0] && (

                    <p className="text-xs text-gray-400 mb-2">
                      {product.categories[0].name}
                    </p>

                  )}

                </div>

                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">

                  <span className="text-lg font-extrabold text-[#00c8db]">

                    {product.prices
                      ? `${formatStorePrice(
                          product.prices
                        )} FCFA`
                      : 'Prix N/A'}

                  </span>

                  <button
                    onClick={(event) =>
                      handleQuickAdd(
                        event,
                        product
                      )
                    }
                    className="bg-[#00c8db] hover:bg-[#00b3c4] text-white p-2.5 rounded-lg transition-colors cursor-pointer"
                    aria-label={
                      product.variations?.length
                        ? `Choisir les options de ${product.name}`
                        : `Ajouter ${product.name} au panier`
                    }
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>

                </div>

              </div>

            ))}

          </div>

          {/* NAVIGATION ENTRE LES PAGES — simple Précédent / Suivant */}
          {(currentPage > 1 || hasMore) && (
            <div className="flex items-center justify-center gap-3 mt-10">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>

              <span className="min-w-[2.25rem] h-9 px-3 flex items-center justify-center rounded-lg text-sm font-semibold bg-[#00c8db] text-white">
                {currentPage}
              </span>

              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={!hasMore}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>

      )}

    </div>
  );
};
