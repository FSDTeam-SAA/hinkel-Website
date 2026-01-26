// src/components/dashboard/pages/faqs/Faqs.tsx
"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useFaq, useUpdateFaq } from "@/features/dashboard/hooks/use-faq";
import { FaqConfig } from "@/features/dashboard/types/faq.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  HelpCircle,
  Megaphone,
} from "lucide-react";

const faqSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().min(1, "Subtitle is required"),
  status: z.literal("published"),
  cta: z.object({
    enabled: z.boolean(),
    heading: z.string(),
    text: z.string(),
    button: z.object({
      label: z.string(),
      href: z.string(),
      target: z.string(),
    }),
    avatars: z.array(
      z.object({
        url: z.string(),
        alt: z.string(),
      }),
    ),
  }),
  items: z.array(
    z.object({
      question: z.string().min(1, "Question is required"),
      answer: z.object({
        raw: z.string().min(1, "Answer is required"),
        format: z.enum(["html", "text"]),
      }),
      order: z.number(),
      isActive: z.boolean(),
      defaultOpen: z.boolean(),
    }),
  ),
});

type FaqSchemaType = z.infer<typeof faqSchema>;

const Faqs = () => {
  const { data: faqData, isLoading: isFetching } = useFaq();
  const { mutate: updateFaq, isPending: isUpdating } = useUpdateFaq();

  const form = useForm<FaqSchemaType>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      status: "published",
      cta: {
        enabled: false,
        heading: "",
        text: "",
        button: { label: "", href: "", target: "_self" },
        avatars: [],
      },
      items: [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "items",
  });

  useEffect(() => {
    if (faqData?.data) {
      form.reset({
        ...faqData.data,
        status: "published", // Force published
      });
    }
  }, [faqData, form]);

  const onSubmit = (data: FaqSchemaType) => {
    const finalData = {
      ...data,
      status: "published" as const,
    };
    updateFaq(finalData as FaqConfig, {
      onSuccess: () => {
        toast.success("FAQs updated successfully");
      },
      onError: (error) => {
        toast.error("Failed to update FAQs: " + error.message);
      },
    });
  };

  if (isFetching) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Manage FAQs & CTA
          </h1>
          <p className="text-slate-500">
            Configure your frequently asked questions and call-to-action
            section.
          </p>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isUpdating}
          className="bg-primary hover:bg-primary/90"
        >
          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Header Settings */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
            <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <HelpCircle className="h-5 w-5 text-primary" />
              Section Header
            </div>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Frequently asked questions"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description for the FAQ section..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* CTA Settings (Optional) */}
          <Accordion
            type="single"
            collapsible
            className="bg-white rounded-2xl shadow-sm border border-slate-200"
          >
            <AccordionItem value="cta-settings" className="border-none">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
                  <Megaphone className="h-5 w-5 text-primary" />
                  CTA Settings (Optional)
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-6">
                <FormField
                  control={form.control}
                  name="cta.enabled"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Enable CTA Section</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="cta.heading"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CTA Heading</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Still have questions?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cta.button.label"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Label</FormLabel>
                        <FormControl>
                          <Input placeholder="Get in touch" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="cta.button.href"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Button Link</FormLabel>
                        <FormControl>
                          <Input placeholder="/contact-us" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cta.text"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CTA Text</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Can't find the answer you're looking for?"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* FAQ Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">FAQ Items</h2>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    question: "",
                    answer: { raw: "", format: "html" },
                    order: fields.length + 1,
                    isActive: true,
                    defaultOpen: false,
                  })
                }
                className="border-primary text-primary hover:bg-primary/5"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4 relative group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={index === 0}
                        onClick={() => move(index, index - 1)}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={index === fields.length - 1}
                        onClick={() => move(index, index + 1)}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="font-bold text-slate-400">
                      #{index + 1}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`items.${index}.question`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter question..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name={`items.${index}.isActive`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 mt-8">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer">
                            Active
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`items.${index}.defaultOpen`}
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-2 space-y-0 mt-8">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer">
                            Default Open
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name={`items.${index}.answer.raw`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer (HTML supported)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter answer..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}

            {fields.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500">
                  No FAQ items added yet. Click &quot;Add Item&quot; to begin.
                </p>
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Faqs;
