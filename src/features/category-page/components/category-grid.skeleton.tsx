import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryGridSkeleton() {
  return (
    <section className="py-24 px-6 bg-secondary">
      <div className="container mx-auto relative">
        <h2 className="text-5xl font-bold text-center mb-20 text-gray-900">
          Category
        </h2>

        <div className="flex gap-6 lg:gap-8 overflow-hidden pb-12 -mx-4 px-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="relative rounded-[2rem] overflow-hidden bg-white shadow-lg flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[calc(25%-1.5rem)] border-4 border-transparent"
            >
              <div className="aspect-[4/5] relative bg-gray-50">
                <Skeleton className="w-full h-full bg-gray-200/50" />
              </div>
              <div className="bg-primary py-5 flex justify-center">
                 <Skeleton className="h-8 w-24 bg-white/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
