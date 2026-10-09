// Appelle notre plugin WordPress "LaKavern - Commandes & Paiement en ligne".
// Le plugin crée la vraie commande WooCommerce et confie le paiement à l'extension
// PayDunya installée sur WordPress. Aucune clé secrète n'est présente côté navigateur.

// "/lakavern-api" est un proxy (comme "/woo-api" pour les produits) qui redirige
// vers https://VOTRE-SITE/wp-json/lakavern/v1 — voir vite.config.ts (en local)
// et vercel.json (en ligne).
const API_BASE = '/lakavern-api';

export interface OrderItemInput {
  productId: number;
  variationId?: number;
  quantity: number;
}

export interface OrderBillingInput {
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  neighborhood: string;
}

export interface CreateOrderParams {
  items: OrderItemInput[];
  billing: OrderBillingInput;
  deliveryFee: number; // en FCFA
  paymentMethod: 'paydunya' | 'cod';
  clientReference: string;
  returnUrl: string; // adresse du site React où ramener le client après le paiement
}

export interface CreatedOrder {
  orderId: number;
  orderKey: string;
  total: number; // total réel calculé par le serveur, en FCFA
  redirectUrl: string | null; // null pour un paiement à la livraison
}

export interface OrderStatus {
  status: string; // statut WooCommerce : pending, processing, completed, failed, cancelled...
  paid: boolean;
  total: number;
  orderNumber: string;
}

async function readJson(response: Response) {
  return response.json().catch(() => null);
}

/**
 * Crée la commande sur WooCommerce. Pour un paiement en ligne, la réponse contient
 * l'adresse vers laquelle envoyer le client pour qu'il paie.
 */
export async function createOrder(params: CreateOrderParams): Promise<CreatedOrder> {
  const response = await fetch(`${API_BASE}/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: params.items.map((item) => ({
        product_id: item.productId,
        variation_id: item.variationId ?? 0,
        quantity: item.quantity,
      })),
      billing: {
        full_name: params.billing.fullName,
        phone: params.billing.phone,
        email: params.billing.email ?? '',
        address: params.billing.address ?? '',
        neighborhood: params.billing.neighborhood,
      },
      delivery_fee: params.deliveryFee,
      payment_method: params.paymentMethod,
      client_reference: params.clientReference,
      return_url: params.returnUrl,
    }),
  });

  const data = await readJson(response);

  if (!response.ok || !data?.order_id) {
    throw new Error(
      (data && data.message) ||
        'Impossible de créer la commande pour le moment. Réessayez dans un instant.'
    );
  }

  return {
    orderId: data.order_id as number,
    orderKey: data.order_key as string,
    total: Number(data.total),
    redirectUrl: (data.redirect_url as string | null) ?? null,
  };
}

/**
 * Demande au serveur le statut réel d'une commande. À utiliser quand le client
 * revient sur le site après le paiement, avant d'afficher "commande confirmée".
 */
export async function getOrderStatus(orderId: number, orderKey: string): Promise<OrderStatus> {
  const query = new URLSearchParams({ order_id: String(orderId), key: orderKey });
  const response = await fetch(`${API_BASE}/order-status?${query.toString()}`);
  const data = await readJson(response);

  if (!response.ok || !data?.status) {
    throw new Error('Impossible de vérifier la commande pour le moment.');
  }

  return {
    status: String(data.status),
    paid: Boolean(data.paid),
    total: Number(data.total),
    orderNumber: String(data.order_number ?? orderId),
  };
}
