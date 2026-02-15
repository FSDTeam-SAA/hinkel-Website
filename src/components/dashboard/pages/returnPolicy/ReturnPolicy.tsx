// src/components/dashboard/pages/returnPolicy/ReturnPolicy.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useReturnPolicy,
  useCreateReturnPolicy,
  useUpdateReturnPolicy,
  useDeleteReturnPolicy,
} from "@/features/dashboard/hooks/use-return-policy";
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
import { toast } from "sonner";
import {
  Loader2,
  RotateCcw,
  FileText,
  Plus,
  Save,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const returnPolicySchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
});

type ReturnPolicySchemaType = z.infer<typeof returnPolicySchema>;

const ReturnPolicy = () => {
  const { data: policyData, isLoading: isFetching } = useReturnPolicy();
  const { mutate: createPolicy, isPending: isCreating } =
    useCreateReturnPolicy();
  const { mutate: updatePolicy, isPending: isUpdating } =
    useUpdateReturnPolicy();
  const { mutate: deletePolicy, isPending: isDeleting } =
    useDeleteReturnPolicy();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [policyToDelete, setPolicyToDelete] = useState<string | null>(null);

  // Check if a policy already exists
  const existingPolicy =
    policyData?.data && policyData.data.length > 0 ? policyData.data[0] : null;
  const isEditMode = !!existingPolicy;

  const form = useForm<ReturnPolicySchemaType>({
    resolver: zodResolver(returnPolicySchema),
    defaultValues: {
      title: "",
      content: "",
    },
  });

  useEffect(() => {
    if (existingPolicy) {
      form.reset({
        title: existingPolicy.title,
        content: existingPolicy.content,
      });
    }
  }, [existingPolicy, form]);

  const onSubmit = (data: ReturnPolicySchemaType) => {
    if (isEditMode && existingPolicy) {
      // Update existing policy
      updatePolicy(
        { id: existingPolicy._id, data },
        {
          onSuccess: () => {
            toast.success("Return Policy updated successfully");
          },
          onError: (error: Error) => {
            toast.error("Failed to update Return Policy: " + error.message);
          },
        },
      );
    } else {
      // Create new policy
      createPolicy(data, {
        onSuccess: () => {
          toast.success("Return Policy created successfully");
        },
        onError: (error: Error) => {
          toast.error("Failed to create Return Policy: " + error.message);
        },
      });
    }
  };

  const handleDelete = () => {
    if (!policyToDelete) return;
    deletePolicy(policyToDelete, {
      onSuccess: () => {
        toast.success("Return Policy deleted successfully");
        form.reset({ title: "", content: "" });
        setDeleteDialogOpen(false);
        setPolicyToDelete(null);
      },
      onError: (error: Error) => {
        toast.error("Failed to delete Return Policy: " + error.message);
        setDeleteDialogOpen(false);
      },
    });
  };

  const openDeleteDialog = (id: string) => {
    setPolicyToDelete(id);
    setDeleteDialogOpen(true);
  };

  const isSaving = isCreating || isUpdating;

  if (isFetching) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            <RotateCcw className="h-8 w-8 text-primary" />
            Return / Refund Policy
          </h1>
          <p className="text-slate-500 mt-1">
            {isEditMode
              ? "Update and manage your website\u0027s return and refund policy content."
              : "Create your website\u0027s return and refund policy."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isEditMode && existingPolicy && (
            <Button
              type="button"
              variant="outline"
              onClick={() => openDeleteDialog(existingPolicy._id)}
              disabled={isDeleting}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 min-w-[120px]"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          )}
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 min-w-[160px]"
          >
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : isEditMode ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Create Policy
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      {isEditMode && existingPolicy && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
            Policy Active
          </span>
          <span className="text-xs text-slate-400">
            Last updated:{" "}
            {new Date(existingPolicy.updatedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      )}

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8">
            {/* Title */}
            <div>
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
                        placeholder="e.g. Return & Refund Policy"
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Content Editor */}
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
                      Supports rich text formatting
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

      {/* Info Box for create mode */}
      {!isEditMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">
              No Return Policy Found
            </p>
            <p className="text-sm text-amber-600 mt-1">
              You haven&apos;t created a return / refund policy yet. Fill in the
              form above and click &quot;Create Policy&quot; to publish it on
              your website.
            </p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Delete Return Policy
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this return policy? This action
              cannot be undone and will remove it from your website.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReturnPolicy;
