import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative px-6 py-12 md:py-16 lg:px-12 bg-accent">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-secondary-foreground leading-tight">
            Turn Any Artwork Into Coloring Magic
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-lg leading-relaxed">
            Turn any photo or drawing into a clean coloring page with powerful AI technology, designed to capture every
            detail you love and transform it into creative outlines, ready for coloring, sharing, or printing instantly.
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white  px-8 h-12 text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          >
            Create Your Coloring Book
          </Button>

          <div className="flex flex-wrap gap-8 pt-2">
            <div className="flex gap-3 items-center">
              <span className="text-4xl font-bold text-gray-900">2M+</span>
              <span className="text-xs font-bold text-gray-500 leading-tight">
                Total 
                <br />
                Users
              </span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="text-4xl font-bold text-gray-900">1M+</span>
              <span className="text-xs font-bold text-gray-500 leading-tight">
                Total
                <br />
                Book Created
              </span>
            </div>
          </div>
        </div>

        <div className="relative max-h-full">
          <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white aspect-square">
            <Image
              src="/images/heroImage.png"
              alt="Sketch transformation"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-[radial-gradient(#FF7A3D_1px,transparent_1px)] [background-size:16px_16px] opacity-20 -z-10" />
        </div>
      </div>
    </section>
  )
}