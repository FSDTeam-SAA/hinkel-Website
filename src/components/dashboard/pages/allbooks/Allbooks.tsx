import { Button } from '@/components/ui/button'
import { CategoryGrid } from '@/features/category-page/components/category-grid'
import React from 'react'
import { CategoryShow } from './CategoryShow'

const Allbooks = () => {
    return (
        <div>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#FF8B36] mb-1">Add New Category Page</h1>
                        <p className="text-gray-500 font-medium">
                            Manage your orders, track shipments, and configure products easily.
                        </p>
                    </div>

                    <div className="relative w-full max-w-[320px]">
                        <Button
                            className="text-lg font-bold text-primary bg-transparent border border-primary 
             px-8 py-4 rounded-lg hover:bg-primary hover:text-white"
                        >
                            Add New Book
                        </Button>

                    </div>
                </div>
                
            <CategoryShow />
            </div>
        </div>
    )
}

export default Allbooks