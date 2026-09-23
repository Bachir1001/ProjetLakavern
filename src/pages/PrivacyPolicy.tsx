import React from 'react';
import { ShieldCheck, Lock, Eye, Database, Bell, UserCheck } from 'lucide-react';
import type { PageType } from '../App';
interface PrivacyPolicyProps {
  onNavigate?: (page: PageType) => void;
}
export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
        
        {/* En-tête */}
        <div className="text-center border-b border-gray-100 pb-8 mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-cyan-50 rounded-full mb-4">
            <ShieldCheck className="w-10 h-10 text-[#00c8db]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Politique de Confidentialité
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
              Chez <strong>LaKavern</strong>, nous accordons une importance capitale à la protection de vos données personnelles. Cette politique explique comment nous collectons, utilisons, et protégeons vos informations lorsque vous naviguez sur notre plateforme ou effectuez des achats.
            </p>
          </section>

          {/* 1. Collecte des données */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Database className="w-5 h-5 text-[#00c8db]" />
              <h2>1. Les données que nous collectons</h2>
            </div>
            <p>
              Nous collectons les informations nécessaires pour traiter vos commandes et améliorer votre expérience d'achat :
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-600">
              <li><strong>Informations de compte :</strong> Nom, prénom, adresse e-mail, numéro de téléphone.</li>
              <li><strong>Informations de livraison :</strong> Adresse postale, ville, consignes spécifiques.</li>
              <li><strong>Historique de commande :</strong> Produits achetés, panier, liste de souhaits.</li>
              <li><strong>Données de navigation :</strong> Adresse IP, type de navigateur, cookies nécessaires à la session.</li>
            </ul>
          </section>

          {/* 2. Utilisation des données */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Eye className="w-5 h-5 text-[#00c8db]" />
              <h2>2. Utilisation de vos informations</h2>
            </div>
            <p>Vos données sont principalement utilisées pour :</p>
            <ul className="list-disc pl-6 space-y-1 text-gray-600">
              <li>Traiter et livrer vos commandes dans les meilleurs délais.</li>
              <li>Vous contacter via notre service client (WhatsApp / appel) pour le suivi des livraisons.</li>
              <li>Gérer votre compte client et vos préférences.</li>
              <li>Améliorer le fonctionnement et la sécurité de notre boutique en ligne.</li>
            </ul>
          </section>

          {/* 3. Sécurité */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Lock className="w-5 h-5 text-[#00c8db]" />
              <h2>3. Protection et Sécurité</h2>
            </div>
            <p>
              Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles rigoureuses pour éviter tout accès non autorisé, perte ou altération de vos données personnelles.
            </p>
          </section>

          {/* 4. Partage des données */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <Bell className="w-5 h-5 text-[#00c8db]" />
              <h2>4. Partage à des tiers</h2>
            </div>
            <p>
              <strong>LaKavern ne vend ni ne loue vos données personnelles à des tiers.</strong> Vos informations sont uniquement transmises aux partenaires indispensables à l'exécution de nos services (ex: livreurs et services de paiement sécurisés).
            </p>
          </section>

          {/* 5. Vos droits */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-lg font-bold text-gray-900">
              <UserCheck className="w-5 h-5 text-[#00c8db]" />
              <h2>5. Vos droits</h2>
            </div>
            <p>
              Conformément à la réglementation sur la protection des données, vous disposez d'un droit d'accès, de rectification et de suppression de vos informations personnelles.
            </p>
            <p>
              Pour exercer ce droit ou pour toute question, vous pouvez contacter notre service commercial au <strong>77 240 58 58</strong> ou nous adresser une demande via notre page Contact.
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