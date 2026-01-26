// src/components/dashboard/pages/privacy/Privacy.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  usePrivacy,
  useUpdatePrivacy,
} from "@/features/dashboard/hooks/use-privacy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Editor from "@/components/dashboard/common/Editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, ShieldCheck, FileText } from "lucide-react";

const privacySchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["published", "draft"]),
});

type PrivacySchemaType = z.infer<typeof privacySchema>;

const Privacy = () => {
  const { data: privacyData, isLoading: isFetching } = usePrivacy();
  const { mutate: updatePrivacy, isPending: isUpdating } = useUpdatePrivacy();

  const form = useForm<PrivacySchemaType>({
    resolver: zodResolver(privacySchema),
    defaultValues: {
      title: "",
      content: "",
      status: "draft",
    },
  });

  useEffect(() => {
    if (privacyData?.data) {
      form.reset({
        title: privacyData.data.title,
        content: privacyData.data.content,
        status: privacyData.data.status,
      });
    }
  }, [privacyData, form]);

  const onSubmit = (data: PrivacySchemaType) => {
    updatePrivacy(data, {
      onSuccess: () => {
        toast.success("Privacy Policy updated successfully");
      },
      onError: (error: Error) => {
        toast.error("Failed to update Privacy Policy: " + error.message);
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
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="h-8 w-8 text-primary" />
            Privacy Policy Management
          </h1>
          <p className="text-slate-500 mt-1">
            Update and manage your website&apos;s privacy policy content.
          </p>
        </div>
        <Button
          onClick={form.handleSubmit(onSubmit)}
          disabled={isUpdating}
          className="bg-primary hover:bg-primary/90 min-w-[140px]"
        >
          {isUpdating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        Policy Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Privacy Policy"
                          className="h-11"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div>
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold">
                        Status
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft" className="text-amber-600">
                            Draft
                          </SelectItem>
                          <SelectItem
                            value="published"
                            className="text-emerald-600"
                          >
                            Published
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between mb-2">
                    <FormLabel className="text-slate-700 font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Policy Content
                    </FormLabel>
                    <span className="text-xs text-slate-400">
                      Supports plain text and basic formatting
                    </span>
                  </div>
                  <FormControl>
                    <Editor value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Privacy;
