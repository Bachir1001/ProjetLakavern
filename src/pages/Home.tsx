import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, Headphones, RefreshCw, ChevronLeft, ChevronRight, X, ArrowRight, Loader2 } from 'lucide-react';
import type { PageType } from '../App';
import { wooApi, type StoreApiCategory } from '../services/woocommerce';

interface HomeProps {
  onNavigate: (page: PageType) => void;
  // Permet, comme dans la Navbar, de sélectionner une catégorie et d'être
  // envoyé directement sur la Boutique filtrée sur celle-ci.
  onSelectCategory?: (categoryId: number) => void;
}

// Lien du catalogue Canva
const CATALOGUE_URL = 'https://www.canva.com/design/DAHQnJonQ_c/HLgjUNlKq3A0AwJF8OEdbw/view?embed';

// Bannières situées dans le dossier /public à la racine
const bannerImages = [
  '/banner1.webp',
  '/banner2.webp',
  '/banner3.webp',
];

// Nombre de catégories mises en avant sur la page d'accueil (2 lignes x 3 colonnes)
const FEATURED_CATEGORIES_COUNT = 6;

// Petit dégradé de secours si une catégorie n'a pas d'image sur WooCommerce
const FALLBACK_GRADIENTS = [
  'from-cyan-50 to-cyan-100 text-cyan-600',
  'from-purple-50 to-purple-100 text-purple-600',
  'from-pink-50 to-pink-100 text-pink-600',
  'from-amber-50 to-amber-100 text-amber-600',
  'from-emerald-50 to-emerald-100 text-emerald-600',
  'from-indigo-50 to-indigo-100 text-indigo-600',
];

export const Home: React.FC<HomeProps> = ({ onNavigate, onSelectCategory }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCatalogueOpen, setIsCatalogueOpen] = useState(false);

  const [categories, setCategories] = useState<StoreApiCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? bannerImages.length - 1 : prev - 1));
  };

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === bannerImages.length - 1 ? 0 : prev + 1));
  };

  // Défilement automatique du carrousel toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === bannerImages.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Chargement des vraies catégories WooCommerce, on garde les plus fournies
  // (les plus grand nombre de produits) pour la mise en avant sur l'accueil.
  useEffect(() => {
    wooApi
      .getCategories({ per_page: 50 })
      .then((cats) => {
        const withProducts = cats
          .filter((c) => c.count > 0)
          .sort((a, b) => b.count - a.count)
          .slice(0, FEATURED_CATEGORIES_COUNT);
        setCategories(withProducts);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des catégories sur l\'accueil :', err);
      })
      .finally(() => setCategoriesLoading(false));
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    } else {
      onNavigate('shop');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* 1. HERO BANNER — Carrousel avec 3 images + encart Catalogue */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="max-w-[1800px] mx-auto relative">

          {/* Image de fond du slide actuel */}
          <div className="relative w-full h-[320px] sm:h-[420px] lg:h-[560px]">
            {bannerImages.map((src, index) => (
              <img
                key={src + index}
                src={src}
                alt={`Bannière LaKavern ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              />
            ))}

            {/* Flèche Précédent */}
            <button
              onClick={goToPrevSlide}
              aria-label="Image précédente"
              className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Flèche Suivant */}
            <button
              onClick={goToNextSlide}
              aria-label="Image suivante"
              className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white text-gray-700 rounded-full p-2 shadow-md transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Points de navigation */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {bannerImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Aller au slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    index === currentSlide ? 'w-6 bg-white' : 'w-2 bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Encart texte turquoise, superposé en haut à gauche */}
            <div className="absolute top-6 left-4 sm:top-6 sm:left-6 z-10 max-w-md">
              <div className="bg-gradient-to-br from-[#0e7c8a] to-[#14b8c9] rounded-2xl px-6 py-4 sm:px-8 sm:py-6 shadow-xl">
                <div className="border-l-4 border-fuchsia-500 pl-4 mb-5">
                  <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white leading-snug">
                    S'équiper pour réussir
                    <br />
                    c'est dans{' '}
                    <span className="text-cyan-200 font-serif">LaKavern</span>
                  </h1>
                </div>

                {/* Bouton CATALOGUE — ouvre la modale intégrée au site */}
                <button
                  type="button"
                  onClick={() => setIsCatalogueOpen(true)}
                  className="inline-block bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs sm:text-sm tracking-[0.15em] px-6 py-3 rounded-full transition-colors cursor-pointer shadow-md"
                >
                  VISUALISER NOTRE CATALOGUE
                </button>
              </div>

              <div className="mt-4 pl-2">
                <p className="font-serif text-cyan-800 sm:text-white text-base sm:text-lg leading-tight drop-shadow-sm font-semibold">
                  RENTRÉE SCOLAIRE
                </p>
                <p className="font-serif text-fuchsia-600 sm:text-fuchsia-300 text-base sm:text-lg leading-tight drop-shadow-sm font-semibold">
                  2026/2027
                </p>
              </div>
            </div>
          </div>

          {/* Ligne du bas avec l'URL du site */}
          <div className="bg-gradient-to-r from-[#0e7c8a] to-[#14b8c9] py-2 text-center">
            <span className="text-white text-xs sm:text-sm font-medium tracking-wide">
              www.lakavernshop.com
            </span>
          </div>
        </div>
      </section>

      {/* MODALE CATALOGUE — affiche le catalogue Canva directement sur le site */}
      {isCatalogueOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-6"
          onClick={() => setIsCatalogueOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl h-[85vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Barre supérieure de la modale */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white flex-shrink-0">
              <h3 className="font-bold text-gray-800 text-sm sm:text-base">
                Catalogue LaKavern — Rentrée 2026/2027
              </h3>
              <button
                onClick={() => setIsCatalogueOpen(false)}
                aria-label="Fermer le catalogue"
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aperçu intégré du catalogue */}
            <div className="flex-1 bg-white">
              <iframe
                title="Catalogue LaKavern"
                src={CATALOGUE_URL}
                className="w-full h-full border-0 bg-white"
                allow="fullscreen"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. AVANTAGES / ENGAGEMENTS */}
      <section className="bg-white border-b border-gray-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-4">
            <Truck className="w-8 h-8 text-[#00c8db] mb-2" />
            <h4 className="font-bold text-gray-800 text-sm">Livraison Rapide</h4>
            <p className="text-xs text-gray-500">À Dakar et partout au Sénégal</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <ShieldCheck className="w-8 h-8 text-[#00c8db] mb-2" />
            <h4 className="font-bold text-gray-800 text-sm">Qualité Garantie</h4>
            <p className="text-xs text-gray-500">Marques certifiées & durables</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <Headphones className="w-8 h-8 text-[#00c8db] mb-2" />
            <h4 className="font-bold text-gray-800 text-sm">Service Commercial</h4>
            <p className="text-xs text-gray-500">Assistance au 77 240 58 58</p>
          </div>
          <div className="flex flex-col items-center p-4">
            <RefreshCw className="w-8 h-8 text-[#00c8db] mb-2" />
            <h4 className="font-bold text-gray-800 text-sm">Paiement Facile</h4>
            <p className="text-xs text-gray-500">Wave, Orange Money & Cash</p>
          </div>
        </div>
      </section>

      {/* 3. SECTIONS CATEGORIES PHARES — catégories réelles de WooCommerce */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Nos Catégories Principales
        </h2>

        {categoriesLoading ? (
          <div className="flex justify-center items-center py-16 text-[#00c8db]">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-500">Aucune catégorie disponible pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, index) => (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="h-48 rounded-lg mb-4 overflow-hidden bg-gray-50">
                  {cat.image?.src ? (
                    <img
                      src={cat.image.src}
                      alt={cat.image.alt || cat.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className={`h-full w-full flex items-center justify-center bg-gradient-to-br ${
                        FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]
                      }`}
                    >
                      <span className="font-semibold">{cat.name}</span>
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-lg text-gray-800 group-hover:text-[#00c8db] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {cat.count} produit{cat.count > 1 ? 's' : ''} disponible{cat.count > 1 ? 's' : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. BANNIÈRE CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-12">
        <div className="bg-gradient-to-r from-[#0e7c8a] to-[#14b8c9] rounded-2xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-2">Prêt pour la rentrée ?</h3>
            <p className="text-cyan-100 text-sm sm:text-base">Découvrez toute notre collection d'articles scolaires au meilleur prix.</p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="bg-white text-[#0e7c8a] hover:bg-cyan-50 font-bold px-8 py-3 rounded-full transition-colors flex items-center gap-2 shadow-md cursor-pointer whitespace-nowrap"
          >
            Accéder à la boutique
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};
