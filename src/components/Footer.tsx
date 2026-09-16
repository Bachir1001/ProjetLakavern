import React from 'react';
import { MessageCircle, ChevronUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#f8f9fa] text-gray-700 font-sans border-t border-gray-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* LIGNE SUPÉRIEURE : Logo, Réseaux Sociaux & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 mb-8 border-b border-gray-200">
          
          {/* Logo */}
          <div className="md:col-span-3">
            <a href="/" className="text-3xl font-extrabold text-[#00c8db] tracking-tight">
              LaKavern
            </a>
          </div>

          {/* Réseaux Sociaux */}
          <div className="md:col-span-3 flex items-center space-x-4 text-gray-700">
            {/* Icône Facebook (SVG inline, non fournie par lucide-react) */}
            <a href="#" className="hover:text-[#00c8db] transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.23.19 2.23.19v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z"/>
              </svg>
            </a>
            {/* Icône Instagram (SVG inline, non fournie par lucide-react) */}
            <a href="#" className="hover:text-[#00c8db] transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.24 2.22.4.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.35 1.05.4 2.22.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.8-.4 2.22-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.35-2.22.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.24-2.22-.4-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.35-1.05-.4-2.22-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.24-1.8.4-2.22.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.35 2.22-.4 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 5.77.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.39C1.34 2.68.93 3.35.62 4.14.32 4.9.12 5.77.06 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.28.26 2.15.56 2.91.31.79.72 1.46 1.39 2.13.67.67 1.34 1.08 2.13 1.39.76.3 1.63.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.28-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.39.67-.67 1.08-1.34 1.39-2.13.3-.76.5-1.63.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.28-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.39-2.13C21.32 1.34 20.65.93 19.86.62c-.76-.3-1.63-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4zm6.4-10.85a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44z"/>
              </svg>
            </a>
            <a href="#" className="hover:text-[#00c8db] transition-colors"><MessageCircle className="w-5 h-5" /></a>
            {/* Icône TikTok textuelle SVG */}
            <a href="#" className="hover:text-[#00c8db] transition-colors font-bold text-sm">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12.525 0h3.08c.12 1.024.715 2.001 1.62 2.662.9.66 2.04.992 3.175.992v3.125a6.837 6.837 0 0 1-3.615-.992v8.283c0 1.25-.333 2.47-1.002 3.525a6.568 6.568 0 0 1-2.73 2.378c-1.12.518-2.36.78-3.608.756a6.52 6.52 0 0 1-3.525-1.002 6.643 6.643 0 0 1-2.378-2.73 6.58 6.58 0 0 1-.756-3.608c.024-1.25.356-2.47 1.025-3.525a6.623 6.623 0 0 1 2.73-2.378 6.57 6.57 0 0 1 3.608-.756v3.18a3.483 3.483 0 0 0-1.92.56 3.46 3.46 0 0 0-1.282 1.48 3.513 3.513 0 0 0-.39 1.95c.023.682.222 1.345.578 1.92a3.49 3.49 0 0 0 1.48 1.282c.575.297 1.22.44 1.87.42a3.483 3.483 0 0 0 2.522-1.03 3.516 3.516 0 0 0 1.03-2.522V0z"/>
              </svg>
            </a>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-6 flex">
            <input
              type="email"
              placeholder="Entrer votre email ici"
              className="w-full bg-white border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:border-[#00c8db]"
            />
            <button className="bg-[#00c8db] hover:bg-[#00b3c4] text-white font-bold px-8 py-2.5 text-sm uppercase tracking-wider transition-colors flex-shrink-0">
              INSCRIRE
            </button>
          </div>

        </div>

        {/* LIGNE PRINCIPALE : Infos, Liens, Horaires & Paiement */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          
          {/* Colonne 1 : Coordonnées */}
          <div className="space-y-3">
            <p className="text-gray-600">Fann Hock,rue Woro Fila villa N°06</p>
            <p className="text-gray-600">(+221) 77-240-58-58</p>
            <p className="text-gray-600">kange.prestations@gmail.com</p>
            <p className="text-gray-600">lakavernshop.com</p>
          </div>

          {/* Colonne 2 : Liens de navigation */}
          <div className="space-y-3 font-semibold">
            <a href="/" className="block text-[#70b800] hover:underline">ACCUEIL</a>
            <a href="#boutique" className="block text-gray-800 hover:text-[#00c8db]">BOUTIQUE</a>
            <a href="#contact" className="block text-gray-800 hover:text-[#00c8db]">CONTACT</a>
            <a href="#apropos" className="block text-gray-800 hover:text-[#00c8db]">A PROPOS DE NOUS</a>
          </div>

          {/* Colonne 3 : Informations Légales */}
          <div className="space-y-3 font-medium text-gray-600">
            <a href="#politique" className="block hover:text-[#00c8db]">Politique de confidentialité</a>
            <a href="#compte" className="block hover:text-[#00c8db]">Mon compte</a>
            <a href="#conditions" className="block hover:text-[#00c8db]">Conditions de Service</a>
          </div>

          {/* Colonne 4 : Horaires & Cartes de paiement */}
          <div className="space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-600">Lundi - Vendredi</span>
                <span className="font-semibold text-gray-800">09:00 - 21:00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-600">Samedi</span>
                <span className="font-semibold text-gray-800">09:00 - 20:00</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-600">Dimanche</span>
                <span className="font-semibold text-gray-800">10:00 - 17:00</span>
              </div>
            </div>

            {/* Badges de Paiement */}
            <div className="flex items-center justify-end space-x-2 pt-2">
              <span className="px-2 py-0.5 border border-gray-200 bg-white text-[10px] font-bold text-blue-800 rounded italic">VISA</span>
              <span className="px-2 py-0.5 border border-gray-200 bg-white text-[10px] font-bold text-red-600 rounded italic">MasterCard</span>
              <span className="px-2 py-0.5 border border-gray-200 bg-white text-[10px] font-bold text-orange-600 rounded italic">DISCOVER</span>
              <span className="px-2 py-0.5 border border-gray-200 bg-white text-[10px] font-bold text-blue-600 rounded italic">PayPal</span>
            </div>
          </div>

        </div>

      </div>

      {/* COPYRIGHT BAS DE PAGE */}
      <div className="border-t border-gray-200 py-4 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs text-gray-600 font-medium">
          LAKAVERNSHOP © 2024 – Tous Droit Réservé !
        </div>
      </div>

      {/* BOUTON RETOUR EN HAUT */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-20 right-6 bg-white border border-gray-200 text-gray-700 p-2.5 rounded-full shadow-md hover:bg-gray-50 transition-all z-40"
        aria-label="Retour en haut"
      >
        <ChevronUp className="w-5 h-5" />
      </button>

      {/* BOUTON FLOTTANT WHATSAPP */}
      <a
        href="https://wa.me/221772405858"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-50 flex items-center justify-center"
        aria-label="WhatsApp Service Client"
      >
        <MessageCircle className="w-7 h-7 fill-current stroke-none" />
      </a>

    </footer>
  );
};
