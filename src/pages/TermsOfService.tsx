import React from 'react';
import { FileText, ShoppingBag, Truck, RefreshCw, ShieldAlert, Scale } from 'lucide-react';
import type { PageType } from '../App';

interface TermsOfServiceProps {
  onNavigate?: (page: PageType) => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ onNavigate }) => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
        
        {/* En-tête */}
        <div className="text-center border-b border-gray-100 pb-8 mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-50 rounded-full mb-4">
            <FileText className="w-10 h-10 text-[#00c8db]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Conditions Générales d'Utilisation et de Vente
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Contenu principal */}
        <div className="space-y-8 text-gray-700 leading-relaxed text-sm sm:text-base">
          
          {/* Introduction */}
          <section>
            <p>
              Bienvenue sur <strong>LaKavern</strong>. En accédant à notre site web et en effectuant des achats, vous acceptez de vous conformer aux présentes Conditions Générales d'Utilisation et de Vente. Veuillez les lire attentivement.
            </p>
          </section>

          {/* 1. Objet & Acceptation */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Scale className="w-5 h-5 text-[#00c8db]" />
              <h2>1. Objet et acceptation des conditions</h2>
            </div>
            <p>
              Les présentes conditions régissent l'ensemble des ventes conclues sur la plateforme LaKavern. Tout achat ou utilisation des services implique l'acceptation sans réserve de ces conditions par l'utilisateur.
            </p>
          </section>

          {/* 2. Produits et Commandes */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <ShoppingBag className="w-5 h-5 text-[#00c8db]" />
              <h2>2. Produits, prix et commandes</h2>
            </div>
            <p>
              Les produits affichés sur le site sont disponibles dans la limite des stocks. Les prix sont indiqués en FCFA et peuvent être modifiés à tout moment.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-600">
              <li><strong>Disponibilité :</strong> En cas d'indisponibilité d'un article après validation, vous serez contacté immédiatement.</li>
              <li><strong>Prix :</strong> Les tarifs appliqués sont ceux en vigueur au moment de la validation de la commande.</li>
              <li><strong>Validation :</strong> La confirmation de commande vaut acceptation finale des articles choisis.</li>
            </ul>
          </section>

          {/* 3. Livraison & Paiement */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Truck className="w-5 h-5 text-[#00c8db]" />
              <h2>3. Livraison et modes de paiement</h2>
            </div>
            <p>
              Les livraisons sont effectuées aux coordonnées fournies lors de la commande. Notre service commercial peut vous contacter par téléphone ou WhatsApp (au <strong>77 240 58 58</strong>) pour confirmer l'adresse exacte.
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-600">
              <li><strong>Modalités de paiement :</strong> Paiement à la livraison ou via les solutions de paiement disponibles sur le site.</li>
              <li><strong>Délais :</strong> Les délais de livraison sont donnés à titre indicatif selon la zone géographique.</li>
            </ul>
          </section>

          {/* 4. Retours et Échanges */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <RefreshCw className="w-5 h-5 text-[#00c8db]" />
              <h2>4. Retours, annulations et remboursements</h2>
            </div>
            <p>
              Si un produit présente un défaut de fabrication ou ne correspond pas à votre commande, veuillez contacter le service client dès réception pour convenir d'un échange ou d'un retour.
            </p>
          </section>

          {/* 5. Responsabilité et Propriété Intellectuelle */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <ShieldAlert className="w-5 h-5 text-[#00c8db]" />
              <h2>5. Propriété intellectuelle et responsabilité</h2>
            </div>
            <p>
              L'ensemble des contenus présents sur le site LaKavern (textes, images, logos) reste la propriété exclusive de la plateforme. Toute reproduction non autorisée est interdite.
            </p>
          </section>

          {/* Contact */}
          <section className="space-y-3 pt-4 border-t border-gray-100">
            <p>
              Pour toute question concernant nos conditions de service, n'hésitez pas à nous contacter via notre{' '}
              <button 
                onClick={() => onNavigate?.('contact')}
                className="text-[#00c8db] font-semibold underline hover:opacity-80 cursor-pointer"
              >
                page Contact
              </button>{' '}
              ou directement par téléphone au <strong>77 240 58 58</strong>.
            </p>
          </section>

        </div>

        {/* Pied de page */}
        <div className="mt-10 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} LaKavern. Tous droits réservés.
          </p>
        </div>

      </div>
    </div>
  );
};