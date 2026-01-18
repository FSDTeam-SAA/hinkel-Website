// features/account/pages/MyOrders.tsx
"use client";

import React from "react";
import {
  ShoppingBag,
  Package,
  CheckCircle2,
  Clock,
  ChevronRight,
  Search,
  Filter,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrderList } from "@/features/account/hooks/useOrderlist";
import { useSession } from "next-auth/react";

interface Order {
  _id?: string;
  id?: string;
  orderNumber?: string;
  deliveryType?: string;
  productName?: string;
  createdAt?: string;
  amount?: string | number;
  status?: string;
}

const OrderListPage = () => {
  const { data: session } = useSession();
  const {
    data: ordersData,
    isLoading,
    error,
  } = useOrderList(session?.user?.id as string);

  const orders: Order[] = ordersData?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-700">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-[#ff7a00] animate-spin" />
          <div className="absolute inset-0 bg-[#ff7a00]/20 blur-xl rounded-full animate-pulse"></div>
        </div>
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
          Synchronizing Registry...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-6 p-10 bg-red-50/50 rounded-[2.5rem] border-2 border-red-100 animate-in zoom-in-95 duration-500">
        <div className="bg-red-100 p-4 rounded-2xl text-red-600">
          <AlertCircle size={32} />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-black text-gray-900">
            Registry Access Denied
          </h3>
          <p className="text-gray-500 font-medium">
            {(error as Error)?.message || "Internal Protocol Error"}
          </p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="h-14 px-8 rounded-2xl border-2 border-red-200 text-red-600 hover:bg-red-600 hover:text-white transition-all font-black uppercase tracking-widest"
        >
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent space-y-10 py-6 animate-in fade-in duration-1000">
      {/* Registry Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-gray-950 p-10 rounded-[2.5rem] shadow-3xl relative overflow-hidden ring-1 ring-white/10">
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-[#ff7a00] animate-pulse"></span>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Transaction Log
            </span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter">
            Order <span className="text-[#ff7a00]">Registry</span>
          </h1>
          <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
            Monitor your global acquisition history and delivery statuses in
            real-time.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 relative z-10">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <div className="text-gray-500 text-[10px] font-black uppercase tracking-tighter text-white/60 mb-1">
              Total Orders
            </div>
            <div className="text-2xl font-mono text-white">{orders.length}</div>
          </div>
        </div>

        {/* Cyber Pattern */}
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#ff7a00] rounded-full blur-[120px]"></div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between px-2">
        <div className="relative w-full md:w-96 group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff7a00] transition-colors"
            size={18}
          />
          <Input
            placeholder="Search Order ID..."
            className="h-12 pl-12 bg-white border-2 border-gray-100 rounded-xl focus:border-[#ff7a00] transition-all"
          />
        </div>
        <Button
          variant="outline"
          className="h-12 rounded-xl border-2 border-gray-100 gap-2 font-bold px-6 text-gray-900 uppercase tracking-widest text-[10px]"
        >
          <Filter size={18} /> Filter Registry
        </Button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order: Order) => (
            <Card
              key={order._id || order.id}
              className="group overflow-hidden border-2 border-gray-100 rounded-[1.5rem] hover:border-[#ff7a00]/30 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row items-center justify-between p-6 gap-6 bg-white group-hover:bg-gray-50/50 transition-colors">
                {/* Left: Info */}
                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className="h-14 w-14 rounded-2xl bg-gray-900 flex items-center justify-center text-[#ff7a00] shrink-0">
                    <Package size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black font-mono text-gray-400">
                        {order.id || order.orderNumber || "ORD-REF"}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-black uppercase border-gray-200"
                      >
                        {order.deliveryType || "Standard"}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">
                      {order.productName || "Product Bundle"}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "Date Unavailable"}
                    </p>
                  </div>
                </div>

                {/* Middle: Status */}
                <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                      Total Impact
                    </div>
                    <div className="text-xl font-black text-gray-900">
                      ${order.amount || "0.00"}
                    </div>
                  </div>

                  <div className="flex flex-col items-end min-w-[120px]">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest 
                      ${
                        order.status === "Delivered" ||
                        order.status === "completed"
                          ? "bg-green-50 text-green-600 border border-green-100"
                          : order.status === "Processing" ||
                              order.status === "pending"
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : "bg-[#ff7a00]/10 text-[#ff7a00] border border-[#ff7a00]/20"
                      }`}
                    >
                      {order.status === "Delivered" ||
                      order.status === "completed" ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <Clock size={12} />
                      )}
                      {order.status || "Unknown"}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-[#ff7a00] hover:text-white transition-all text-gray-400"
                  >
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="p-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-white shadow-xl flex items-center justify-center text-gray-400">
              <ShoppingBag size={32} />
            </div>
            <div className="text-center">
              <h4 className="text-lg font-black text-gray-900">
                Registry Empty
              </h4>
              <p className="text-gray-500 text-sm font-medium">
                No transactions found in your history.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Visual Guard */}
      <div className="p-8 bg-gray-50 rounded-[2rem] border border-gray-200 border-dashed flex items-center justify-center">
        <p className="text-gray-400 text-sm font-medium flex items-center gap-2">
          <ShoppingBag size={16} /> All transactions are encrypted and verified.
        </p>
      </div>
    </div>
  );
};

export default OrderListPage;
