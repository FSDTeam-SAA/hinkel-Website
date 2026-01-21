"use client";

import React, { useState } from "react";
import { useContent } from "@/features/category-page/hooks/use-content";
import { useCategoryHeader, usePostCategoryHeader } from "@/features/category-page/hooks/use-categoryheader";
import { CategoryContent } from "@/features/category-page/types";
import { Zap, ShieldCheck, Database, Type, AlignLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import CategoryCard from './CategoryCard';
import AddCategory from "../addbooks/AddCategory";

export function CategoryShow() {
  const { data: contentData, isLoading, error } = useContent({ limit: 50 });
  const { data: headerData } = useCategoryHeader();
  const { mutate: postHeader, isPending } = usePostCategoryHeader();

  const [headerForm, setHeaderForm] = useState({
    title: "",
    subtitle: ""
  });

  // Track previous data to sync state during render (recommended alternative to useEffect for this case)
  const [prevHeaderData, setPrevHeaderData] = useState(headerData);
  if (headerData !== prevHeaderData) {
    setPrevHeaderData(headerData);
    if (headerData?.data?.data) {
      setHeaderForm({
        title: headerData.data.data.title || "",
        subtitle: headerData.data.data.subtitle || ""
      });
    }
  }

  const categories = contentData?.data || [];

  if (error) {
    return (
      <section className="py-24 px-6 bg-slate-50 flex justify-center items-center min-h-[50vh]">
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-2xl flex items-center gap-4">
          <ShieldCheck className="w-6 h-6" />
          <span className="font-mono tracking-widest uppercase text-xs">System Failure: Could not load categories.</span>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-transparent space-y-12 py-10 animate-in fade-in duration-1000">
      <div className="container mx-auto px-6 space-y-12">
        {/* Global Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden border border-slate-200">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse ring-4 ring-green-500/20"></span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Library Control Hub</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">
              Category <span className="text-[#ff7a00]">Command</span>
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-1">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-tighter flex items-center gap-2">
                <Database size={14} className="text-[#ff7a00]" /> Total Indices
              </div>
              <div className="text-2xl font-mono text-slate-900 tracking-widest">
                {isLoading ? "..." : categories.length.toString().padStart(2, '0')}
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-1">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-tighter flex items-center gap-2">
                <Zap size={14} className="text-[#ff7a00]" /> System Status
              </div>
              <div className="text-2xl font-mono text-green-600 tracking-widest italic pt-1">ONLINE</div>
            </div>
          </div>

          <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-10 right-10 w-64 h-64 bg-[#ff7a00] rounded-full blur-[120px]"></div>
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Category Header Settings Section */}
        <Accordion type="single" collapsible className="w-full mb-12 cursor-pointer">
          <AccordionItem value="system-parameters" className="border-none">
            <div className="group/settings relative rounded-[3rem] shadow-sm overflow-hidden border border-slate-200 transition-all duration-700 hover:shadow-md">
              {/* Soft Background Layers */}
              <div className="absolute inset-0 bg-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-transparent to-blue-50/30" />

              {/* Decorative Floating Orb (Softened) */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ff7a00]/10 rounded-full blur-[100px] animate-pulse" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-100 rounded-full blur-[100px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />

              {/* Light Tech Grid Overlay */}
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #cbd5e1 1px, transparent 0)', backgroundSize: '24px 24px' }} />

              <AccordionTrigger className="relative z-10 px-10 py-8 cursor-pointer hover:no-underline group/trigger">
                <div className="flex flex-col items-start space-y-2 text-left w-full">
                  <div className="flex items-center gap-4">
                    <div className="h-[2px] w-12 bg-gradient-to-r from-transparent to-blue-500" />
                    <span className="text-2xl md:text-3xl font-black text-blue-500 uppercase tracking-[0.2em] group-hover/trigger:tracking-[0.3em] transition-all duration-500">
                      System Parameters
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <h2 className="text-lg md:text-xl font-bold text-slate-400 tracking-tight">
                      Header <span className="text-slate-900 italic">Architecture</span>
                    </h2>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="relative z-10 px-10 pb-10">
                <div className="space-y-10">
                  <p className="text-slate-600 text-sm font-medium max-w-lg border-l-2 border-blue-500/30 pl-4 py-1">
                    Modify the primary interface metadata. These changes propagate across the global category grid in real-time.
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      postHeader(headerForm, {
                        onSuccess: () => {
                          toast.success("System parameters updated successfully");
                        },
                        onError: (error) => {
                          toast.error("Failed to update header: " + error.message);
                        }
                      });
                    }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                  >
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Title Input */}
                      <div className="group/field relative space-y-3">
                        <div className="flex items-center justify-between px-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 group-focus-within/field:text-[#ff7a00] transition-colors">
                            <Type size={12} /> Title
                          </label>
                        </div>
                        <div className="relative group/input">
                          <input
                            type="text"
                            placeholder="e.g., Digital Archive"
                            value={headerForm.title}
                            onChange={(e) => setHeaderForm({ ...headerForm, title: e.target.value })}
                            required
                            className="w-full bg-slate-50 border border-slate-200 rounded-[1.25rem] px-6 py-5 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/10 focus:border-[#ff7a00] transition-all duration-500"
                          />
                          <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-tr from-[#ff7a00]/5 to-transparent opacity-0 group-focus-within/field:opacity-100 pointer-events-none transition-opacity duration-500" />
                        </div>
                      </div>

                      {/* Subtitle Textarea */}
                      <div className="group/field relative space-y-3 md:col-span-2">
                        <div className="flex items-center justify-between px-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 group-focus-within/field:text-[#ff7a00] transition-colors">
                            <AlignLeft size={12} /> Subtitle
                          </label>
                        </div>
                        <div className="relative">
                          <textarea
                            placeholder="Enter a compelling description for your categories..."
                            value={headerForm.subtitle}
                            onChange={(e) => setHeaderForm({ ...headerForm, subtitle: e.target.value })}
                            required
                            rows={4}
                            className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] px-6 py-5 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/10 focus:border-[#ff7a00] transition-all duration-500 shadow-sm resize-none leading-relaxed"
                          />
                          <div className="absolute bottom-6 right-6 flex gap-1.5 opacity-20">
                            <div className="h-1.5 w-1.5 rounded-full bg-white" />
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Sidebar */}
                    <div className="lg:col-span-4 flex flex-col justify-end space-y-6">
                      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4 shadow-inner">
                        <div className="flex items-center gap-3 text-slate-400">
                          <ShieldCheck size={16} className="text-green-600" />
                          <span className="text-xs font-semibold">Protected Transmission</span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          Once committed, these parameters will be broadcasted to website.
                        </p>
                      </div>

                      <button
                        type="submit"
                        disabled={isPending}
                        className="relative group/btn cursor-pointer w-full py-5 rounded-2xl overflow-hidden transition-all duration-500 active:scale-95"
                      >
                        <div className="absolute inset-0 bg-[#ff7a00] group-hover/btn:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />

                        <div className="relative flex items-center justify-center gap-3 text-white font-black uppercase tracking-[0.2em] text-sm">
                          {isPending ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Syncing...
                            </>
                          ) : (
                            <>
                              <Zap size={18} fill="currentColor" />
                              Execute Update
                            </>
                          )}
                        </div>
                      </button>
                    </div>
                  </form>
                </div>
              </AccordionContent>
            </div>
          </AccordionItem>
        </Accordion>


        <AddCategory />

        {/* Content Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-[2rem] bg-gray-100 animate-pulse"></div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
            <p className="text-xl font-bold text-gray-400 uppercase tracking-widest">No Categories Detected</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {categories.map((category: CategoryContent) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}