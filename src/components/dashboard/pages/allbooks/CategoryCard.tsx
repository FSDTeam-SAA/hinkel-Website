"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Layers, Search, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { CategoryContent } from "@/features/category-page/types";
import { useDeleteCategory } from "@/features/dashboard/hooks/useCategory";
import { useStatusUpdate } from "@/features/dashboard/hooks/useStatusUpdate";
import EditCategory from "./EditCategory";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CategoryCardProps {
    category: CategoryContent;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const { mutate: deleteCategory } = useDeleteCategory();
    const { updateStatus, loading: isUpdating } = useStatusUpdate();

    const handleStatusChange = async (newStatus: string) => {
        try {
            await updateStatus(category._id, newStatus);
            toast.success(`Protocol ${category.title.slice(0, 8)} status: ${newStatus.toUpperCase()}`);
        } catch {
            toast.error("Failed to update terminal status");
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        deleteCategory(category._id, {
            onSuccess: () => {
                toast.success("Category deleted successfully");
                setIsDeleteDialogOpen(false);
            },
            onError: () => toast.error("Failed to delete category"),
        });
    };

    return (
        <Card className="group h-full bg-white border-2 border-gray-100 rounded-[2rem] py-0! transition-all duration-500 flex flex-col hover:border-[#ff7a00]/30 hover:shadow-2xl hover:shadow-[#ff7a00]/10 overflow-hidden relative">
            <Link href={`/${category.type}`} className="absolute inset-0 z-10" />
            <div className="aspect-[4/5] relative w-full overflow-hidden bg-gray-100 border-b border-gray-100">
                <Image
                    src={category.image || "/no-image.jpg"}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500 z-20">

                    {/* Edit Dialog */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 bg-white/80 backdrop-blur-md border border-slate-200 hover:bg-[#ff7a00] hover:text-white transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <Edit className="w-4 h-4 text-slate-600" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border border-slate-200 text-slate-900 max-w-2xl overflow-hidden p-0">
                            <div className="p-6 pb-0">
                                <DialogHeader>
                                    <DialogTitle className="text-slate-900">Edit Category</DialogTitle>
                                    <DialogDescription className="text-slate-500">
                                        Modify the details of the category below.
                                    </DialogDescription>
                                </DialogHeader>
                            </div>
                            <EditCategory
                                category={category}
                                onSuccess={() => setIsEditDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>

                    {/* Delete Dialog */}
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild>
                            <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 bg-red-500/20 backdrop-blur-md border border-red-500/30 hover:bg-red-600 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                            >
                                <Trash2 className="w-4 h-4 text-red-500 hover:text-white" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border border-slate-200">
                            <DialogHeader>
                                <DialogTitle className="text-slate-900">Delete Category?</DialogTitle>
                                <DialogDescription className="text-slate-500">
                                    This action cannot be undone. This will permanently delete the category
                                    &quot;{category.title}&quot; and all its associated data.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="ghost" className="bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100">Cancel</Button>
                                </DialogClose>
                                <Button
                                    onClick={handleDelete}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
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
                    {category.title}
                </CardTitle>
            </CardContent>

            <CardFooter className="px-6 pb-6 pt-0 mt-auto">
                <div className="w-full pt-4 border-t border-gray-100 space-y-4">
                    <div className="flex items-center justify-between group/footer">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 group-hover:text-gray-900 transition-colors">
                            <Search size={14} /> View Archive
                        </span>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#ff7a00] transition-colors duration-300">
                            <ArrowUpRight size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                        </div>
                    </div>

                    {/* Delivery Status Controller */}
                    <div className="relative z-20 flex items-center justify-between gap-2 p-2 bg-gray-50 rounded-xl border border-gray-100 group-hover:border-[#ff7a00]/20 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">
                            Delivery Status
                        </span>
                        <Select onValueChange={handleStatusChange} disabled={isUpdating}>
                            <SelectTrigger className="h-7 w-[100px] text-[10px] font-bold uppercase tracking-widest bg-white border-slate-200 shadow-sm">
                                <SelectValue placeholder="System Status" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-slate-200 text-slate-900">
                                <SelectItem value="pending" className="text-[10px] font-bold uppercase tracking-widest">Pending</SelectItem>
                                <SelectItem value="paid" className="text-[10px] font-bold uppercase tracking-widest">Paid</SelectItem>
                                <SelectItem value="canceled" className="text-[10px] font-bold uppercase tracking-widest">Canceled</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardFooter>

            <div className="absolute inset-0 border-2 border-[#ff7a00] rounded-[2rem] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
        </Card>
    );
};

export default CategoryCard;
