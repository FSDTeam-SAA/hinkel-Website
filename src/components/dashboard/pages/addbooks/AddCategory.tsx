"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner"; // or your preferred toast library
import { ImagePlus, Type, AlignLeft, Layers, Zap, X } from "lucide-react";
import Image from "next/image";
import { useCreateCategory } from "@/features/dashboard/hooks/useCategory";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const formSchema = z.object({
  title: z.string().min(2, "Title is required"),
  subtitle: z.string().min(2, "Subtitle is required"),
  type: z.string().min(2, "Type is required (e.g., adult, pet)"),
  prompt: z.string().optional(),
  image: z.any().refine((file) => file?.length > 0, "Image is required"),
  gallery: z.any().optional(),
});

const AddCategory = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
  const { mutate: createCategory, isPending } = useCreateCategory();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", subtitle: "", type: "", prompt: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("subtitle", values.subtitle);
    formData.append("type", values.type);
    if (values.prompt) {
      formData.append("prompt", values.prompt);
    }
    formData.append("image", values.image[0]);

    if (values.gallery && values.gallery.length > 0) {
      Array.from(values.gallery as File[] | FileList).forEach((file) => {
        formData.append("gallery", file);
      });
    }

    createCategory(formData, {
      onSuccess: () => {
        toast.success("Category created successfully");
        form.reset();
        setPreview(null);
        setGalleryPreviews([]);
      },
      //eslint-disable-next-line
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Something went wrong");
      },
    });
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      form.setValue("image", e.target.files);
    }
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));

      setGalleryPreviews((prev) => [...prev, ...newPreviews]);

      const currentFiles = form.getValues("gallery") || [];
      const updatedFiles = [
        ...Array.from(currentFiles as File[] | FileList),
        ...newFiles,
      ];
      form.setValue("gallery", updatedFiles);
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    const currentFiles = form.getValues("gallery") as File[];
    if (currentFiles) {
      const updatedFiles = Array.from(currentFiles).filter(
        (_, i) => i !== index,
      );
      form.setValue("gallery", updatedFiles);
    }
  };

  return (
    <div className="relative">
      {/* Dynamic Background Elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -right-40 w-96 h-96 bg-[#ff7a00] rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600 rounded-full blur-[120px] pointer-events-none"
      />

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="category-creator" className="border-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group/settings relative rounded-[3rem] shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden border border-white/10 transition-all duration-700 mb-12"
          >
            {/* Glass Container */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#ff7a00]/10 via-transparent to-blue-500/10" />

            <AccordionTrigger className="relative z-10 px-10 py-10 cursor-pointer hover:no-underline group/trigger">
              <div className="flex flex-col items-start space-y-3 text-left w-full">
                <div className="flex items-center gap-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-4 rounded-2xl bg-gradient-to-br from-[#ff7a00] to-[#ff9d42] border border-white/20 shadow-lg shadow-[#ff7a00]/20"
                  >
                    <Layers className="text-white w-6 h-6" />
                  </motion.div>
                  <div className="space-y-1">
                    <span className="text-3xl md:text-4xl font-black text-white uppercase tracking-[0.15em] block transition-all duration-500">
                      Category <span className="text-[#ff7a00]">Architect</span>
                    </span>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-[0.3em]">
                      Module Engine v2.0
                    </p>
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="relative z-10 px-10 pb-12">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-12"
                >
                  {/* Section 1: Core Identity */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-white/10" />
                      <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-2">
                        <Type size={14} className="text-[#ff7a00]" /> Core
                        Identity
                      </h3>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {/* Title */}
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1">
                              Label
                            </label>
                            <FormControl>
                              <div className="group/input relative">
                                <Input
                                  placeholder="e.g. Premium Selection"
                                  {...field}
                                  className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-white placeholder:text-white/20 focus:ring-2 focus:ring-[#ff7a00]/30 transition-all shadow-inner"
                                />
                                <div className="absolute inset-0 rounded-2xl border border-[#ff7a00]/0 group-focus-within/input:border-[#ff7a00]/30 pointer-events-none transition-all" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[9px] font-bold text-red-400 uppercase tracking-wider" />
                          </FormItem>
                        )}
                      />

                      {/* Type */}
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1">
                              Classification
                            </label>
                            <FormControl>
                              <div className="group/input relative">
                                <Input
                                  placeholder="e.g. kids, pets, adults"
                                  {...field}
                                  className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-white placeholder:text-white/20 focus:ring-2 focus:ring-[#ff7a00]/30 transition-all shadow-inner"
                                />
                                <div className="absolute inset-0 rounded-2xl border border-[#ff7a00]/0 group-focus-within/input:border-[#ff7a00]/30 pointer-events-none transition-all" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[9px] font-bold text-red-400 uppercase tracking-wider" />
                          </FormItem>
                        )}
                      />

                      {/* Subtitle */}
                      <FormField
                        control={form.control}
                        name="subtitle"
                        render={({ field }) => (
                          <FormItem className="space-y-2 md:col-span-2 lg:col-span-1">
                            <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1">
                              Descriptor
                            </label>
                            <FormControl>
                              <div className="group/input relative">
                                <Input
                                  placeholder="Node description..."
                                  {...field}
                                  className="h-14 bg-white/5 border-white/5 rounded-2xl px-6 text-white placeholder:text-white/20 focus:ring-2 focus:ring-[#ff7a00]/30 transition-all shadow-inner"
                                />
                                <div className="absolute inset-0 rounded-2xl border border-[#ff7a00]/0 group-focus-within/input:border-[#ff7a00]/30 pointer-events-none transition-all" />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[9px] font-bold text-red-400 uppercase tracking-wider" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Section 2: Logic Layer */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-white/10" />
                      <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-2">
                        <Zap size={14} className="text-[#ff7a00]" />{" "}
                        Intelligence Layer
                      </h3>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <FormField
                      control={form.control}
                      name="prompt"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1">
                            Neural Prompt Strategy
                          </label>
                          <FormControl>
                            <div className="group/input relative">
                              <textarea
                                {...field}
                                placeholder="Define the generation logic for this category..."
                                className="w-full min-h-[120px] bg-white/5 border-white/5 rounded-2xl p-6 text-white placeholder:text-white/20 focus:ring-2 focus:ring-[#ff7a00]/30 outline-none transition-all shadow-inner resize-none border border-transparent"
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Section 3: Visual Assets */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-white/10" />
                      <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] flex items-center gap-2">
                        <ImagePlus size={14} className="text-[#ff7a00]" />{" "}
                        Visual Assets
                      </h3>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      {/* Main Visual Marker */}
                      <div className="lg:col-span-4 space-y-4">
                        <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-2">
                          Hero Marker
                        </label>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          className="relative h-[280px] group/marker rounded-[2.5rem] border-2 border-dashed border-white/10 bg-white/5 overflow-hidden flex items-center justify-center transition-all hover:bg-white/[0.08] hover:border-[#ff7a00]/30 shadow-2xl"
                        >
                          <AnimatePresence mode="wait">
                            {preview ? (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="relative w-full h-full p-4"
                              >
                                <Image
                                  src={preview}
                                  alt="Hero Preview"
                                  fill
                                  className="object-contain"
                                />
                                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover/marker:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="rounded-xl px-6 py-5 font-black uppercase text-[10px] tracking-widest"
                                    onClick={() => {
                                      setPreview(null);
                                      form.setValue("image", undefined);
                                    }}
                                  >
                                    De-initialize
                                  </Button>
                                </div>
                              </motion.div>
                            ) : (
                              <label className="flex flex-col items-center gap-4 cursor-pointer w-full h-full justify-center group/btn-up">
                                <motion.div
                                  whileHover={{ rotate: 90 }}
                                  className="p-6 rounded-full bg-white/5 group-hover/btn-up:bg-[#ff7a00]/10 border border-white/10 transition-colors"
                                >
                                  <ImagePlus className="w-8 h-8 text-[#ff7a00]" />
                                </motion.div>
                                <div className="text-center space-y-1">
                                  <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                                    Upload Marker
                                  </span>
                                  <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest">
                                    SVG, PNG, JPG accepted
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                />
                              </label>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      </div>

                      {/* Gallery Array */}
                      <div className="lg:col-span-8 space-y-4">
                        <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-2">
                          Collection Node Array
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-6 rounded-[2.5rem] bg-white/5 border border-white/10 shadow-inner min-h-[280px]">
                          <AnimatePresence>
                            {galleryPreviews.map((preview, index) => (
                              <motion.div
                                key={index}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative aspect-square rounded-2xl border border-white/10 overflow-hidden group/gallery-item shadow-xl"
                              >
                                <Image
                                  src={preview}
                                  alt=""
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-red-600/40 opacity-0 group-hover/gallery-item:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                  <button
                                    type="button"
                                    onClick={() => removeGalleryImage(index)}
                                    className="p-3 bg-red-600 rounded-xl hover:scale-110 transition-transform shadow-lg"
                                  >
                                    <X size={16} className="text-white" />
                                  </button>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                          <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-white/10 cursor-pointer hover:bg-white/5 hover:border-[#ff7a00]/30 transition-all group/gallery-add">
                            <motion.div
                              whileHover={{ scale: 1.2 }}
                              className="p-4 rounded-xl bg-white/5 group-hover/gallery-add:bg-[#ff7a00]/10 transition-colors"
                            >
                              <ImagePlus className="w-5 h-5 text-white/40 group-hover/gallery-add:text-[#ff7a00]" />
                            </motion.div>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*"
                              multiple
                              onChange={handleGalleryChange}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submission Layer */}
                  <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      <div
                        className={`w-2 h-2 rounded-full ${isPending ? "bg-[#ff7a00] animate-pulse" : "bg-green-500"}`}
                      />
                      System Status: {isPending ? "Syncing..." : "Ready"}
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="relative group/btn cursor-pointer w-full md:w-auto px-16 py-6 rounded-2xl overflow-hidden transition-all duration-500 active:scale-95 disabled:grayscale"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#ff7a00] to-[#ff9d42] group-hover/btn:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_100%)] blur-2xl transition-opacity animate-pulse" />

                      <div className="relative flex items-center justify-center gap-4 text-white font-black uppercase tracking-[0.25em] text-sm">
                        {isPending ? (
                          <>
                            <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            Executing...
                          </>
                        ) : (
                          <>
                            <Zap size={18} fill="currentColor" />
                            Initialize Category
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </form>
              </Form>
            </AccordionContent>
          </motion.div>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AddCategory;
