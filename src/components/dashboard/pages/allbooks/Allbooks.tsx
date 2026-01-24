import Link from "next/link";
import { CategoryShow } from "./CategoryShow";
import OrderedBooks from "./OrderedBooks";
import { Button } from "@/components/ui/button";
import { InfoIcon } from "lucide-react";

const Allbooks = () => {
  return (
    <div>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-gray-100 pb-6">
          {/* Left Side: Header */}
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#FF8B36]">
              All Books
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Manage and configure your sketch book collection.
            </p>
          </div>

          {/* Right Side: Action + Info */}
          <div className="flex items-center gap-3">
            <Link href="/create-book" className="relative">
              <Button
                variant="outline"
                className="h-auto px-8 py-3 text-base font-bold text-primary border-2 border-primary rounded-xl 
                   hover:bg-primary hover:text-white transition-all duration-300 shadow-sm hover:shadow-primary/20"
              >
                Add New Book
              </Button>
            </Link>

            {/* Improved Tooltip Design */}
            <div className="group relative flex items-center">
              {/* The Info Trigger */}
              <div className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 cursor-help border border-transparent hover:border-gray-200">
                <InfoIcon size={18} className="text-gray-400 group-hover:text-[#FF8B36] transition-colors" />
              </div>

              {/* Tooltip: Appearing from the Left */}
              <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-64 p-4 bg-gray-900/95 backdrop-blur-md text-white rounded-2xl 
                opacity-0 invisible group-hover:opacity-100 group-hover:visible 
                transition-all duration-300 z-50 shadow-2xl border border-white/10 
                pointer-events-none translate-x-3 group-hover:translate-x-0">

                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em] mb-1">System Info</span>
                  <p className="text-[10px] leading-relaxed font-bold uppercase tracking-wider">
                    {/* Adjust the <span className="text-[#FF8B36] italic tracking-widest">&quot;Configurator&quot;</span> in the header to change page count impact. */}
                    This Button will take you to the add new book page. Where you can create books as an Admin.
                  </p>
                </div>

                {/* Tooltip Arrow: Pointing Right */}
                <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-8 border-transparent border-l-gray-900/95" />
              </div>
            </div>
          </div>
        </div>
        <OrderedBooks />
      </div>
    </div>
  );
};

export default Allbooks;
