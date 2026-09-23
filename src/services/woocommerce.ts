// Client pour la WooCommerce Store API — l'API publique de WooCommerce,
// conçue pour les sites headless comme celui-ci.
// Contrairement à l'API REST v3 classique, elle ne nécessite AUCUNE clé
// secrète pour la lecture des produits et catégories : elle peut donc
// être appelée en toute sécurité directement depuis le navigateur.
//
// ⚠️ STORE_API_BASE pointe vers "/woo-api", un proxy (ex: configuré dans
// vite.config.ts en dev) qui redirige vers https://VOTRE-SITE/wp-json/wc/store/v1
// Pensez à mettre en place l'équivalent de ce proxy en production
// (rewrite Nginx / Vercel / Netlify) si vous gardez cette approche.
const STORE_API_BASE = '/woo-api';

export interface StoreApiPrices {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
}

export interface StoreApiImage {
  id: number;
  src: string;
  thumbnail: string;
  alt: string;
}

export interface StoreApiCategory {
  image: any;
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface StoreApiAttributeTerm {
  id: number;
  name: string;
  slug: string;
}

export interface StoreApiAttribute {
  id: number;
  name: string;
  taxonomy?: string;
  has_variations?: boolean;
  terms: StoreApiAttributeTerm[];
}

export interface StoreApiVariationAttribute {
  name: string;
  value: string; // slug du terme choisi pour cette variation
}

export interface StoreApiVariation {
  id: number;
  attributes: StoreApiVariationAttribute[];
}

export interface StoreApiProduct {
  id: number;
  name: string;
  permalink: string;
  sku: string;
  description: string; // HTML
  short_description: string; // HTML
  on_sale: boolean;
  prices: StoreApiPrices;
  images: StoreApiImage[];
  categories: { id: number; name: string; slug: string }[];
  attributes: StoreApiAttribute[];
  is_in_stock: boolean;
  average_rating: string;
  review_count: number;
  variations?: StoreApiVariation[];
}

/**
 * Convertit le prix renvoyé par la Store API (en unité mineure, ex: centimes)
 * en montant affichable, ex: "1000" avec currency_minor_unit=2 -> 10.00
 */
export function formatStorePrice(prices: StoreApiPrices): string {
  const amount = Number(prices.price) / Math.pow(10, prices.currency_minor_unit);
  return amount.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

async function request<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const query = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const url = `${STORE_API_BASE}${path}${query ? `?${query}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur WooCommerce Store API (${response.status}) sur ${path}`);
  }

  return response.json() as Promise<T>;
}

export interface PagedResult<T> {
  items: T[];
  totalPages: number;
  total: number;
}

/**
 * Comme `request`, mais lit aussi les en-têtes de pagination renvoyés par
 * WordPress (X-WP-Total / X-WP-TotalPages) pour savoir combien de pages
 * de produits existent au total sur le site.
 */
async function requestPaged<T>(path: string, params: Record<string, string | number> = {}): Promise<PagedResult<T>> {
  const query = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      acc[key] = String(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  const url = `${STORE_API_BASE}${path}${query ? `?${query}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur WooCommerce Store API (${response.status}) sur ${path}`);
  }

  const totalPages = Number(response.headers.get('X-WP-TotalPages') || '1');
  const total = Number(response.headers.get('X-WP-Total') || '0');
  const items = (await response.json()) as T[];

  return { items, totalPages, total };
}

// --- Gestion du panier ---
// Le panier de la Store API repose sur un "Cart-Token" (jeton) + un "Nonce"
// renvoyés dans les en-têtes de réponse. On les garde en mémoire + localStorage
// pour que le panier persiste entre deux visites.
let cartToken: string | null = localStorage.getItem('wc_cart_token');
let cartNonce: string | null = null;

function storeSessionHeaders(response: Response) {
  const nonce = response.headers.get('Nonce');
  const token = response.headers.get('Cart-Token');
  if (nonce) cartNonce = nonce;
  if (token) {
    cartToken = token;
    localStorage.setItem('wc_cart_token', token);
  }
}

function sessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  if (cartNonce) headers['Nonce'] = cartNonce;
  if (cartToken) headers['Cart-Token'] = cartToken;
  return headers;
}

export interface StoreApiCart {
  items_count: number;
  items: any[];
  totals: { total_price: string; currency_minor_unit: number };
}

/** Récupère (ou initialise) la session panier : nécessaire avant tout ajout */
async function ensureCartSession(): Promise<StoreApiCart> {
  const response = await fetch(`${STORE_API_BASE}/cart`, {
    headers: sessionHeaders(),
  });
  storeSessionHeaders(response);
  if (!response.ok) {
    throw new Error('Impossible de récupérer le panier.');
  }
  return response.json();
}

async function addToCart(id: number, quantity = 1): Promise<StoreApiCart> {
  if (!cartNonce) {
    await ensureCartSession();
  }

  const response = await fetch(`${STORE_API_BASE}/cart/add-item`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...sessionHeaders(),
    },
    body: JSON.stringify({ id, quantity }),
  });

  storeSessionHeaders(response);

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.message || "Erreur lors de l'ajout au panier.");
  }

  return response.json();
}

export const wooApi = {
  getProducts: (params: { category?: number; per_page?: number } = {}) => {
    const query: Record<string, string | number> = {
      per_page: params.per_page ?? 20,
    };
    if (params.category) {
      query.category = params.category;
    }
    return request<StoreApiProduct[]>('/products', query);
  },

  // Version paginée : renvoie aussi le nombre total de pages/produits,
  // pour afficher une navigation "Page 1, 2, 3..." tout en gardant la
  // même grille (même nombre de colonnes) à chaque page.
  getProductsPaged: (params: { category?: number; per_page?: number; page?: number } = {}) => {
    const query: Record<string, string | number> = {
      per_page: params.per_page ?? 20,
      page: params.page ?? 1,
    };
    if (params.category) {
      query.category = params.category;
    }
    return requestPaged<StoreApiProduct>('/products', query);
  },

  getCategories: (params: { per_page?: number } = {}) => {
    return request<StoreApiCategory[]>('/products/categories', {
      per_page: params.per_page ?? 20,
    });
  },

  getCart: ensureCartSession,
  addToCart,
};
