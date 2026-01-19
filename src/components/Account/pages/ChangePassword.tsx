"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Lock, ShieldCheck, Loader2, Zap, KeyRound, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const ChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            toast.success("Security Credentials Updated", {
                description: "Your password protocol has been synchronized.",
                icon: <ShieldCheck className="text-green-500" />
            });
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-transparent space-y-10 py-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            
            {/* Security Command Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-gray-950 p-10 rounded-[2.5rem] shadow-3xl relative overflow-hidden ring-1 ring-white/10">
                <div className="space-y-4 relative z-10">
                    <div className="flex items-center gap-3">
                        <span className="flex h-3 w-3 rounded-full bg-[#ff7a00] animate-pulse ring-4 ring-[#ff7a00]/20"></span>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Access Control</span>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter">
                        Security <span className="text-[#ff7a00]">Protocol</span>
                    </h1>
                    <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
                        Update your authentication credentials. We recommend a unique 16-character string to maintain maximum account integrity.
                    </p>
                </div>

                <div className="hidden md:flex bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-1 relative z-10">
                    <div className="text-gray-500 text-xs font-bold uppercase tracking-tighter flex items-center gap-2 text-white">
                        <Zap size={14} className="text-[#ff7a00]" /> Encryption
                    </div>
                    <div className="text-2xl font-mono text-green-400 tracking-widest">AES-256</div>
                </div>

                {/* Cyber Background Pattern - Matching the PriceSet component */}
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 right-10 w-64 h-64 bg-[#ff7a00] rounded-full blur-[120px]"></div>
                </div>
            </div>

            {/* Password Update Form */}
            <div className="max-w-2xl mx-auto">
                <Card className="group bg-white border-2 border-gray-100 rounded-[2rem] transition-all duration-500 hover:border-[#ff7a00]/30 hover:shadow-2xl focus-within:border-[#ff7a00]/50">
                    <form onSubmit={handleSubmit}>
                        <CardHeader className="space-y-4 p-8">
                            <div className="flex items-center justify-between">
                                <div className="p-4 rounded-2xl bg-gray-50 group-hover:bg-[#ff7a00]/10 transition-colors duration-500">
                                    <KeyRound className="w-8 h-8 text-[#ff7a00]" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-gray-900 text-white rounded-full">
                                    Identity Verified
                                </span>
                            </div>
                            <CardTitle className="text-3xl font-black text-gray-900 tracking-tight">Update Credentials</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-6 px-8">
                            {/* Current Password */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-900 uppercase tracking-widest">Current Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#ff7a00] transition-colors" size={20} />
                                    <Input 
                                        type="password"
                                        placeholder="••••••••" 
                                        className="h-16 pl-12 text-xl font-medium border-2 border-gray-100 bg-gray-50/50 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#ff7a00]/10 focus:border-[#ff7a00] transition-all"
                                    />
                                </div>
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <Label className="text-xs font-bold text-gray-900 uppercase tracking-widest">New Secure Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#ff7a00] transition-colors" size={20} />
                                    <Input 
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create strong password" 
                                        className="h-16 pl-12 pr-12 text-xl font-medium border-2 border-gray-100 bg-gray-50/50 rounded-2xl focus:bg-white focus:ring-4 focus:ring-[#ff7a00]/10 focus:border-[#ff7a00] transition-all"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                        </CardContent>

                        <CardFooter className="p-8 pb-10">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-gray-900 hover:bg-black text-white text-lg font-black rounded-2xl shadow-xl transition-all active:scale-[0.98] group/btn overflow-hidden relative"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    {loading ? <Loader2 className="animate-spin h-6 w-6" /> : "Authorize Password Update"}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-[#ff7a00] to-[#ff9500] translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500"></div>
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default ChangePassword;