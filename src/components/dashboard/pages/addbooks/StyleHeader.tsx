"use client";

import React, { useState } from "react";
import {
  useStyles,
  useCreateStyle,
  useUpdateStyle,
} from "@/features/dashboard/hooks/useStyle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save, Edit2, X } from "lucide-react";
import { toast } from "sonner";

export const StyleHeader = () => {
  const { data: stylesData, isLoading } = useStyles();
  const updateStyle = useUpdateStyle();
  const createStyle = useCreateStyle();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    badgeText: "",
  });

  const style = stylesData?.data?.[0];

  const handleStartEditing = () => {
    if (style) {
      setFormData({
        title: style.title || "",
        subtitle: style.subtitle || "",
        badgeText: style.badgeText || "",
      });
    }
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      if (style?._id) {
        await updateStyle.mutateAsync({
          id: style._id,
          data: formData,
        });
        toast.success("Style updated successfully");
      } else {
        await createStyle.mutateAsync(formData);
        toast.success("Style created successfully");
      }
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to save style");
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="overflow-hidden border-none shadow-lg bg-linear-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-950/50">
      <CardContent className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1 w-full space-y-4">
            {!isEditing ? (
              <div className="space-y-2 group relative">
                <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition-colors">
                  {style?.badgeText || "Section Badge"}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {style?.title || "Add New Category Page"}
                </h1>
                <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                  {style?.subtitle ||
                    "Manage your orders, track shipments, and configure products easily."}
                </p>
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleStartEditing}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full bg-white/50 dark:bg-gray-800/50 p-6 rounded-2xl backdrop-blur-sm border border-gray-100 dark:border-gray-800">
                <div className="space-y-2">
                  <Label
                    htmlFor="badgeText"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Badge Text
                  </Label>
                  <Input
                    id="badgeText"
                    value={formData.badgeText}
                    onChange={(e) =>
                      setFormData({ ...formData, badgeText: e.target.value })
                    }
                    placeholder="e.g. Featured Collection"
                    className="bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2 md:col-span-1 lg:col-span-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. Explore Style"
                    className="bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label
                    htmlFor="subtitle"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Subtitle
                  </Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) =>
                      setFormData({ ...formData, subtitle: e.target.value })
                    }
                    placeholder="e.g. Discover our latest trends and styles..."
                    className="bg-white/80 dark:bg-gray-900/80 border-gray-200 dark:border-gray-700 focus:ring-primary/20"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 shrink-0">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  className="rounded-xl px-6"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-[#FF8B36] hover:bg-[#e67a2e] text-white rounded-xl px-6 shadow-md shadow-orange-500/20"
                  disabled={updateStyle.isPending || createStyle.isPending}
                >
                  {updateStyle.isPending || createStyle.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </>
            ) : (
              <Button
                onClick={handleStartEditing}
                className="bg-[#FF8B36] hover:bg-[#e67a2e] text-white rounded-xl px-8 py-6 text-lg font-semibold shadow-xl shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Edit2 className="w-5 h-5 mr-2" />
                Customize Styles Header
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
