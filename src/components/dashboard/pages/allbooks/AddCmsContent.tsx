"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { AlignLeft, Layers, Zap } from "lucide-react";
import {
  useCreateCms,
  useUpdateCms,
  useGetCmsTypes,
} from "@/features/dashboard/hooks/useCms";
import {
  CmsContent,
  CreateCmsDto,
  UpdateCmsDto,
} from "@/features/dashboard/api/cms.api";
import RichTextEditor from "../../editor/RichTextEditor";

const formSchema = z.object({
  type: z.string().min(2, "Type is required"),
  richText: z.string().optional(), // stored as JSON string
  plainText: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddCmsContentProps {
  initialData?: CmsContent;
  onSuccess?: () => void;
}

const AddCmsContent = ({ initialData, onSuccess }: AddCmsContentProps) => {
  const { mutate: createCms, isPending: isCreating } = useCreateCms();
  const { mutate: updateCms, isPending: isUpdating } = useUpdateCms();
  const { data: typesData } = useGetCmsTypes();

  const isEditing = !!initialData;
  const isPending = isCreating || isUpdating;
  const availableTypes = typesData?.data?.data || [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: initialData?.type || "",
      richText: initialData?.richText || "",
      plainText: initialData?.plainText || "",
    },
  });

  function onSubmit(values: FormValues) {
    if (isEditing && initialData) {
      // Prepare update DTO
      const updateData: UpdateCmsDto = {
        type: values.type,
        richText: values.richText,
        plainText: values.plainText,
      };

      updateCms(
        { id: initialData._id, data: updateData },
        {
          onSuccess: () => {
            toast.success("Content updated successfully");
            if (onSuccess) onSuccess();
          },
          //eslint-disable-next-line
          onError: (error: any) => {
            toast.error(error?.response?.data?.message || "Update failed");
          },
        },
      );
    } else {
      // Create
      const createData: CreateCmsDto = {
        type: values.type,
        richText: values.richText,
        plainText: values.plainText,
      };

      createCms(createData, {
        onSuccess: () => {
          toast.success("Content created successfully");
          form.reset();
          if (onSuccess) onSuccess();
        },
        //eslint-disable-next-line
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Creation failed");
        },
      });
    }
  }

  return (
    <div className="relative">
      <div className="p-6 bg-slate-900/50 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 rounded-xl bg-[#ff7a00]/10 text-[#ff7a00]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {isEditing ? "Edit Content Node" : "Initialize Content Node"}
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Configure content parameters
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Core Identity */}
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1">
                      Type Key
                    </label>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white placeholder:text-white/20">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableTypes.map((t: string) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Rich Logic */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1 flex items-center gap-2">
                <AlignLeft size={14} className="text-[#ff7a00]" /> Content Body
              </label>
              <FormField
                control={form.control}
                name="richText"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor
                        content={field.value || ""}
                        onChange={(json, html) => {
                          field.onChange(json);
                          form.setValue(
                            "plainText",
                            html.replace(/<[^>]*>/g, ""),
                          ); // Basic strip tags for plainText
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Actions */}
            <div className="pt-4 flex justify-end gap-4">
              {onSuccess && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onSuccess}
                  className="text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isPending}
                className="bg-linear-to-r from-[#ff7a00] to-[#ff9d42] text-white font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
              >
                {isPending ? (
                  <Zap className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4 mr-2" />
                )}
                {isEditing ? "Update Node" : "Initialize Node"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddCmsContent;
