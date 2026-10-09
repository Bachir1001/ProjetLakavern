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
import { createOrder, getOrderStatus } from '../services/paymentApi';

interface CheckoutProps {
  onNavigate: (page: PageType) => void;
}

type PaymentMethod = 'cash' | 'online';

// Ce qu'on garde de côté avant de partir sur la page de paiement, pour pouvoir
// retrouver la commande et afficher la confirmation au retour sur le site.
interface PendingOrder {
  orderId: number;
  orderKey: string;
  fullName: string;
  phone: string;
  total: number;
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
  const [email, setEmail] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');

  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [verifying, setVerifying] = useState(false);
  // Paiement pas encore confirmé par le serveur : on propose de vérifier à nouveau
  const [awaitingPayment, setAwaitingPayment] = useState<PendingOrder | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [lastOrderTotal, setLastOrderTotal] = useState(0);
  const [lastOrderName, setLastOrderName] = useState('');
  const [lastOrderPhone, setLastOrderPhone] = useState('');
  const [lastOrderNumber, setLastOrderNumber] = useState('');

  const subtotal = cartItems.reduce((sum, item) => {
    const price =
      Number(item.product.prices.price) /
      Math.pow(10, item.product.prices.currency_minor_unit);
    return sum + price * item.quantity;
  }, 0);

  const total = subtotal + deliveryFee;

  // Demande au serveur si la commande est payée, puis affiche le bon écran.
  const checkPaymentStatus = async (pending: PendingOrder) => {
    setVerifying(true);
    setFormError('');

    try {
      const result = await getOrderStatus(pending.orderId, pending.orderKey);

      if (result.paid) {
        setLastOrderTotal(result.total);
        setLastOrderName(pending.fullName);
        setLastOrderPhone(pending.phone);
        setLastOrderNumber(result.orderNumber);
        setAwaitingPayment(null);
        setOrderConfirmed(true);
        clearCart();
        localStorage.removeItem(PENDING_ORDER_KEY);
      } else if (result.status === 'pending' || result.status === 'on-hold') {
        // Le paiement n'est pas (encore) confirmé : la confirmation peut arriver avec un léger retard.
        setAwaitingPayment(pending);
      } else {
        setAwaitingPayment(null);
        setFormError("Le paiement n'a pas abouti. Vous pouvez réessayer ou choisir de payer à la livraison.");
        localStorage.removeItem(PENDING_ORDER_KEY);
      }
    } catch {
      setAwaitingPayment(pending);
      setFormError("Impossible de vérifier votre paiement pour le moment. Si vous avez été débité, contactez-nous au 77 240 58 58.");
    } finally {
      setVerifying(false);
    }
  };

  // Au chargement : si on revient du paiement (?payment=return&order=...&key=...),
  // on interroge le serveur pour savoir si la commande est bien payée.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') !== 'return') return;

    const orderId = Number(params.get('order'));
    const orderKey = params.get('key') ?? '';

    // Nettoie l'adresse pour ne pas retraiter le retour à un rechargement
    window.history.replaceState({}, '', window.location.pathname);

    if (!orderId || !orderKey) {
      setFormError("Impossible de retrouver votre commande. Si vous avez été débité, contactez-nous au 77 240 58 58.");
      return;
    }

    let stored: Partial<PendingOrder> | null = null;
    try {
      const raw = localStorage.getItem(PENDING_ORDER_KEY);
      stored = raw ? JSON.parse(raw) : null;
    } catch {
      stored = null;
    }

    checkPaymentStatus({
      orderId,
      orderKey,
      fullName: stored?.fullName ?? '',
      phone: stored?.phone ?? '',
      total: stored?.total ?? 0,
    });
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

    setSubmitting(true);

    try {
      // Crée la vraie commande WooCommerce. Les prix sont relus côté serveur.
      const order = await createOrder({
        items: cartItems.map((item) => ({
          productId: item.product.id,
          variationId: item.variationId,
          quantity: item.quantity,
        })),
        billing: {
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: addressDetails.trim(),
          neighborhood: neighborhoodName,
        },
        deliveryFee,
        paymentMethod: paymentMethod === 'cash' ? 'cod' : 'paydunya',
        clientReference: `order_${Date.now()}`,
        returnUrl: `${window.location.origin}${window.location.pathname}`,
      });

      // Paiement à la livraison : la commande est enregistrée, on confirme directement.
      if (!order.redirectUrl) {
        setLastOrderTotal(order.total);
        setLastOrderName(fullName);
        setLastOrderPhone(phone);
        setLastOrderNumber(String(order.orderId));
        setOrderConfirmed(true);
        setSubmitting(false);
        clearCart();
        return;
      }

      // Paiement en ligne : on garde de quoi retrouver la commande, puis on envoie
      // le client payer (l'extension PayDunya ouvre Wave, Orange Money, etc.).
      const pending: PendingOrder = {
        orderId: order.orderId,
        orderKey: order.orderKey,
        fullName: fullName.trim(),
        phone: phone.trim(),
        total: order.total,
      };
      localStorage.setItem(PENDING_ORDER_KEY, JSON.stringify(pending));

      window.location.href = order.redirectUrl;
    } catch (err) {
      console.error('Erreur lors de la création de la commande :', err);
      setFormError(
        err instanceof Error
          ? err.message
          : 'Impossible de valider la commande pour le moment. Réessayez.'
      );
      setSubmitting(false);
    }
  };

  // ================================
  // VÉRIFICATION DU PAIEMENT EN COURS
  // ================================
  if (verifying) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center font-sans">
        <Loader2 className="w-12 h-12 animate-spin text-[#00c8db] mx-auto mb-6" />
        <h1 className="text-xl font-bold text-gray-800 mb-2">
          Vérification de votre paiement...
        </h1>
        <p className="text-gray-500">Merci de patienter quelques secondes.</p>
      </div>
    );
  }

  // ================================
  // PAIEMENT PAS ENCORE CONFIRMÉ
  // ================================
  if (awaitingPayment) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center font-sans">
        <Loader2 className="w-12 h-12 text-[#00c8db] mx-auto mb-6" />
        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">
          Paiement en cours de confirmation
        </h1>
        <p className="text-gray-600 mb-2">
          Nous n'avons pas encore reçu la confirmation de votre paiement. Cela peut prendre quelques instants.
        </p>
        <p className="text-gray-500 text-sm mb-8">
          Si vous avez été débité, ne payez pas une seconde fois : contactez-nous au 77 240 58 58.
        </p>

        {formError && (
          <p className="text-sm text-red-500 font-medium mb-6">{formError}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => checkPaymentStatus(awaitingPayment)}
            className="bg-[#00c8db] hover:bg-[#00b3c4] text-white font-bold px-8 py-3 rounded-lg transition-colors cursor-pointer"
          >
            Vérifier à nouveau
          </button>
          <button
            onClick={() => {
              setAwaitingPayment(null);
              setFormError('');
            }}
            className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-bold px-8 py-3 rounded-lg transition-colors cursor-pointer"
          >
            Retour à la commande
          </button>
        </div>
      </div>
    );
  }

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
          Merci {lastOrderName}, nous avons bien reçu votre commande
          {lastOrderNumber ? ` n°${lastOrderNumber}` : ''}.
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
        {formError && (
          <p className="text-sm text-red-500 font-medium mt-6">{formError}</p>
        )}
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
                E-mail (optionnel)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ex: awa@example.com"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  { id: 'cash', label: 'Espèces à la livraison' },
                  { id: 'online', label: 'Paiement en ligne' },
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
              {paymentMethod === 'online' && (
                <p className="text-xs text-gray-500 mt-2">
                  Vous serez redirigé vers la page de paiement sécurisée PayDunya, où vous choisirez votre moyen de paiement (Wave, Orange Money, etc.).
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
                'PAYER EN LIGNE'
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
