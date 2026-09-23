import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Traitement du formulaire (ex: API backend ou EmailJS)
    console.log('Formulaire envoyé :', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-700">
<div className="flex justify-center w-full my-4">
  <div className="inline-flex items-center justify-center gap-2 bg-[#00c8db] hover:bg-[#c400a0] text-white font-bold py-4 px-8 rounded text-sm uppercase tracking-wider transition-colors cursor-pointer">
    Rejoignez-nous dans LaKavern du bonheur et offrez le bonheur à ton enfant
  </div>
</div>
      
      {/* En-tête / Hero Section */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Contactez-nous
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
            Une question sur un produit ou une commande ? N'hésitez pas à nous laisser un message, notre équipe vous répondra dans les plus brefs délais.
          </p>
        </div>
      </div>

      {/* Contenu Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Colonne Gauche : Informations de Contact */}
          <div className="bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4">
              Nos Coordonnées
            </h2>

            {/* Adresse */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-cyan-50 text-[#00c8db] rounded-lg">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Adresse</h3>
                <p className="text-sm text-gray-600 mt-0.5">
                  Fann Hock, rue Woro Fila villa N°06<br />Dakar, Sénégal
                </p>
              </div>
            </div>

            {/* Téléphone */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-cyan-50 text-[#00c8db] rounded-lg">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Téléphone / WhatsApp</h3>
                <a 
                  href="https://wa.me/221772405858" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-gray-600 hover:text-[#00c8db] transition-colors mt-0.5 block"
                >
                  (+221) 77 240 58 58
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-cyan-50 text-[#00c8db] rounded-lg">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Adresse E-mail</h3>
                <a 
                  href="mailto:kange.prestations@gmail.com" 
                  className="text-sm text-gray-600 hover:text-[#00c8db] transition-colors mt-0.5 block break-all"
                >
                  kange.prestations@gmail.com
                </a>
              </div>
            </div>

            {/* Horaires d'ouverture */}
            <div className="flex items-start space-x-4 border-t border-gray-100 pt-6">
              <div className="p-3 bg-cyan-50 text-[#00c8db] rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <div className="w-full">
                <h3 className="font-semibold text-gray-900 text-sm mb-2">Horaires d'Ouverture</h3>
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Lundi - Vendredi :</span>
                    <span className="font-medium text-gray-800">09:00 - 21:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Samedi :</span>
                    <span className="font-medium text-gray-800">09:00 - 20:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimanche :</span>
                    <span className="font-medium text-gray-800">10:00 - 17:00</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Colonne Droite : Formulaire de Message */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 border-b border-gray-100 pb-4 mb-6">
              Envoyez-nous un message
            </h2>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-lg mb-6">
                Merci ! Votre message a bien été envoyé. Nous vous contacterons très prochainement.
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Nom */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Votre Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ex: Amadou Diallo"
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#00c8db]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse e-mail <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ex: amadou@example.com"
                    className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#00c8db]"
                  />
                </div>
              </div>

              {/* Sujet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Ex: Information sur une commande"
                  className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#00c8db]"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Écrivez votre message ici..."
                  className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#00c8db] resize-none"
                />
              </div>

              {/* Bouton Envoi */}
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 bg-[#00c8db] hover:bg-[#00b3c4] text-white font-bold px-8 py-3 rounded text-sm uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
                Envoyer le message
              </button>
            </form>
          </div>

        </div>

        {/* Carte Google Maps intégrée */}
        <div className="mt-12 bg-white p-4 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <h3 className="text-base font-bold text-gray-800 mb-4">Notre Emplacement</h3>
          <div className="w-full h-80 rounded overflow-hidden">
            <iframe
                title="Localisation LaKavern"
                src="https://maps.google.com/maps?q=14.678742,-17.464148&z=17&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

      </div>
    </div>
  );
};