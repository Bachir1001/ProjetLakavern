import React, { useState } from 'react';
import { Search, User, ShoppingCart, Heart, RefreshCw, Menu, X, MessageCircle } from 'lucide-react';

interface NavbarProps {
  cartCount?: number;
  wishlistCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount = 0, wishlistCount = 0 }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full font-sans bg-white border-b border-gray-100">
      
      {/* 1. TOPBAR : Dégradé Cyan / Violet avec WhatsApp */}
      <div className="w-full bg-gradient-to-t from-[#70e4ef] via-[#a29bfe] to-[#e84393] py-2.5 px-4 text-white font-bold text-center tracking-wide shadow-inner">
  <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
    {/* Bulle WhatsApp Verte ajustée */}
    <div className="bg-[#25D366] text-white p-1.5 rounded-full flex items-center justify-center">
      <MessageCircle className="w-5 h-5 fill-current stroke-none" />
    </div>
    {/* Texte et numéro agrandis */}
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
            <a href="/" className="text-3xl sm:text-4xl font-extrabold text-[#00c8db] tracking-tight">
              LaKavern
            </a>
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
            <a href="#compte" className="flex flex-col items-center group">
              <User className="w-6 h-6 stroke-[1.5] group-hover:text-[#00c8db] transition-colors" />
              <span className="text-xs mt-1 font-medium text-gray-700 group-hover:text-[#00c8db]">Compte</span>
            </a>

            {/* Chariot */}
            <a href="#chariot" className="flex flex-col items-center relative group">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 stroke-[1.5] group-hover:text-[#00c8db] transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#00c8db] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium text-gray-700 group-hover:text-[#00c8db]">Chariot</span>
            </a>

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

          {/* Bouton Menu Mobile */}
          <div className="flex md:hidden items-center space-x-3">
            <a href="#chariot" className="p-2 text-gray-700">
              <ShoppingCart className="w-6 h-6 stroke-[1.5]" />
            </a>
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
            
            {/* Bouton Cyan "PARCOURIR LES CATÉGORIES" */}
            <button className="bg-[#00c8db] hover:bg-[#00b3c4] text-white font-bold text-sm px-6 py-3.5 rounded-t-md flex items-center gap-2 tracking-wide transition-colors">
              <Menu className="w-5 h-5 stroke-[2.5]" />
              <span>PARCOURIR LES CATÉGORIES</span>
            </button>

            {/* Liens de menu */}
            <nav className="flex items-center space-x-8 font-bold text-sm text-gray-800 tracking-wide">
              <a 
                href="/" 
                className="py-3.5 border-b-2 border-gray-900 text-gray-900 transition-colors"
              >
                ACCUEIL
              </a>
              <a 
                href="#boutique" 
                className="py-3.5 border-b-2 border-transparent hover:border-[#00c8db] hover:text-[#00c8db] transition-colors"
              >
                BOUTIQUE
              </a>
              <a 
                href="#contact" 
                className="py-3.5 border-b-2 border-transparent hover:border-[#00c8db] hover:text-[#00c8db] transition-colors"
              >
                CONTACT
              </a>
              <a 
                href="#apropos" 
                className="py-3.5 border-b-2 border-transparent hover:border-[#00c8db] hover:text-[#00c8db] transition-colors"
              >
                A PROPOS DE NOUS
              </a>
            </nav>

          </div>
        </div>
      </div>

      {/* 4. MENU MOBILE */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 pt-3 pb-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Je fais des courses pour..."
              className="w-full bg-[#f2f2f2] text-gray-700 placeholder-gray-500 rounded-full py-2.5 pl-5 pr-10 text-sm focus:outline-none"
            />
            <Search className="w-4 h-4 text-gray-500 absolute right-4 top-3" />
          </div>
          <button className="w-full bg-[#00c8db] text-white font-bold text-sm py-3 rounded-md flex items-center justify-center gap-2">
            <Menu className="w-5 h-5" />
            <span>PARCOURIR LES CATÉGORIES</span>
          </button>
          <ul className="space-y-3 font-bold text-gray-800 text-sm">
            <li><a href="/" className="block py-1 text-[#00c8db]">ACCUEIL</a></li>
            <li><a href="#boutique" className="block py-1 hover:text-[#00c8db]">BOUTIQUE</a></li>
            <li><a href="#contact" className="block py-1 hover:text-[#00c8db]">CONTACT</a></li>
            <li><a href="#apropos" className="block py-1 hover:text-[#00c8db]">A PROPOS DE NOUS</a></li>
          </ul>
          <div className="pt-4 border-t border-gray-100 flex justify-around text-xs font-medium text-gray-700">
            <a href="#compte" className="flex flex-col items-center"><User className="w-5 h-5" />Compte</a>
            <a href="#souhaits" className="flex flex-col items-center"><Heart className="w-5 h-5" />Souhaits</a>
            <a href="#comparer" className="flex flex-col items-center"><RefreshCw className="w-5 h-5" />Comparer</a>
          </div>
        </div>
      )}

    </header>
  );
};