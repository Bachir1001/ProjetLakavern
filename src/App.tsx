import { useState } from 'react';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

import { About } from './pages/About';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Checkout } from './components/CheckoutPage';
import { ContactPage } from './pages/contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';

import {
  CartProvider,
  useCart,
} from './context/CartContext';

export type PageType =
  | 'home'
  | 'about'
  | 'contact'
  | 'shop'
  | 'privacy'
  | 'terms'
  | 'checkout';

function AppContent() {
  const [currentPage, setCurrentPage] =
    useState<PageType>('home');

  // Catégorie choisie depuis le menu bleu "PARCOURIR LES CATÉGORIES" de la Navbar
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] =
    useState(false);

  const { cartCount } = useCart();

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Appelée par la Navbar quand on clique sur une catégorie du menu déroulant
  const handleSelectCategory = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    handleNavigate('shop');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white">

      <Navbar
        cartCount={cartCount}
        wishlistCount={0}
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectCategory}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <main className="flex-grow">
        {currentPage === 'home' && (
          <Home onNavigate={handleNavigate} onSelectCategory={handleSelectCategory} />
        )}

        {currentPage === 'shop' && (
          <Shop selectedCategoryId={selectedCategoryId} />
        )}

        {currentPage === 'checkout' && (
          <Checkout onNavigate={handleNavigate} />
        )}

        {currentPage === 'about' && (
          <About />
        )}

        {currentPage === 'contact' && (
          <ContactPage />
        )}

        {currentPage === 'privacy' && (
          <PrivacyPolicy onNavigate={handleNavigate} />
        )}

        {currentPage === 'terms' && (
          <TermsOfService onNavigate={handleNavigate} />
        )}
      </main>

      <Footer
        onNavigate={handleNavigate}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

export default App;
