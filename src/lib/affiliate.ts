import type { Investment } from "@/data/investments";

export function buildAffiliateUrl(investment: Investment): string {
  if (investment.affiliateUrl) return investment.affiliateUrl;
  if (investment.buyUrl) return investment.buyUrl;

  // Fallback: Amazon search for purchasable items
  if (
    investment.category === "supplement" ||
    investment.category === "equipment"
  ) {
    const query = encodeURIComponent(investment.name);
    return `https://www.amazon.com/s?k=${query}&tag=newagelongevi-20`;
  }

  return "";
}
