"use client";
import { useAllOrders } from '@/features/dashboard/hooks/useAllOrders';
import Image from 'next/image';
import React from 'react';
import { Loader2, Package, User } from 'lucide-react';

const OrderedBooks = () => {
    const { orders, loading, error } = useAllOrders();

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <p className="text-gray-500 font-medium">Loading ordered books...</p>
        </div>
    );

    if (error) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-red-500 font-medium">Error fetching ordered books. Please try again later.</p>
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Ordered Books</h2>
                    <p className="text-gray-500 mt-1">Manage and track all book orders</p>
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-full">
                    <span className="text-orange-600 font-bold">{orders.length} Total Orders</span>
                </div>
            </div>

            {orders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <div key={order._id} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
                            {/* Book Image Section */}
                            <div className="relative w-full h-56 bg-gray-50 overflow-hidden">
                                {order.book ? (
                                    <Image
                                        src={order.book}
                                        alt={order.title || "Book Cover"}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                                        <Package size={48} strokeWidth={1.5} />
                                        <span className="text-xs font-medium">No Image Available</span>
                                    </div>
                                )}

                                {/* Status Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${order.status === 'paid' ? 'bg-green-500 text-white' :
                                            order.status === 'pending' ? 'bg-amber-500 text-white' :
                                                'bg-gray-500 text-white'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 flex flex-col flex-grow">
                                <div className="mb-4">
                                    <h3 className="font-bold text-xl text-gray-900 line-clamp-1 mb-1" title={order.title || `Order #${order._id.slice(-6).toUpperCase()}`}>
                                        {order.title || `Order #${order._id.slice(-6).toUpperCase()}`}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                        <span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded italic">
                                            {order.deliveryType}
                                        </span>
                                        <span>•</span>
                                        <span>{order.pageCount} Pages</span>
                                    </div>
                                </div>

                                <div className="space-y-3 mt-auto">
                                    {/* User Info */}
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <div className="h-8 w-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-400">
                                            <User size={16} />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">
                                                {order.userId?.name || 'Guest User'}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {order.userId?.email || 'No email provided'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Footer Details */}
                                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase font-bold text-gray-400">Total Price</span>
                                            <span className="text-lg font-black text-orange-600">
                                                ${(order.totalAmount / 100).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] uppercase font-bold text-gray-400 block">Ordered On</span>
                                            <span className="text-xs font-medium text-gray-600">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50">
                    <Package size={64} className="text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">No books found</h3>
                    <p className="text-gray-500">There are no ordered books to display at this time.</p>
                </div>
            )}
        </div>
    );
};

export default OrderedBooks;