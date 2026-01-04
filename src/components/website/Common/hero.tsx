import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Sparkles } from "lucide-react"

export function Hero() {
  return (
    <section className="relative px-6 py-16 md:py-24 lg:px-12 bg-accent">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          {/* <Badge
            variant="outline"
            className="px-3 py-1.5 text-xs font-semibold bg-white border-gray-100 text-gray-500 rounded-lg flex items-center gap-2 w-fit shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI-Powered Creation
          </Badge> */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 leading-[1.05]">
            Turn Any Artwork Into Coloring Magic
          </h1>
          <p className="text-lg text-gray-600 max-w-lg leading-relaxed font-medium">
            Turn any photo or drawing into a clean coloring page with powerful AI technology, designed to capture every
            detail you love and transform it into creative outlines, ready for coloring, sharing, or printing instantly.
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-10 h-14 text-lg font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
          >
            Create Your Coloring Book
          </Button>

          <div className="flex flex-wrap gap-12 pt-4">
            <div className="flex gap-4 items-center">
              <span className="text-5xl font-bold text-gray-900">2943</span>
              <span className="text-sm font-bold text-gray-500 leading-tight">
                Cards
                <br />
                Delivered
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-5xl font-bold text-gray-900">$1M+</span>
              <span className="text-sm font-bold text-gray-500 leading-tight">
                Transaction
                <br />
                Completed
              </span>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white aspect-[5/6] md:aspect-[5/6]">
            <div className="h-full">
              <div className="relative h-full overflow-hidden border-r-2 border-white/20">
                <Image
                  src="/images/heroImage.png"
                  alt="Sketch transformation"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            
            </div>

          </div>
          {/* Decorative floating dots/grid pattern around image */}
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-[radial-gradient(#FF7A3D_1px,transparent_1px)] [background-size:16px_16px] opacity-20 -z-10" />
        </div>
      </div>
    </section>
  )
}
