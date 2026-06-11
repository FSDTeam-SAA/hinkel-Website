import type { PricingData } from "@/features/book-creation/types";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getPublicPricing } from "@/lib/public-api";

const FALLBACK_PRICES: PricingData[] = [
  {
    _id: "fallback-digital",
    deliveryType: "digital",
    currency: "USD",
    pageTiers: [{ pageLimit: 20, price: 19 }],
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "fallback-print",
    deliveryType: "print",
    currency: "USD",
    pageTiers: [{ pageLimit: 20, price: 39 }],
    createdAt: "",
    updatedAt: "",
  },
  {
    _id: "fallback-print-digital",
    deliveryType: "print&digital",
    currency: "USD",
    pageTiers: [{ pageLimit: 20, price: 49 }],
    createdAt: "",
    updatedAt: "",
  },
];

const TIER_CONTENT: Record<
  PricingData["deliveryType"],
  {
    title: string;
    subtitle: string;
    features: string[];
  }
> = {
  digital: {
    title: "Digital PDF",
    subtitle: "Delivered to your inbox",
    features: [
      "Design studio access",
      "Up to 3 photo conversions per page",
      "Personalized cover page",
      "Premium print quality pages",
      "PDF delivered to your inbox instantly",
      "Print at home as often as you'd like",
    ],
  },
  print: {
    title: "Printed Book",
    subtitle: "Delivered to your door",
    features: [
      "Design studio access",
      "Up to 3 photo conversions per page",
      "Premium print quality pages",
      "Delivered to your home within 7-11 business days",
    ],
  },
  "print&digital": {
    title: "Digital PDF & Printed Book",
    subtitle: "Delivered to your door and inbox",
    features: [
      "All the benefits listed above",
      "Get your book delivered",
      "PDF delivered to your inbox for printing",
      "Adding the PDF adds minimal cost",
    ],
  },
};

const DELIVERY_ORDER: PricingData["deliveryType"][] = [
  "digital",
  "print",
  "print&digital",
];

const Pricing = async () => {
  const pricingData = await getPublicPricing();
  const tiersFromApi = pricingData.data || [];

  const normalizeDeliveryType = (
    type: string,
  ): PricingData["deliveryType"] | null => {
    if (type === "both") return "print&digital";
    if (type === "digital" || type === "print" || type === "print&digital") {
      return type;
    }
    return null;
  };

  const normalizedApiTiers: PricingData[] = [];
  const normalizedTierMap = new Map<PricingData["deliveryType"], PricingData>();

  for (const tier of tiersFromApi) {
    const normalizedType = normalizeDeliveryType(
      String(
        (tier as PricingData & { deliveryType?: string }).deliveryType || "",
      ),
    );
    if (!normalizedType) continue;

    const normalizedTier: PricingData = {
      ...tier,
      deliveryType: normalizedType,
    };
    const existing = normalizedTierMap.get(normalizedType);

    // Prefer an entry that has page tiers populated when duplicates exist.
    if (!existing || (existing.pageTiers?.length || 0) === 0) {
      normalizedTierMap.set(normalizedType, normalizedTier);
    }
  }

  normalizedApiTiers.push(...normalizedTierMap.values());

  const tiers =
    normalizedApiTiers.length > 0 ? normalizedApiTiers : FALLBACK_PRICES;
  tiers.sort(
    (a, b) =>
      DELIVERY_ORDER.indexOf(a.deliveryType) -
      DELIVERY_ORDER.indexOf(b.deliveryType),
  );

  const formatPrice = (price?: number, currency = "USD") => {
    if (price === undefined || price === null) return "--";

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
        maximumFractionDigits: Number.isInteger(price) ? 0 : 2,
      }).format(price);
    } catch {
      return `${currency === "USD" ? "$" : `${currency} `}${price}`;
    }
  };

  const getTierContent = (type: PricingData["deliveryType"]) => {
    return (
      TIER_CONTENT[type] || {
        title: type,
        subtitle: "",
        features: [],
      }
    );
  };

  return (
    <section className="min-h-screen bg-secondary flex justify-center px-6 py-16">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple Pricing for{" "}
            <span className="text-primary italic">Endless Creativity.</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the option that fits your project. Whether it&apos;s a
            printed coloring or sketchbook, a downloadable PDF, or both,
            we&apos;ve got you covered
          </p>
        </div>

        <div className="relative">
          <div
            className={cn(
              "grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-500",
            )}
          >
            {tiers.map((tier, index: number) => {
              const deliveryType = tier.deliveryType;
              const isPopular = index === tiers.length - 1;
              const tierContent = getTierContent(deliveryType);
              const sortedTiers = [...(tier.pageTiers || [])].sort(
                (a, b) => a.pageLimit - b.pageLimit,
              );
              const displayPrice = sortedTiers?.[0]?.price;
              const currency = tier.currency || "USD";

              return (
                <div
                  key={index}
                  className={cn(
                    "relative bg-white rounded-3xl p-8 border-2 transition-all duration-300 flex flex-col h-full",
                    isPopular
                      ? "border-primary shadow-xl shadow-primary/10 scale-105 z-10"
                      : "border-gray-100 shadow-sm hover:shadow-md",
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {tierContent.title}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {tierContent.subtitle}
                    </p>
                  </div>

                  <div className="mb-8">
                    <div className="mb-4">
                      <span className="block text-gray-500 font-medium mb-1">
                        Starting at
                      </span>
                      <span className="text-4xl font-extrabold text-gray-900">
                        {formatPrice(displayPrice, currency)}
                      </span>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-gray-50">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                        # of Pages
                      </p>
                      {sortedTiers?.map((t, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center py-1.5"
                        >
                          <span className="text-sm text-gray-600 font-medium">
                            {t.pageLimit} Pages
                          </span>
                          <span className="text-sm font-bold text-primary">
                            {formatPrice(t.price, currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8 grow">
                    {tierContent.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-sm text-gray-600"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href="/create-book">
                    <Button
                      className={cn(
                        "w-full py-6 rounded-xl font-bold transition-all",
                        isPopular
                          ? "bg-primary hover:bg-primary/90 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-900",
                      )}
                    >
                      Start creating NOW!
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-20 text-center bg-white/50 backdrop-blur-sm p-12 rounded-[40px] border border-gray-100 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Need a custom project?
          </h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Looking for bulk orders, special event books, or corporate gifting?
            Our team can help you create something truly unique.
          </p>
          <Link href="/contact-us">
            <Button
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-6 rounded-xl font-bold text-lg transition-all"
            >
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
