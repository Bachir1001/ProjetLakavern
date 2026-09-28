// Appelle notre plugin WordPress "LaKavern - Paiement en ligne (PayDunya)".
// Aucune clé secrète n'est jamais présente côté navigateur.

// "/lakavern-api" est un proxy (comme "/woo-api" pour les produits) qui redirige
// vers https://VOTRE-SITE/wp-json/lakavern/v1 — voir vite.config.ts.
const PAYMENT_API_BASE = '/lakavern-api';

interface CreatePaymentSessionParams {
  amount: number; // en FCFA, nombre entier
  clientReference: string;
  successUrl: string;
  errorUrl: string;
}

export interface PaymentSession {
  redirectUrl: string; // page de paiement PayDunya (Wave, Orange Money, etc.)
  token: string | null; // jeton de la facture, pour vérifier le paiement au retour
}

export type PaymentStatus = 'completed' | 'pending' | 'cancelled' | 'failed' | 'unknown';

/**
 * Crée la facture côté serveur et renvoie l'adresse vers laquelle rediriger
 * le client pour qu'il choisisse son moyen de paiement et paie.
 */
export async function createPaymentSession(
  params: CreatePaymentSessionParams
): Promise<PaymentSession> {
  const response = await fetch(`${PAYMENT_API_BASE}/create-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: params.amount,
      client_reference: params.clientReference,
      success_url: params.successUrl,
      error_url: params.errorUrl,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.redirect_url) {
    throw new Error(
      (data && (data.message || data.code)) ||
        'Impossible de créer la session de paiement. Réessayez dans un instant.'
    );
  }

  return {
    redirectUrl: data.redirect_url as string,
    token: (data.token as string | null) ?? null,
  };
}

/**
 * Demande au serveur le statut réel d'un paiement (il interroge PayDunya).
 * À utiliser au retour du client sur le site, avant d'afficher "commande confirmée".
 */
export async function verifyPayment(token: string): Promise<PaymentStatus> {
  const response = await fetch(
    `${PAYMENT_API_BASE}/verify-payment?token=${encodeURIComponent(token)}`
  );

  const data = await response.json().catch(() => null);

  if (!response.ok || !data?.status) {
    throw new Error('Impossible de vérifier le paiement pour le moment.');
  }

  const status = String(data.status).toLowerCase();

  if (status === 'completed') return 'completed';
  if (status === 'pending') return 'pending';
  if (status === 'cancelled' || status === 'canceled') return 'cancelled';
  if (status === 'failed') return 'failed';
  return 'unknown';
}
