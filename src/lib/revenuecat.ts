const REVENUECAT_API_KEY = process.env.REVENUECAT_API_KEY;
const REVENUECAT_WEBHOOK_SECRET = process.env.REVENUECAT_WEBHOOK_SECRET;

interface CustomerInfo {
  isPremium: boolean;
  expiresAt: string | null;
}

export async function getCustomerInfo(
  appUserId: string
): Promise<CustomerInfo> {
  if (!REVENUECAT_API_KEY) {
    return { isPremium: false, expiresAt: null };
  }

  const response = await fetch(
    `https://api.revenuecat.com/v1/subscribers/${encodeURIComponent(appUserId)}`,
    {
      headers: {
        Authorization: `Bearer ${REVENUECAT_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return { isPremium: false, expiresAt: null };
  }

  const data = await response.json();
  const entitlements = data?.subscriber?.entitlements || {};
  const premium = entitlements["premium"];

  if (!premium || new Date(premium.expires_date) < new Date()) {
    return { isPremium: false, expiresAt: null };
  }

  return {
    isPremium: true,
    expiresAt: premium.expires_date,
  };
}

export function verifyWebhookSignature(
  body: string,
  signature: string | null
): boolean {
  if (!REVENUECAT_WEBHOOK_SECRET || !signature) return false;

  // RevenueCat uses a shared secret in the Authorization header
  return signature === REVENUECAT_WEBHOOK_SECRET;
}
