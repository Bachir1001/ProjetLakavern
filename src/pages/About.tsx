import React, { useState } from 'react';
import { Plus, Minus, ShieldCheck, Truck, Clock, Headphones } from 'lucide-react';

interface AccordionItem {
  title: string;
  content: string;
}

export const About: React.FC = () => {
  // État pour gérer l'ouverture de l'accordéon (index 0 ouvert par défaut)
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const accordionData: AccordionItem[] = [
    {
      title: "Meilleure Qualité",
      content: "Nous sélectionnons soigneusement des produits de haute qualité pour vous offrir ce qu'il y a de mieux pour vos enfants et votre famille. Des sacs durables aux jouets éducatifs, la qualité est notre priorité."
    },
    {
      title: "Service Client",
      content: "Notre équipe est à votre écoute pour vous conseiller, vous aider dans vos choix et assurer un suivi personnalisé de toutes vos commandes."
    },
    {
      title: "Support 24/7",
      content: "Bénéficiez d'une assistance réactive à tout moment via nos canaux digitaux et WhatsApp pour répondre à vos urgences."
    },
    {
      title: "Nos Services",
      content: "Nous proposons un service complet allant de la commande en ligne facile jusqu'à la livraison rapide à domicile à Dakar et dans les régions."
    }
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-white text-gray-800 font-sans py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* EN-TÊTE DE LA PAGE */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#00c8db]">
            À propos de LaKavern
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
            Votre destination privilégiée pour les fournitures scolaires, sacs à dos et équipements de qualité au Sénégal.
          </p>
          <div className="w-20 h-1 bg-[#00c8db] mx-auto rounded-full mt-4"></div>
        </div>

        {/* PRÉSENTATION DU SHOP */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gray-50 p-6 sm:p-10 rounded-2xl">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Qui sommes-nous ?
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Bienvenue chez <strong>Lakavern</strong>, votre boutique de référence dédiée à l’univers des enfants et des parents ! Situés à KM1 Avenue Cheikh Anta Diop, face à l’église Saint Joseph, nous offrons une sélection soigneusement choisie d’articles pour accompagner vos enfants de 0 à 15 ans et répondre également aux besoins des parents.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              De la rentrée scolaire aux moments de jeux, nous avons tout ce qu’il faut pour allier praticité, style et qualité : sacs à dos, gourdes, jouets, ardoises éducatives, lunch bags, trousses, vêtements, lunettes, parapluies, chaussures, articles d’été et bien plus encore.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Notre mission est de rendre vos achats simples et agréables en vous proposant des produits adaptés aux goûts et aux besoins de chacun. Nous nous engageons à vous offrir des articles de qualité à des prix compétitifs, car le bonheur des enfants et la satisfaction des parents sont au cœur de nos préoccupations.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              Merci de nous faire confiance et de nous permettre de participer aux petits et grands moments de votre quotidien !
            </p>
          </div>
          <div className="flex justify-center">
            {/* Remplace "/images/lakavern-shop.jpg" par le chemin de ta photo */}
            <img
              src="/public/imageAbout.webp"
              alt="Boutique LaKavern"
              className="w-full h-full object-cover rounded-xl border border-[#00c8db]/30"
            />
          </div>
        </div>

        {/* SECTION : ACCORDÉON & HEURES D'OUVERTURE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Colonne Gauche : Accordéon */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Ce que nous faisons pour vous ?
            </h2>

            <div className="border border-gray-200 rounded-sm divide-y divide-gray-200">
              {accordionData.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={index} className="transition-colors">
                    <button
                      onClick={() => toggleAccordion(index)}
                      className="w-full py-4 px-5 flex items-center justify-start gap-3 text-left font-semibold text-gray-800 hover:text-[#00c8db] transition-colors focus:outline-none"
                    >
                      {isOpen ? (
                        <Minus className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      ) : (
                        <Plus className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      )}
                      <span>{item.title}</span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed pl-12">
                        {item.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Colonne Droite : Heure d'ouverture */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Heure d'ouverture
            </h2>

            <div className="space-y-3.5 text-sm font-medium text-gray-700">
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span>Lundi:</span>
                <span className="text-gray-900">09h – 21h</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span>Mardi:</span>
                <span className="text-gray-900">09h – 21h</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span>Mercredi:</span>
                <span className="text-gray-900">09h – 21h</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span>Jeudi:</span>
                <span className="text-gray-900">09h – 21h</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span>Vendredi:</span>
                <span className="text-gray-900">09h – 21h</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span>Samedi:</span>
                <span className="text-gray-900">09h – 20h</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span>Dimanche:</span>
                <span className="text-gray-900">10h – 17h</span>
              </div>
            </div>
          </div>

        </div>

        {/* AVANTAGES & ENGAGEMENTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
          <div className="p-5 border border-gray-100 rounded-xl bg-white shadow-sm text-center space-y-2">
            <Truck className="w-8 h-8 text-[#00c8db] mx-auto" />
            <h3 className="font-bold text-gray-900">Livraison Rapide</h3>
            <p className="text-xs text-gray-500">Expédition à Dakar et dans toutes les régions du Sénégal.</p>
          </div>

          <div className="p-5 border border-gray-100 rounded-xl bg-white shadow-sm text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-[#00c8db] mx-auto" />
            <h3 className="font-bold text-gray-900">Qualité Garantie</h3>
            <p className="text-xs text-gray-500">Produits sélectionnés rigoureusement pour leur durabilité.</p>
          </div>

          <div className="p-5 border border-gray-100 rounded-xl bg-white shadow-sm text-center space-y-2">
            <Headphones className="w-8 h-8 text-[#00c8db] mx-auto" />
            <h3 className="font-bold text-gray-900">Support Client</h3>
            <p className="text-xs text-gray-500">Service commercial disponible via WhatsApp au 77 240 58 58.</p>
          </div>

          <div className="p-5 border border-gray-100 rounded-xl bg-white shadow-sm text-center space-y-2">
            <Clock className="w-8 h-8 text-[#00c8db] mx-auto" />
            <h3 className="font-bold text-gray-900">Horaires Souples</h3>
            <p className="text-xs text-gray-500">Ouvert du lundi au dimanche pour répondre à vos besoins.</p>
          </div>
        </div>

      </div>
    </div>
  );
};
