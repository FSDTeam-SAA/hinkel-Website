"use client";

import React, { useState, useEffect } from "react";
import { useSetPricing } from "@/features/dashboard/hooks/useSetPricing";
import { useGetPricing } from "@/features/dashboard/hooks/useGetPricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Monitor,
  BookOpen,
  Layers,
  Loader2,
  ArrowUpRight,
  Plus,
  Trash2,
} from "lucide-react";
import {
  DeliveryType,
  PricingData,
} from "@/features/dashboard/types/pricing.types";
import { toast } from "sonner";

type PageTier = { pageLimit: number; price: number };

type PricingFormState = {
  digital: PageTier[];
  print: PageTier[];
  both: PageTier[];
};

const PriceSet: React.FC = () => {
  const { createPricing, loading: settingPrice } = useSetPricing();
  const { pricing, getPricing, loading: fetchingPrice } = useGetPricing();

  const [form, setForm] = useState<PricingFormState>({
    digital: [],
    print: [],
    both: [],
  });

  useEffect(() => {
    getPricing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pricing?.data) {
      const data = pricing.data;
      const newForm: PricingFormState = {
        digital: [],
        print: [],
        both: [],
      };

      const processItem = (item: PricingData) => {
        const tiers = item.pageTiers || [];
        if (item.deliveryType === "digital") newForm.digital = tiers;
        if (item.deliveryType === "print") newForm.print = tiers;
        if (item.deliveryType === "print&digital") newForm.both = tiers;
      };

      if (Array.isArray(data)) {
        data.forEach(processItem);
      } else {
        processItem(data);
      }
      setForm(newForm);
    }
  }, [pricing]);

  const handleTierChange = (
    type: keyof PricingFormState,
    index: number,
    field: keyof PageTier,
    value: string,
  ) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    if (isNaN(numValue) && value !== "") return;

    setForm((prev) => {
      const newTiers = [...prev[type]];
      newTiers[index] = { ...newTiers[index], [field]: numValue };
      return { ...prev, [type]: newTiers };
    });
  };

  const addTier = (type: keyof PricingFormState) => {
    setForm((prev) => ({
      ...prev,
      [type]: [...prev[type], { pageLimit: 0, price: 0 }],
    }));
  };

  const removeTier = (type: keyof PricingFormState, index: number) => {
    setForm((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleUpdate = async (
    type: DeliveryType,
    name: keyof PricingFormState,
  ) => {
    const tiers = form[name];
    if (tiers.length === 0) {
      toast.error("Error: At least one pricing tier is required.");
      return;
    }

    // Validate tiers
    const isValid = tiers.every((t) => t.pageLimit > 0);
    if (!isValid) {
      toast.error("Validation Error: Page limits must be greater than zero.");
      return;
    }

    try {
      await createPricing({
        deliveryType: type,
        pageTiers: tiers,
        currency: "usd",
      });
      toast.success(`${type.toUpperCase()} Protocol Updated Successfully`, {
        description: `Pricing tiers synchronized successfully.`,
        icon: <ArrowUpRight className="text-green-500" />,
      });
    } catch {
      toast.error("Synchronization Failure", {
        description: "The system could not commit these changes. Retry in 60s.",
      });
    }
  };

  const tiersConfig = [
    {
      type: "digital" as DeliveryType,
      name: "digital" as keyof PricingFormState,
      title: "Digital PDF",
      tag: "High Margin",
      desc: "Optimized for global distribution and zero-cost scaling.",
      icon: <Monitor className="w-8 h-8 text-blue-400" />,
      glow: "group-hover:shadow-blue-500/20",
      border: "focus-within:border-blue-500/50",
    },
    {
      type: "print" as DeliveryType,
      name: "print" as keyof PricingFormState,
      title: "Printed Book",
      tag: "Production",
      desc: "Direct-to-consumer physical production and logistics.",
      icon: <BookOpen className="w-8 h-8 text-[#ff7a00]" />,
      glow: "group-hover:shadow-orange-500/20",
      border: "focus-within:border-orange-500/50",
    },
    {
      type: "print&digital" as DeliveryType,
      name: "both" as keyof PricingFormState,
      title: "Digital PDF and Printed Book",
      tag: "Maximum Value",
      desc: "Synergistic bundle offering for premium consumers.",
      icon: <Layers className="w-8 h-8 text-purple-400" />,
      glow: "group-hover:shadow-purple-500/20",
      border: "focus-within:border-purple-500/50",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent space-y-12 py-10 animate-in fade-in duration-1000">
      {fetchingPrice && !pricing && (
        <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-[#ff7a00] animate-spin" />
        </div>
      )}
      {/* Global Command Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-gray-950 p-10 rounded-[2.5rem] shadow-3xl relative overflow-hidden ring-1 ring-white/10">
        <div className="space-y-4 relative z-10 w-full">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse ring-4 ring-green-500/20"></span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Pricing Control Hub
            </span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">
            Revenue <span className="text-[#ff7a00]">Architect</span>
          </h1>
          <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
            Manage and synchronize tiered pricing structures for digital and
            physical books. Define custom page limits and unit prices to align
            with your platform&apos;s revenue model.
          </p>
        </div>

        {/* Cyber Background Pattern */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-10 right-10 w-64 h-64 bg-[#ff7a00] rounded-full blur-[120px]"></div>
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
            <defs>
              <pattern
                id="grid"
                width="10"
                height="10"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 10 0 L 0 0 0 10"
                  fill="none"
                  stroke="white"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
      </div>

      {/* Dynamic Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {tiersConfig.map((tier) => (
          <Card
            key={tier.type}
            className={`group bg-white border-2 border-gray-100 rounded-[2rem] transition-all duration-500 flex flex-col hover:border-[#ff7a00]/30 hover:shadow-2xl ${tier.glow} ${tier.border}`}
          >
            <CardHeader className="space-y-6 flex-grow">
              <div className="flex items-center justify-between">
                <div className="p-4 rounded-2xl bg-gray-50 group-hover:bg-[#ff7a00]/10 transition-colors duration-500">
                  {tier.icon}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-900 text-white rounded-full">
                    {tier.tag}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">
                  {tier.title}
                </CardTitle>
                <CardDescription className="text-gray-500 text-md leading-snug">
                  {tier.desc}
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-8 px-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-gray-900 uppercase tracking-widest">
                    Pricing Tiers
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addTier(tier.name)}
                    className="text-[#ff7a00] hover:text-[#ff9500] hover:bg-[#ff7a00]/10 flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest"
                  >
                    <Plus size={14} /> Add Tier
                  </Button>
                </div>

                <div className="space-y-3">
                  {form[tier.name].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 animate-in slide-in-from-left-2 duration-300"
                    >
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">
                          Limit
                        </span>
                        <Input
                          type="number"
                          value={item.pageLimit || ""}
                          onChange={(e) =>
                            handleTierChange(
                              tier.name,
                              index,
                              "pageLimit",
                              e.target.value,
                            )
                          }
                          placeholder="0"
                          className="pl-14 h-12 text-lg font-bold border-2 border-gray-100 rounded-xl focus:border-[#ff7a00] transition-all"
                        />
                      </div>
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">
                          $
                        </span>
                        <Input
                          type="number"
                          value={item.price || ""}
                          onChange={(e) =>
                            handleTierChange(
                              tier.name,
                              index,
                              "price",
                              e.target.value,
                            )
                          }
                          placeholder="0.00"
                          className="pl-8 h-12 text-lg font-bold border-2 border-gray-100 rounded-xl focus:border-[#ff7a00] transition-all"
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTier(tier.name, index)}
                        className="h-12 w-12 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  ))}
                  {form[tier.name].length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-2xl">
                      <p className="text-gray-400 text-xs font-medium">
                        No tiers defined. Press &quot;Add Tier&quot; to begin.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-8 pb-10 mt-auto">
              <Button
                onClick={() => handleUpdate(tier.type, tier.name)}
                disabled={settingPrice || form[tier.name].length === 0}
                className="w-full h-16 bg-gray-900 hover:bg-black text-white text-lg font-black rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] group/btn overflow-hidden relative"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {settingPrice ? (
                    <Loader2 className="animate-spin h-6 w-6" />
                  ) : (
                    "Deploy Update"
                  )}
                </span>
                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff7a00] to-[#ff9500] translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500"></div>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Bottom Trust/Info Bar */}
      {/* <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-10 bg-gray-50 rounded-[2rem] border border-gray-200">
        <div className="flex items-center gap-6">
          <div className="h-16 w-16 rounded-[1.25rem] bg-white shadow-md flex items-center justify-center border border-gray-100">
            <ShieldCheck size={32} className="text-[#ff7a00]" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-gray-900">
              Security & Integrity
            </h4>
            <p className="text-gray-500 text-sm">
              Every pricing change is logged, hashed, and synchronized across
              your global cluster within 200ms.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#ff7a00]"></span>
            <span className="text-xs font-black uppercase text-gray-900">
              v4.0 Pricing Engine
            </span>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default PriceSet;
