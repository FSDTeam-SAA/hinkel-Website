"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { CategoryContent } from "@/features/category-page/types";
import { cn } from "@/lib/utils";

interface BookStyleSelectorProps {
    selectedType: string;
    onSelect: (type: string) => void;
    categories: CategoryContent[];
}

export function BookStyleSelector({
    selectedType,
    onSelect,
    categories,
}: BookStyleSelectorProps) {
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedCategory = categories.find((c) => c.type === selectedType);
    const displayLabel = selectedCategory?.title || selectedType || "Select a Style";

    return (
        <div className="mb-10 flex flex-col items-center">
            <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Select Book Style
            </label>
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className={cn(
                        "flex items-center gap-2 px-6 py-3 bg-white border border-border rounded-full shadow-sm hover:border-primary transition-all duration-300 min-w-[240px] justify-between",
                        showDropdown && "border-primary ring-2 ring-primary/10",
                        !selectedType && "border-primary/50 bg-primary/5 animate-pulse"
                    )}
                >
                    <span
                        className={cn(
                            "font-bold text-lg capitalize",
                            selectedType ? "text-foreground" : "text-primary/70"
                        )}
                    >
                        {displayLabel}
                    </span>
                    <ChevronDown
                        className={cn(
                            "w-5 h-5 text-muted-foreground transition-transform duration-300",
                            showDropdown && "rotate-180"
                        )}
                    />
                </button>

                {showDropdown && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[300px] bg-white border border-border shadow-xl rounded-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-1 gap-1 max-h-[300px] overflow-y-auto scrollbar-hide">
                            {categories.map((category: CategoryContent) => (
                                <button
                                    key={category._id}
                                    onClick={() => {
                                        if (category.type) {
                                            onSelect(category.type);
                                        }
                                        setShowDropdown(false);
                                    }}
                                    className={cn(
                                        "flex flex-col items-start p-3 rounded-xl hover:bg-primary/5 transition-colors text-left",
                                        selectedType === category.type && "bg-primary/5"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "text-sm font-bold text-gray-900 capitalize",
                                            selectedType === category.type && "text-primary"
                                        )}
                                    >
                                        {category.title}
                                    </span>
                                    <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
                                        {category.type}
                                    </span>
                                </button>
                            ))}
                            {categories.length === 0 && (
                                <div className="text-center py-4 text-gray-500 text-sm italic">
                                    No styles found
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
