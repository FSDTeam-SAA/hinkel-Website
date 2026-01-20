"use client";
import { useAllBooks } from '@/features/dashboard/hooks/useAllbooks';
import Image from 'next/image';
import React from 'react';

const OrderedBooks = () => {
    const { data, isLoading, isError } = useAllBooks();

    if (isLoading) return <div>Loading books...</div>;
    if (isError) return <div>Error fetching books.</div>;

    // Check if data exists and get the order details
    // Note: If your API returns an array, map through data directly. 
    // If it returns a single object like the screenshot:
    const bookData = data?.order;
    console.log("bookdata",bookData)

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Ordered Books</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {bookData ? (
                    <div className="border rounded-lg p-4 shadow-sm">
                        <div className="relative w-full h-48 mb-2">
                            <Image
                                src={bookData.book}
                                alt={bookData.title}
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>
                        <h3 className="font-semibold text-lg">{bookData.title}</h3>
                        <p className="text-sm text-gray-500">Status: {bookData.status}</p>
                        <p className="text-sm text-gray-500">Pages: {bookData.pageCount}</p>
                    </div>
                ) : (
                    <p>No books found.</p>
                )}
            </div>
        </div>
    );
};

export default OrderedBooks;