import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingCart, Heart, RefreshCw, Menu, X, MessageCircle, ChevronDown } from 'lucide-react';
import type { PageType } from '../App';
import { CartDrawer } from './CartDrawer';
import { wooApi } from '../services/woocommerce';

interface Category {
  id: number;
  name: string;
  count: number;
}

interface NavbarProps {
  cartCount?: number;
  wishlistCount?: number;
  onNavigate?: (page: PageType) => void;
  onSelectCategory?: (categoryId: number | null) => void;
  onOpenAuth?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  cartCount = 0, 
  wishlistCount = 0, 
  onNavigate,
  onSelectCategory,
  onOpenAuth 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // Chargement des catégories depuis la Store API WooCommerce
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await wooApi.getCategories({ per_page: 50 });
        setCategories(cats);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories dans la Navbar:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleNavigation = (page: PageType) => {
    if (onNavigate) {
      onNavigate(page);
    }
    setIsMenuOpen(false);
  };

  const handleCategorySelect = (categoryId: number | null) => {
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
    if (onNavigate) {
      onNavigate('shop');
    }
    setIsCategoriesOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full font-sans bg-white border-b border-gray-100 shadow-sm">
      
      {/* 1. TOPBAR : Dégradé Cyan / Violet avec WhatsApp */}
      <div className="w-full bg-gradient-to-t from-[#70e4ef] via-[#a29bfe] to-[#e84393] py-2.5 px-4 text-white font-bold text-center tracking-wide shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <div className="bg-[#25D366] text-white p-1.5 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 fill-current stroke-none" />
          </div>
          <span className="text-lg md:text-xl font-extrabold">
            Service commercial 77 240 58 58
          </span>
        </div>
      </div>

      {/* 2. SECTION PRINCIPALE : Logo, Search, Icônes d'action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo LaKavern */}
          <div className="flex-shrink-0">
            <button 
              onClick={() => handleNavigation('home')} 
              className="text-3xl sm:text-4xl font-extrabold text-[#00c8db] tracking-tight focus:outline-none cursor-pointer"
            >
              LaKavern
            </button>
          </div>

          {/* Barre de Recherche (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Je fais des courses pour..."
                className="w-full bg-[#f2f2f2] text-gray-700 placeholder-gray-500 rounded-full py-2.5 pl-6 pr-12 text-sm border border-transparent focus:outline-none focus:border-[#00c8db] transition-all"
              />
              <button className="absolute right-4 top-2.5 text-gray-700 hover:text-[#00c8db]">
                <Search className="w-5 h-5 stroke-[1.8]" />
              </button>
            </div>
          </div>

          {/* Bloc d'actions à droite */}
          <div className="hidden md:flex items-center space-x-6 text-gray-800">
            
            {/* Compte */}
            <button 
              onClick={onOpenAuth} 
              className="flex flex-col items-center group cursor-pointer focus:outline-none"
            >
              <User className="w-6 h-6 stroke-[1.5] group-hover:text-[#00c8db] transition-colors" />
              <span className="text-xs mt-1 font-medium text-gray-700 group-hover:text-[#00c8db]">Compte</span>
            </button>

            {/* Chariot */}
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="flex flex-col items-center relative group cursor-pointer focus:outline-none"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 stroke-[1.5] group-hover:text-[#00c8db] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#00c8db] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium text-gray-700 group-hover:text-[#00c8db]">Chariot</span>
            </button>

            {/* Liste de souhaits */}
            <a href="#souhaits" className="flex flex-col items-center relative group">
              <div className="relative">
                <Heart className="w-6 h-6 stroke-[1.5] group-hover:text-[#00c8db] transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#00c8db] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium text-gray-700 group-hover:text-[#00c8db]">Liste de souhaits</span>
            </a>

            {/* Comparer */}
            <a href="#comparer" className="flex flex-col items-center group">
              <RefreshCw className="w-6 h-6 stroke-[1.5] group-hover:text-[#00c8db] transition-colors" />
              <span className="text-xs mt-1 font-medium text-gray-700 group-hover:text-[#00c8db]">Comparer</span>
            </a>

          </div>

          {/* Boutons Mobile */}
          <div className="flex md:hidden items-center space-x-3">
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="p-2 text-gray-700 focus:outline-none relative"
            >
              <ShoppingCart className="w-6 h-6 stroke-[1.5]" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#00c8db] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-800 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>

        </div>
      </div>

      {/* 3. NAVIGATION BASSE : Catégories + Liens de Navigation */}
      <div className="border-t border-gray-100 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-8">
            
            {/* BOUTON DÉROULANT DES CATÉGORIES */}
            <div className="relative">
              <button 
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="bg-[#00c8db] hover:bg-[#00b3c4] text-white font-bold text-sm px-6 py-3.5 rounded-t-md flex items-center gap-3 tracking-wide transition-colors cursor-pointer"
              >
                <Menu className="w-5 h-5 stroke-[2.5]" />
                <span>PARCOURIR LES CATÉGORIES</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* LISTE DÉROULANTE — thème bleu */}
              {isCategoriesOpen && (
                <div className="absolute top-full left-0 w-80 bg-[#00c8db] hover:bg-[#00c8db] to-[#0099a8] shadow-2xl rounded-b-md z-50 max-h-96 overflow-y-auto py-2 ">
                  <button
                    onClick={() => handleCategorySelect(null)}
                    className="w-full text-left px-5 py-2.5 text-sm font-bold text-white hover:bg-white/15 flex items-center justify-between transition-colors border-b border-white/20 cursor-pointer"
                  >
                    <span>Tous les produits</span>
                  </button>
                  
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className="w-full text-left px-5 py-2.5 text-sm text-white/95 hover:bg-white/15 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-white bg-white/20 px-2 py-0.5 rounded-full">
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Liens de menu Desktop */}
            <nav className="flex items-center space-x-8 font-bold text-sm text-gray-800 tracking-wide">
              <button 
                onClick={() => handleNavigation('home')}
                className="py-3.5 border-b-2 border-transparent hover:border-[#00c8db] hover:text-[#00c8db] transition-colors font-bold text-sm cursor-pointer"
              >
                ACCUEIL
              </button>
              <button 
                onClick={() => handleNavigation('shop')} 
                className="py-3.5 border-b-2 border-transparent hover:border-[#00c8db] hover:text-[#00c8db] transition-colors font-bold text-sm cursor-pointer"
              >
                BOUTIQUE
              </button>
              <button 
                onClick={() => handleNavigation('contact')} 
                className="py-3.5 border-b-2 border-transparent hover:border-[#00c8db] hover:text-[#00c8db] transition-colors font-bold text-sm cursor-pointer"
              >
                CONTACT
              </button>
              <button 
                onClick={() => handleNavigation('about')}
                className="py-3.5 border-b-2 border-transparent hover:border-[#00c8db] hover:text-[#00c8db] transition-colors font-bold text-sm cursor-pointer"
              >
                A PROPOS DE NOUS
              </button>
            </nav>

          </div>
        </div>
      </div>

      {/* 4. MENU MOBILE */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pt-3 pb-6 space-y-4 shadow-lg">
          <div className="relative">
            <input
              type="text"
              placeholder="Je fais des courses pour..."
              className="w-full bg-[#f2f2f2] text-gray-700 placeholder-gray-500 rounded-full py-2.5 pl-5 pr-10 text-sm focus:outline-none"
            />
            <Search className="w-4 h-4 text-gray-500 absolute right-4 top-3" />
          </div>

          {/* ACCORDÉON CATÉGORIES MOBILE — thème bleu */}
          <div className="rounded-md overflow-hidden shadow-sm">
            <button 
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="w-full bg-[#00c8db] text-white font-bold text-sm py-3 px-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Menu className="w-5 h-5" />
                <span>PARCOURIR LES CATÉGORIES</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoriesOpen && (
              <div className="bg-gradient-to-b from-[#00c8db] to-[#0099a8] max-h-60 overflow-y-auto">
                <button
                  onClick={() => handleCategorySelect(null)}
                  className="w-full text-left px-4 py-2 text-xs font-bold text-white border-b border-white/20"
                >
                  Tous les produits
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className="w-full text-left px-4 py-2 text-xs text-white/95 hover:bg-white/15 flex justify-between border-b border-white/10"
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-white/80">({cat.count})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <ul className="space-y-3 font-bold text-gray-800 text-sm">
            <li>
              <button 
                onClick={() => handleNavigation('home')} 
                className="block w-full text-left py-1 hover:text-[#00c8db]"
              >
                ACCUEIL
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('shop')} 
                className="block w-full text-left py-1 hover:text-[#00c8db]"
              >
                BOUTIQUE
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('contact')} 
                className="block w-full text-left py-1 hover:text-[#00c8db]"
              >
                CONTACT
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigation('about')} 
                className="block w-full text-left py-1 hover:text-[#00c8db]"
              >
                A PROPOS DE NOUS
              </button>
            </li>
          </ul>

          <div className="pt-4 border-t border-gray-100 flex justify-around text-xs font-medium text-gray-700">
            <button 
              onClick={() => {
                onOpenAuth?.();
                setIsMenuOpen(false);
              }} 
              className="flex flex-col items-center cursor-pointer"
            >
              <User className="w-5 h-5" />
              Compte
            </button>
            <a href="#souhaits" className="flex flex-col items-center"><Heart className="w-5 h-5" />Souhaits</a>
            <a href="#comparer" className="flex flex-col items-center"><RefreshCw className="w-5 h-5" />Comparer</a>
          </div>
        </div>
      )}

      {/* 5. TIROIR LATÉRAL DU CHARIOT */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onNavigate={onNavigate}
      />

    </header>
  );
};
