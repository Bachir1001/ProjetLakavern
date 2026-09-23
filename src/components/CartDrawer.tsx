import React from 'react';

import {
  X,
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
} from 'lucide-react';

import type { PageType } from '../App';

import {
  useCart,
} from '../context/CartContext';

import {
  formatStorePrice,
} from '../services/woocommerce';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (page: PageType) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  if (!isOpen) {
    return null;
  }

  const handleGoToShop = () => {
    if (onNavigate) {
      onNavigate('shop');
    }

    onClose();
  };

  // Envoie vers la page de validation de commande (choix du quartier,
  // coordonnées, paiement) et referme le tiroir.
  const handleGoToCheckout = () => {
    if (onNavigate) {
      onNavigate('checkout');
    }

    onClose();
  };

  const total = cartItems.reduce(
    (sum, item) => {
      const price =
        Number(item.product.prices.price) /
        Math.pow(
          10,
          item.product.prices.currency_minor_unit
        );

      return sum + price * item.quantity;
    },
    0
  );

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">

      {/* ARRIÈRE-PLAN */}
      <div
        className="fixed inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* TIROIR */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">

        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">

          {/* EN-TÊTE */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

            <div className="flex items-center gap-3">

              <ShoppingCart
                className="w-6 h-6 text-[#00c8db]"
              />

              <h2 className="text-xl font-extrabold text-gray-900">
                Mon panier
              </h2>

            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-900 cursor-pointer"
              aria-label="Fermer le panier"
            >
              <X className="w-6 h-6" />
            </button>

          </div>

          {/* PANIER VIDE */}
          {cartItems.length === 0 ? (

            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">

              <div className="text-gray-200 mb-6">

                <ShoppingCart
                  className="w-32 h-32 stroke-[1]"
                />

              </div>

              <p className="text-xl font-bold text-gray-800 mb-8">
                Aucun produit dans le chariot.
              </p>

              <button
                onClick={handleGoToShop}
                className="w-full bg-[#00c8db] hover:bg-[#00b3c4] text-white font-bold py-3.5 px-6 rounded-lg tracking-wide transition-colors cursor-pointer"
              >
                RETOUR À LA BOUTIQUE
              </button>

            </div>

          ) : (

            <>
              {/* ARTICLES */}
              <div className="flex-1 overflow-y-auto px-5 py-4">

                <div className="space-y-5">

                  {cartItems.map((item, index) => (

                    <div
                      key={`${item.product.id}-${item.variationId ?? 'default'}-${index}`}
                      className="border border-gray-100 rounded-xl p-3"
                    >

                      <div className="flex gap-4">

                        {/* IMAGE */}
                        <div className="w-24 h-24 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">

                          {item.product.images?.[0] ? (

                            <img
                              src={item.product.images[0].src}
                              alt={
                                item.product.images[0].alt ||
                                item.product.name
                              }
                              className="w-full h-full object-cover"
                            />

                          ) : (

                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                              Pas d'image
                            </div>

                          )}

                        </div>

                        {/* INFORMATIONS */}
                        <div className="flex-1 min-w-0">

                          <h3 className="font-bold text-gray-800 text-sm leading-5">
                            {item.product.name}
                          </h3>

                          {item.variationLabel && (

                            <p className="text-xs text-gray-500 mt-1">
                              {item.variationLabel}
                            </p>

                          )}

                          <p className="text-[#00c8db] font-extrabold mt-2">
                            {formatStorePrice(
                              item.product.prices
                            )}{' '}
                            FCFA
                          </p>

                        </div>

                        {/* SUPPRIMER */}
                        <button
                          onClick={() =>
                            removeFromCart(index)
                          }
                          className="self-start p-1.5 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                          aria-label="Supprimer le produit"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>

                      </div>

                      {/* QUANTITÉ */}
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">

                        <span className="text-sm font-semibold text-gray-600">
                          Quantité
                        </span>

                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">

                          <button
                            onClick={() =>
                              updateQuantity(
                                index,
                                item.quantity - 1
                              )
                            }
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>

                          <span className="w-10 text-center font-bold text-sm">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(
                                index,
                                item.quantity + 1
                              )
                            }
                            className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>

                        </div>

                      </div>

                    </div>

                  ))}

                </div>

              </div>

              {/* BAS DU PANIER */}
              <div className="border-t border-gray-100 px-6 py-5 bg-white">

                <div className="flex justify-between items-center mb-5">

                  <span className="text-lg font-bold text-gray-800">
                    Total
                  </span>

                  <span className="text-xl font-extrabold text-[#00c8db]">
                    {total.toLocaleString('fr-FR', {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}{' '}
                    FCFA
                  </span>

                </div>

                <button
                  onClick={handleGoToCheckout}
                  className="w-full bg-[#00c8db] hover:bg-[#00b3c4] text-white font-extrabold py-4 rounded-lg transition-colors cursor-pointer"
                >
                  PASSER LA COMMANDE
                </button>

                <button
                  onClick={handleGoToShop}
                  className="w-full mt-3 border border-[#00c8db] text-[#00c8db] hover:bg-cyan-50 font-bold py-3 rounded-lg transition-colors cursor-pointer"
                >
                  CONTINUER MES ACHATS
                </button>

                <button
                  onClick={clearCart}
                  className="w-full mt-3 text-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  Vider le panier
                </button>

              </div>
            </>

          )}

        </div>

      </div>

    </div>
  );
};
