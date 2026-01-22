import React from "react";
import { Card, CardContent } from "@/components/ui/card";


interface CardOverviewProps {
    title: string;
    numberInfo: string | number;
    trend?: string;
    isUp?: boolean;
}

const CardOverview: React.FC<CardOverviewProps> = ({
    title,
    numberInfo,
    trend,
    isUp,
}) => {
    return (
        <Card className="flex-1 min-w-[300px] border-lg shadow-base rounded-xl overflow-hidden bg-white">
            <CardContent className="p-6">
                <h3 className="text-[#343A40] font-bold text-sm mb-6 uppercase tracking-wider opacity-80">{title}</h3>

                <div className="flex justify-between items-end">
                    <div className="space-y-3">
                        <div className="text-4xl font-extrabold text-[#111827]">{numberInfo}</div>
                        {trend && (
                            <div className="text-sm font-medium text-gray-500 mt-1">
                                Last month
                            </div>
                        )}
                    </div>

                    {/* Sparkline Placeholder */}
                    <div className="relative h-12 w-24">
                        <svg className="w-full h-full" viewBox="0 0 100 40">
                            <path
                                d={isUp ? "M0,35 Q25,30 50,20 T100,5" : "M0,5 Q25,10 50,20 T100,35"}
                                fill="none"
                                stroke={isUp ? "#10B981" : "#EF4444"}
                                strokeWidth="3"
                                strokeLinecap="round"
                                className="opacity-40"
                            />
                        </svg>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CardOverview;