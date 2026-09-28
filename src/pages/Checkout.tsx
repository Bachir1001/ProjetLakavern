import React, { useEffect, useState } from 'react';

import {
  ShoppingBag,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
} from 'lucide-react';

import type { PageType } from '../App';
import { useCart } from '../context/CartContext';
import { formatStorePrice } from '../services/woocommerce';
import { DeliverySelector } from '../components/DeliverySelector';
import { createPaymentSession, type PaymentProvider } from '../services/paymentApi';

interface CheckoutProps {
  onNavigate: (page: PageType) => void;
}

type PaymentMethod = 'wave' | 'orange_money' | 'cash';

// Ce qu'on garde de côté en local avant de partir sur Wave/Orange Money,
// pour pouvoir afficher la confirmation une fois revenu sur le site.
interface PendingOrder {
  fullName: string;
  phone: string;
  total: number;
  neighborhoodName: string;
  clientReference: string;
}

const PENDING_ORDER_KEY = 'lakavern_pending_order';

export const Checkout: React.FC<CheckoutProps> = ({ onNavigate }) => {
  const { cartItems, clearCart } = useCart();

  // Livraison
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [neighborhoodName, setNeighborhoodName] = useState('');

  // Coordonnées client
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [lastOrderTotal, setLastOrderTotal] = useState(0);
  const [lastOrderName, setLastOrderName] = useState('');
  const [lastOrderPhone, setLastOrderPhone] = useState('');

  const subtotal = cartItems.reduce((sum, item) => {
    const price =
      Number(item.product.prices.price) /
      Math.pow(10, item.product.prices.currency_minor_unit);
    return sum + price * item.quantity;
  }, 0);

  const total = subtotal + deliveryFee;

  // Au chargement de la page : si on revient d'un paiement Wave/Orange Money
  // (redirection avec ?payment=success ou ?payment=error dans l'URL), on
  // affiche le bon écran, sans perdre les infos de la commande en cours.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get('payment');

    if (!paymentStatus) return;

    const rawPending = localStorage.getItem(PENDING_ORDER_KEY);
    const pending: PendingOrder | null = rawPending ? JSON.parse(rawPending) : null;

    if (paymentStatus === 'success') {
      if (pending) {
        setLastOrderTotal(pending.total);
        setLastOrderName(pending.fullName);
        setLastOrderPhone(pending.phone);
      }
      setOrderConfirmed(true);
      clearCart();
      localStorage.removeItem(PENDING_ORDER_KEY);
    } else if (paymentStatus === 'error') {
      setFormError('Le paiement a été annulé ou a échoué. Vous pouvez réessayer ou choisir un autre mode de paiement.');
      localStorage.removeItem(PENDING_ORDER_KEY);
    }

    // Nettoie l'URL pour ne pas re-déclencher ce traitement à un rechargement
    window.history.replaceState({}, '', window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectDeliveryFee = (fee: number, name: string) => {
    setDeliveryFee(fee);
    setNeighborhoodName(name);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName.trim() || !phone.trim()) {
      setFormError('Merci de renseigner votre nom et votre numéro de téléphone.');
      return;
    }

    if (!neighborhoodName) {
      setFormError('Merci de sélectionner votre quartier de livraison.');
      return;
    }

    // Paiement à la livraison : pas de redirection, on confirme directement.
    if (paymentMethod === 'cash') {
      setLastOrderTotal(total);
      setLastOrderName(fullName);
      setLastOrderPhone(phone);
      setOrderConfirmed(true);
      clearCart();
      return;
    }

    // Paiement en ligne (Wave / Orange Money) : on crée la session côté
    // serveur, puis on redirige le navigateur vers l'app / la page de paiement.
    setSubmitting(true);

    const clientReference = `order_${Date.now()}`;

    const pendingOrder: PendingOrder = {
      fullName,
      phone,
      total,
      neighborhoodName,
      clientReference,
    };
    localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(pendingOrder));

    const baseUrl = `${window.location.origin}${window.location.pathname}`;

    try {
      const redirectUrl = await createPaymentSession({
        provider: paymentMethod as PaymentProvider,
        amount: Math.round(total),
        clientReference,
        successUrl: `${baseUrl}?payment=success`,
        errorUrl: `${baseUrl}?payment=error`,
      });

      // Ouvre l'application Wave / Orange Money (ou leur page web de secours)
      window.location.href = redirectUrl;
    } catch (err) {
      console.error('Erreur lors de la création de la session de paiement :', err);
      setFormError(
        err instanceof Error
          ? err.message
          : "Impossible de lancer le paiement pour le moment. Réessayez."
      );
      localStorage.removeItem(PENDING_ORDER_KEY);
      setSubmitting(false);
    }
  };

  // ================================
  // ÉCRAN DE CONFIRMATION
  // ================================
  if (orderConfirmed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center font-sans">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">
          Commande confirmée !
        </h1>
        <p className="text-gray-600 mb-1">
          Merci {lastOrderName}, nous avons bien reçu votre commande.
        </p>
        <p className="text-gray-600 mb-8">
          Total : <span className="font-bold text-[#00c8db]">
            {lastOrderTotal.toLocaleString('fr-FR')} FCFA
          </span>{' '}
          — notre équipe vous contactera au {lastOrderPhone} pour confirmer la livraison.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="bg-[#00c8db] hover:bg-[#00b3c4] text-white font-bold px-8 py-3 rounded-lg transition-colors cursor-pointer"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  // ================================
  // PANIER VIDE
  // ================================
  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center font-sans">
        <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Votre panier est vide
        </h1>
        <p className="text-gray-500 mb-8">
          Ajoutez des produits avant de passer commande.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="bg-[#00c8db] hover:bg-[#00b3c4] text-white font-bold px-8 py-3 rounded-lg transition-colors cursor-pointer"
        >
          Aller à la boutique
        </button>
      </div>
    );
  }

  // ================================
  // FORMULAIRE DE COMMANDE
  // ================================
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">

      <button
        onClick={() => onNavigate('shop')}
        className="flex items-center gap-2 text-gray-600 hover:text-[#00c8db] font-semibold mb-8 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Continuer mes achats
      </button>

      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">
        Finaliser ma commande
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* COLONNE GAUCHE : LIVRAISON + FORMULAIRE */}
        <div className="lg:col-span-2 space-y-6">

          <DeliverySelector onSelectDeliveryFee={handleSelectDeliveryFee} />

          <form onSubmit={handleSubmitOrder} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 text-lg">Vos coordonnées</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex: Awa Diop"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#00c8db] focus:ring-1 focus:ring-[#00c8db]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 77 240 58 58"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#00c8db] focus:ring-1 focus:ring-[#00c8db]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse complémentaire (optionnel)
              </label>
              <input
                type="text"
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
                placeholder="Ex: Villa n°12, près de la pharmacie"
                className="w-full bg-gray-50 border border-gray-300 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-[#00c8db] focus:ring-1 focus:ring-[#00c8db]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Méthode de paiement
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {([
                  { id: 'cash', label: 'Espèces à la livraison' },
                  { id: 'wave', label: 'Wave' },
                  { id: 'orange_money', label: 'Orange Money' },
                ] as { id: PaymentMethod; label: string }[]).map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPaymentMethod(option.id)}
                    className={`px-4 py-3 rounded-xl border-2 text-sm font-semibold transition-all cursor-pointer ${
                      paymentMethod === option.id
                        ? 'border-[#00c8db] bg-cyan-50 text-[#00aebf]'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {paymentMethod !== 'cash' && (
                <p className="text-xs text-gray-500 mt-2">
                  Vous serez redirigé vers l'application {paymentMethod === 'wave' ? 'Wave' : 'Orange Money'} pour finaliser le paiement.
                </p>
              )}
            </div>

            {formError && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-lg p-3">
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 font-medium">{formError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#00c8db] hover:bg-[#00b3c4] disabled:opacity-70 disabled:cursor-not-allowed text-white font-extrabold py-4 rounded-xl transition-colors cursor-pointer mt-2 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirection en cours...
                </>
              ) : paymentMethod === 'cash' ? (
                'VALIDER LA COMMANDE'
              ) : (
                `PAYER AVEC ${paymentMethod === 'wave' ? 'WAVE' : 'ORANGE MONEY'}`
              )}
            </button>
          </form>

        </div>

        {/* COLONNE DROITE : RÉCAPITULATIF */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24 space-y-4">
            <h3 className="font-bold text-gray-900 text-lg mb-2">Récapitulatif</h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item, index) => (
                <div key={`${item.product.id}-${item.variationId ?? 'default'}-${index}`} className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0].src}
                        alt={item.product.images[0].alt || item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                        Pas d'image
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-800 line-clamp-1">{item.product.name}</p>
                    {item.variationLabel && (
                      <p className="text-[11px] text-gray-500">{item.variationLabel}</p>
                    )}
                    <p className="text-[11px] text-gray-500">Qté : {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-700 whitespace-nowrap">
                    {formatStorePrice(item.product.prices)} FCFA
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Sous-total</span>
                <span>{subtotal.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Livraison{neighborhoodName ? ` (${neighborhoodName})` : ''}</span>
                <span>
                  {neighborhoodName ? `${deliveryFee.toLocaleString('fr-FR')} FCFA` : '—'}
                </span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span className="text-[#00c8db]">{total.toLocaleString('fr-FR')} FCFA</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
