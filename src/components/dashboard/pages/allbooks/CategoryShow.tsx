
// export function CategoryShow() {
//   const { data: contentData, isLoading, error } = useContent({ limit: 50 });
//   const { data: headerData, isLoading: isHeaderLoading } = useCategoryHeader();
//   const { mutate: postHeader, isPending } = usePostCategoryHeader();

//   const [headerForm, setHeaderForm] = useState({
//     title: "",
//     subtitle: ""
//   });

//   // Populate form with existing data when it loads
//   useEffect(() => {
//     if (headerData?.data?.data) {
//       setHeaderForm({
//         title: headerData.data.data.title || "",
//         subtitle: headerData.data.data.subtitle || ""
//       });
//     }
//   }, [headerData]);

//   const categories = contentData?.data || [];

//   if (error) {
//     return (
//       <section className="py-24 px-6 bg-gray-950 flex justify-center items-center min-h-[50vh]">
//         <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-6 rounded-2xl flex items-center gap-4">
//           <ShieldCheck className="w-6 h-6" />
//           <span className="font-mono tracking-widest uppercase">System Failure: Could not load categories.</span>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="min-h-screen bg-transparent space-y-12 py-10 animate-in fade-in duration-1000">
//       <div className="container mx-auto px-6 space-y-12">
//         {/* Global Command Header */}
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-gray-950 p-10 rounded-[2.5rem] shadow-3xl relative overflow-hidden ring-1 ring-white/10">
//           <div className="space-y-4 relative z-10">
//             <div className="flex items-center gap-3">
//               <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse ring-4 ring-green-500/20"></span>
//               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Library Control Hub</span>
//             </div>
//             <h1 className="text-5xl font-black text-white tracking-tighter">
//               Category <span className="text-[#ff7a00]">Command</span>
//             </h1>
//             {/* <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
//               Explore and manage your digital archive classifications. Access high-velocity content streams and structure your knowledge base.
//             </p> */}
//           </div>

//           <div className="grid grid-cols-2 gap-4 relative z-10">
//             <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-1">
//               <div className="text-gray-500 text-xs font-bold uppercase tracking-tighter flex items-center gap-2">
//                 <Database size={14} className="text-[#ff7a00]" /> Total Indices
//               </div>
//               <div className="text-2xl font-mono text-white tracking-widest">
//                 {isLoading ? "CALCULATING..." : categories.length.toString().padStart(2, '0')}
//               </div>
//             </div>
//             <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-1">
//               <div className="text-gray-500 text-xs font-bold uppercase tracking-tighter flex items-center gap-2 text-white">
//                 <Zap size={14} className="text-[#ff7a00]" /> System Status
//               </div>
//               <div className="text-2xl font-mono text-green-400 tracking-widest italic pt-1">ONLINE</div>
//             </div>
//           </div>

//           {/* Cyber Background Pattern */}
//           <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
//             <div className="absolute top-10 right-10 w-64 h-64 bg-[#ff7a00] rounded-full blur-[120px]"></div>
//             <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
//               <defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs>
//               <rect width="100" height="100" fill="url(#grid)" />
//             </svg>
//           </div>
//         </div>

//         {/* Category Header and Subtitle Upload Section */}
//         <div className="bg-secondary p-10 rounded-[2.5rem] shadow-3xl relative overflow-hidden ring-1 ring-white/10">
//           <div className="relative z-10 space-y-6">
//             {/* Section Header */}
//             <div className="space-y-2">
//               <div className="flex items-center gap-3">
//                 <span className="flex h-3 w-3 rounded-full bg-blue-500 animate-pulse ring-4 ring-blue-500/20"></span>
//                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Content Management</span>
//               </div>
//               <h2 className="text-3xl font-black text-gray-800 tracking-tighter">
//                 Category <span className="text-primary">Header Settings</span>
//               </h2>
//               <p className="text-gray-400 text-sm">Configure the main title and subtitle displayed on the category page</p>
//             </div>

//             {/* Form */}
//             <form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 postHeader(headerForm, {
//                   onSuccess: () => {
//                     alert("Header updated successfully!");
//                     setHeaderForm({ title: "", subtitle: "" });
//                   },
//                   onError: (error) => {
//                     alert("Failed to update header: " + error.message);
//                   }
//                 });
//               }}
//               className="space-y-4"
//             >
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 {/* Title Input - Kept as a sleek one-line field */}
//                 <div className="group/field relative flex flex-col justify-start space-y-3">
//                   <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest transition-colors group-focus-within/field:text-[#ff7a00]">
//                     Page Title
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       placeholder="e.g., Explore Categories"
//                       value={headerForm.title}
//                       onChange={(e) => setHeaderForm({ ...headerForm, title: e.target.value })}
//                       required
//                       className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/50 focus:border-[#ff7a00] transition-all duration-300 shadow-inner"
//                     />
//                     {/* Decorative accent for the input */}
//                     <div className="absolute top-3 right-4 opacity-20 group-focus-within/field:opacity-100 transition-opacity">
//                       <div className="h-1 w-1 rounded-full bg-[#ff7a00]"></div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Subtitle Input - Converted to a Modern Textarea */}
//                 <div className="group/field relative flex flex-col justify-start space-y-3">
//                   <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest transition-colors group-focus-within/field:text-[#ff7a00]">
//                     Page Subtitle
//                   </label>
//                   <div className="relative">
//                     <textarea
//                       placeholder="e.g., Browse our extensive collection of premium items tailored for your needs..."
//                       value={headerForm.subtitle}
//                       onChange={(e) => setHeaderForm({ ...headerForm, subtitle: e.target.value })}
//                       required
//                       rows={4}
//                       className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/50 focus:border-[#ff7a00] transition-all duration-300 shadow-inner resize-none leading-relaxed"
//                     />
//                     {/* Corner indicator for textarea */}
//                     <div className="absolute bottom-4 right-4 flex gap-1 opacity-20">
//                       <div className="h-1 w-1 rounded-full bg-white"></div>
//                       <div className="h-1 w-1 rounded-full bg-white"></div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               disabled={isPending}
//               className="bg-[#ff7a00] hover:bg-[#ff7a00]/90 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-xl uppercase tracking-widest text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#ff7a00]/20 flex items-center gap-2"
//             >
//               {isPending ? (
//                 <>
//                   <span className="animate-spin">⏳</span>
//                   Updating...
//                 </>
//               ) : (
//                 <>
//                   <Zap size={16} />
//                   Update Header
//                 </>
//               )}
//             </button>
//           </div>
//         </form>

//         {/* Background Pattern */}
//         <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
//           <div className="absolute top-10 right-10 w-48 h-48 bg-blue-500 rounded-full blur-[100px]"></div>
//         </div>
//       </div>

//       {/* Content Grid */}
//       {isLoading ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="h-96 rounded-[2rem] bg-gray-100 animate-pulse"></div>
//           ))}
//         </div>
//       ) : categories.length === 0 ? (
//         <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
//           <p className="text-xl font-bold text-gray-400 uppercase tracking-widest">No Categories Detected</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
//           {categories.map((category: CategoryContent) => (
//             <Link
//               key={category._id}
//               href={`/${category.type}`}
//               className="block h-full"
//             >
//               <Card className="group h-full bg-white border-2 border-gray-100 rounded-[2rem] py-0! transition-all duration-500 flex flex-col hover:border-[#ff7a00]/30 hover:shadow-2xl hover:shadow-[#ff7a00]/10 overflow-hidden relative">
//                 {/* Image Header with Overlay */}
//                 <div className="aspect-[4/5] relative w-full overflow-hidden bg-gray-100 border-b border-gray-100">
//                   <Image
//                     src={category.image || "/no-image.jpg"}
//                     alt={category.title}
//                     fill
//                     className="object-cover transition-transform duration-700 group-hover:scale-110"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

//                   {/* Floating Tech Badge */}
//                   <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-xl text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
//                     <ArrowUpRight className="w-5 h-5 text-[#ff7a00]" />
//                   </div>
//                 </div>

//                 <CardHeader className="p-6 pb-2 space-y-2">
//                   <div className="flex items-center justify-between">
//                     <div className="p-3 rounded-xl bg-gray-50 group-hover:bg-[#ff7a00]/10 transition-colors duration-500 text-[#ff7a00]">
//                       <Layers size={20} />
//                     </div>
//                     <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-900 text-white rounded-full">
//                       Index
//                     </span>
//                   </div>
//                 </CardHeader>

//                 <CardContent className="px-6 pb-4">
//                   <CardTitle className="text-2xl font-black text-gray-900 tracking-tight line-clamp-2 group-hover:text-[#ff7a00] transition-colors duration-300">
//                     {category.type}
//                   </CardTitle>
//                 </CardContent>

//                 <CardFooter className="px-6 pb-6 pt-0 mt-auto">
//                   <div className="w-full pt-4 border-t border-gray-100 flex items-center justify-between group/footer">
//                     <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-gray-900 transition-colors">
//                       <Search size={14} /> View Archive
//                     </span>
//                     <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#ff7a00] transition-colors duration-300">
//                       <ArrowUpRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
//                     </div>
//                   </div>
//                 </CardFooter>

//                 {/* Hover Border Glow Effect */}
//                 <div className="absolute inset-0 border-2 border-[#ff7a00] rounded-[2rem] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
//               </Card>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//     </section >
//   );
// }


"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContent } from "@/features/category-page/hooks/use-content";
import { useCategoryHeader, usePostCategoryHeader } from "@/features/category-page/hooks/use-categoryheader";
import { CategoryContent } from "@/features/category-page/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Layers, Zap, ArrowUpRight, ShieldCheck, Database, Search, Type, AlignLeft } from "lucide-react";

export function CategoryShow() {
  const { data: contentData, isLoading, error } = useContent({ limit: 50 });
  const { data: headerData, isLoading: isHeaderLoading } = useCategoryHeader();
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
        <div className="group/settings relative p-10 rounded-[3rem] shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 transition-all duration-700 hover:shadow-[#ff7a00]/5">
          {/* Animated Background Layers */}
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-3xl" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#ff7a00]/5 via-transparent to-blue-500/5" />

          {/* Decorative Floating Orb */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#ff7a00] rounded-full blur-[100px] opacity-20 animate-pulse" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }} />

          {/* Tech Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

          <div className="relative z-10 space-y-10">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-blue-500" />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] leading-none">System Parameters</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4">
                Header <span className="bg-gradient-to-r from-white to-white/40 bg-clip-text text-transparent italic">Architecture</span>
              </h2>
              <p className="text-white text-sm font-medium max-w-lg">
                Modify the primary interface metadata. These changes propagate across the global category grid in real-time.
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                postHeader(headerForm, {
                  onSuccess: () => {
                    // alert("Header updated successfully!");
                    // setHeaderForm({ title: "", subtitle: "" }); // Removing this so the user can see what they just saved
                  },
                  onError: (error) => {
                    alert("Failed to update header: " + error.message);
                  }
                });
              }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10"
            >
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Title Input */}
                <div className="group/field relative space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2 group-focus-within/field:text-[#ff7a00] transition-colors">
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
                      className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-[1.25rem] px-6 py-5 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#ff7a00]/30 focus:border-[#ff7a00]/50 transition-all duration-500 shadow-2xl"
                    />
                    <div className="absolute inset-0 rounded-[1.25rem] bg-gradient-to-tr from-[#ff7a00]/5 to-transparent opacity-0 group-focus-within/field:opacity-100 pointer-events-none transition-opacity duration-500" />
                  </div>
                </div>

                {/* Subtitle Textarea */}
                <div className="group/field relative space-y-3 md:col-span-2">
                  <div className="flex items-center justify-between px-1">
                    <label className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2 group-focus-within/field:text-[#ff7a00] transition-colors">
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
                      className="w-full bg-black/20 backdrop-blur-md border border-white/10 rounded-[1.5rem] px-6 py-5 text-white placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all duration-500 shadow-2xl resize-none leading-relaxed"
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
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4">
                  <div className="flex items-center gap-3 text-gray-400">
                    <ShieldCheck size={16} className="text-green-500" />
                    <span className="text-xs font-semibold">Protected Transmission</span>
                  </div>
                  <p className="text-[11px] text-white leading-relaxed">
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
              <Link key={category._id} href={`/${category.type}`} className="block h-full">
                <Card className="group h-full bg-white border-2 border-gray-100 rounded-[2rem] py-0! transition-all duration-500 flex flex-col hover:border-[#ff7a00]/30 hover:shadow-2xl hover:shadow-[#ff7a00]/10 overflow-hidden relative">
                  <div className="aspect-[4/5] relative w-full overflow-hidden bg-gray-100 border-b border-gray-100">
                    <Image
                      src={category.image || "/no-image.jpg"}
                      alt={category.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
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