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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ImagePlus, Type, Layers, Zap, X, Plus } from "lucide-react";
import Image from "next/image";
import { useCreateCategory } from "@/features/dashboard/hooks/useCategory";

const formSchema = z.object({
  title: z.string().min(2, "Title is required"),
  subtitle: z.string().min(2, "Subtitle is required"),
  type: z.string().min(2, "Type is required (e.g., adult, pet)"),
  prompt: z.string().optional(),
  image: z.any().refine((file) => file?.length > 0, "Image is required"),
  gallery: z.any().optional(),
});

interface AddCategoryProps {
  trigger?: React.ReactNode;
}

const AddCategory = ({ trigger }: AddCategoryProps) => {
  const [open, setOpen] = useState(false);
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
        setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative cursor-pointer"
          >
            <div className="relative rounded-[2rem] bg-white border border-slate-200 p-8 h-full min-h-[140px] flex items-center justify-between gap-6 overflow-hidden transition-all duration-500 hover:border-[#ff7a00]/30 hover:shadow-xl hover:shadow-[#ff7a00]/5">
              <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10 flex items-center gap-6">
                <div className="p-4 rounded-2xl bg-[#ff7a00]/10 text-[#ff7a00] group-hover:bg-[#ff7a00] group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-md group-hover:shadow-[#ff7a00]/20">
                  <Plus size={24} strokeWidth={3} />
                </div>
                <div className="text-left space-y-1">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-[#ff7a00] transition-colors">
                    Create New Category
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    Initialize a new content node
                  </p>
                </div>
              </div>

              <div className="relative z-10 hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider group-hover:bg-white group-hover:text-[#ff7a00] transition-colors">
                <Layers size={14} />
                <span>Module Engine</span>
              </div>
            </div>
          </motion.div>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-[#0f1117] border-white/10 text-white rounded-[2rem]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff7a00]/5 via-transparent to-blue-500/5 pointer-events-none" />

        <DialogHeader className="px-8 pt-8 pb-4 relative z-10 border-b border-white/5 space-y-1">
          <DialogTitle className="text-2xl font-black uppercase tracking-wider flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#ff7a00] text-white">
              <Layers size={20} />
            </div>
            Create Category
          </DialogTitle>
          <p className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] pl-12">
            System Configuration Node
          </p>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[80vh] px-8 py-6 relative z-10 custom-scrollbar">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              {/* Section 1: Core Identity */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2 whitespace-nowrap">
                    <Type size={14} className="text-[#ff7a00]" /> Core Identity
                  </h3>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          <Input
                            placeholder="e.g. Premium Selection"
                            {...field}
                            className="h-12 bg-white/5 border-white/10 rounded-xl px-4 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-[#ff7a00] focus-visible:border-[#ff7a00]/50 transition-all font-medium"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] text-red-400 font-medium" />
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
                          <Input
                            placeholder="e.g. kids, pets, adults"
                            {...field}
                            className="h-12 bg-white/5 border-white/10 rounded-xl px-4 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-[#ff7a00] focus-visible:border-[#ff7a00]/50 transition-all font-medium"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] text-red-400 font-medium" />
                      </FormItem>
                    )}
                  />

                  {/* Subtitle */}
                  <FormField
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem className="space-y-2 md:col-span-2">
                        <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1">
                          Descriptor
                        </label>
                        <FormControl>
                          <Input
                            placeholder="Brief description of the category..."
                            {...field}
                            className="h-12 bg-white/5 border-white/10 rounded-xl px-4 text-white placeholder:text-white/20 focus-visible:ring-1 focus-visible:ring-[#ff7a00] focus-visible:border-[#ff7a00]/50 transition-all font-medium"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] text-red-400 font-medium" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Section 2: Logic Layer */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2 whitespace-nowrap">
                    <Zap size={14} className="text-[#ff7a00]" /> Intelligence
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
                        <textarea
                          {...field}
                          placeholder="Define the generation logic..."
                          className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/20 focus:ring-1 focus:ring-[#ff7a00] focus:border-[#ff7a00]/50 outline-none transition-all resize-none text-sm font-medium leading-relaxed"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Section 3: Visual Assets */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] flex items-center gap-2 whitespace-nowrap">
                    <ImagePlus size={14} className="text-[#ff7a00]" /> Assets
                  </h3>
                  <div className="h-px flex-1 bg-white/10" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Main Visual Marker */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-2">
                      Hero Marker (Required)
                    </label>
                    <motion.div className="relative h-[200px] group/marker rounded-2xl border-2 border-dashed border-white/10 bg-white/5 overflow-hidden flex items-center justify-center transition-all hover:bg-white/[0.08] hover:border-[#ff7a00]/30">
                      <AnimatePresence mode="wait">
                        {preview ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative w-full h-full p-2"
                          >
                            <Image
                              src={preview}
                              alt="Hero Preview"
                              fill
                              className="object-contain"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/marker:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setPreview(null);
                                  form.setValue("image", undefined);
                                }}
                              >
                                Remove
                              </Button>
                            </div>
                          </motion.div>
                        ) : (
                          <label className="flex flex-col items-center gap-3 cursor-pointer w-full h-full justify-center group/btn-up">
                            <div className="p-3 rounded-full bg-white/5 group-hover/btn-up:bg-[#ff7a00]/10 border border-white/10 transition-colors">
                              <ImagePlus className="w-6 h-6 text-[#ff7a00]" />
                            </div>
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">
                              Upload Image
                            </span>
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
                    <FormMessage className="text-[10px] text-red-400 font-medium">
                      {form.formState.errors.image?.message as string}
                    </FormMessage>
                  </div>

                  {/* Gallery Array */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-2">
                      Gallery Collection
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <AnimatePresence>
                        {galleryPreviews.map((preview, index) => (
                          <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative aspect-square rounded-lg border border-white/10 overflow-hidden group/gallery-item bg-black/20"
                          >
                            <Image
                              src={preview}
                              alt=""
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-red-600/60 opacity-0 group-hover/gallery-item:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => removeGalleryImage(index)}
                                className="p-1 bg-white rounded-full hover:scale-110 transition-transform"
                              >
                                <X size={12} className="text-red-600" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      <label className="flex flex-col items-center justify-center aspect-square rounded-lg border border-dashed border-white/10 cursor-pointer hover:bg-white/5 hover:border-[#ff7a00]/30 transition-all">
                        <Plus className="w-5 h-5 text-white/30" />
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
              <div className="pt-6 border-t border-white/10 flex items-center justify-end gap-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-white/50 hover:text-white hover:bg-white/5"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-[#ff7a00] hover:bg-[#ff9d42] text-white font-bold uppercase tracking-widest px-8 py-6 rounded-xl"
                >
                  {isPending ? "Processing..." : "Create Category"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategory;
