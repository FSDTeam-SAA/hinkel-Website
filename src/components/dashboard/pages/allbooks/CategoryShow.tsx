"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useContent } from "@/features/category-page/hooks/use-content";
import { CategoryContent } from "@/features/category-page/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Layers, Zap, ArrowUpRight, ShieldCheck, Database, Search } from "lucide-react";

export function CategoryShow() {
  const { data: contentData, isLoading, error } = useContent({ limit: 50 });

  const categories = contentData?.data || [];

  if (error) {
    return (
      <section className="py-24 px-6 bg-gray-950 flex justify-center items-center min-h-[50vh]">
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-2xl flex items-center gap-4">
          <ShieldCheck className="w-6 h-6" />
          <span className="font-mono tracking-widest uppercase">System Failure: Could not load categories.</span>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-transparent space-y-12 py-10 animate-in fade-in duration-1000">
      <div className="container mx-auto px-6 space-y-12">
        {/* Global Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-gray-950 p-10 rounded-[2.5rem] shadow-3xl relative overflow-hidden ring-1 ring-white/10">
          <div className="space-y-4 relative z-10">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse ring-4 ring-green-500/20"></span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Library Control Hub</span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter">
              Category <span className="text-[#ff7a00]">Command</span>
            </h1>
            {/* <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
              Explore and manage your digital archive classifications. Access high-velocity content streams and structure your knowledge base.
            </p> */}
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-1">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-tighter flex items-center gap-2">
                <Database size={14} className="text-[#ff7a00]" /> Total Indices
              </div>
              <div className="text-2xl font-mono text-white tracking-widest">
                {isLoading ? "CALCULATING..." : categories.length.toString().padStart(2, '0')}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-1">
              <div className="text-gray-500 text-xs font-bold uppercase tracking-tighter flex items-center gap-2 text-white">
                <Zap size={14} className="text-[#ff7a00]" /> System Status
              </div>
              <div className="text-2xl font-mono text-green-400 tracking-widest italic pt-1">ONLINE</div>
            </div>
          </div>

          {/* Cyber Background Pattern */}
          <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-10 right-10 w-64 h-64 bg-[#ff7a00] rounded-full blur-[120px]"></div>
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
        </div>

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
              <Link
                key={category._id}
                href={`/${category.type}`}
                className="block h-full"
              >
                <Card className="group h-full bg-white border-2 border-gray-100 rounded-[2rem] py-0! transition-all duration-500 flex flex-col hover:border-[#ff7a00]/30 hover:shadow-2xl hover:shadow-[#ff7a00]/10 overflow-hidden relative">
                  {/* Image Header with Overlay */}
                  <div className="aspect-[4/5] relative w-full overflow-hidden bg-gray-100 border-b border-gray-100">
                    <Image
                      src={category.image || "/no-image.jpg"}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                    {/* Floating Tech Badge */}
                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      <ArrowUpRight className="w-5 h-5 text-[#ff7a00]" />
                    </div>
                  </div>

                  <CardHeader className="p-6 pb-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-xl bg-gray-50 group-hover:bg-[#ff7a00]/10 transition-colors duration-500 text-[#ff7a00]">
                        <Layers size={20} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-900 text-white rounded-full">
                        Index
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent className="px-6 pb-4">
                    <CardTitle className="text-2xl font-black text-gray-900 tracking-tight line-clamp-2 group-hover:text-[#ff7a00] transition-colors duration-300">
                      {category.type}
                    </CardTitle>
                  </CardContent>

                  <CardFooter className="px-6 pb-6 pt-0 mt-auto">
                    <div className="w-full pt-4 border-t border-gray-100 flex items-center justify-between group/footer">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-gray-900 transition-colors">
                        <Search size={14} /> View Archive
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#ff7a00] transition-colors duration-300">
                        <ArrowUpRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </CardFooter>

                  {/* Hover Border Glow Effect */}
                  <div className="absolute inset-0 border-2 border-[#ff7a00] rounded-[2rem] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
