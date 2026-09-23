import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { StoreApiProduct } from '../services/woocommerce';

export interface CartItem {
  product: StoreApiProduct;
  quantity: number;
  variationId?: number;
  variationLabel?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;

  addToCart: (
    product: StoreApiProduct,
    quantity?: number,
    variationId?: number,
    variationLabel?: string
  ) => void;

  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const CART_STORAGE_KEY = 'lakavern_cart';

// Relit le panier sauvegardé dans localStorage au démarrage de l'app.
// Si rien n'est stocké, ou si le contenu est corrompu, on repart d'un panier vide.
function loadStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Erreur lors de la lecture du panier sauvegardé :', err);
    return [];
  }
}

export const CartProvider: React.FC<CartProviderProps> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(loadStoredCart);

  // Sauvegarde automatique du panier à chaque changement,
  // pour qu'il survive à un rechargement de page ou une fermeture d'onglet.
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.error('Erreur lors de la sauvegarde du panier :', err);
    }
  }, [cartItems]);

  const addToCart = (
    product: StoreApiProduct,
    quantity = 1,
    variationId?: number,
    variationLabel?: string
  ) => {
    setCartItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.variationId === variationId
      );

      if (existingIndex !== -1) {
        return currentItems.map((item, index) =>
          index === existingIndex
            ? {
                ...item,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }

      return [
        ...currentItems,
        {
          product,
          quantity,
          variationId,
          variationLabel,
        },
      ];
    });
  };

  const removeFromCart = (index: number) => {
    setCartItems((currentItems) =>
      currentItems.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart doit être utilisé à l’intérieur de CartProvider'
    );
  }

  return context;
};
