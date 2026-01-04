"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const CATEGORIES = [
  { id: "kids", name: "Kids", image: "/images/kids-playing.png", isSplit: true },
  { id: "pets", name: "Pets", image: "/images/golden-retriever.png", isSplit: true },
  { id: "seniors", name: "Seniors", image: "/images/thoughtful-senior-woman.png", isSplit: true },
  { id: "adults", name: "Adults", image: "/images/heroImage.png", isSplit: true },
  { id: "family", name: "Family", image: "/images/kids-playing.png", isSplit: true },
  { id: "travel", name: "Travel", image: "/images/thoughtful-senior-woman.png", isSplit: true },
]

export function CategoryGrid() {
  const [isHovered, setIsHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showArrows, setShowArrows] = useState(false)

  // Check if we need arrows/carousel behavior
  useEffect(() => {
    const checkScroll = () => {
      if (containerRef.current) {
        setShowArrows(containerRef.current.scrollWidth > containerRef.current.clientWidth)
      }
    }
    checkScroll()
    window.addEventListener("resize", checkScroll)
    return () => window.removeEventListener("resize", checkScroll)
  }, [])

  const scroll = useCallback((direction: "left" | "right") => {
    if (!containerRef.current) return
    const container = containerRef.current
    const scrollAmount = container.clientWidth * 0.8
    const targetScroll =
      direction === "left" ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    })
  }, [])

  useEffect(() => {
    if (!showArrows || isHovered) return

    const interval = setInterval(() => {
      if (!containerRef.current) return
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current

      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        containerRef.current.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        scroll("right")
      }
    }, 3500)

    return () => clearInterval(interval)
  }, [showArrows, isHovered, scroll])

  return (
    <section
      className="py-24 px-6 bg-secondary"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto relative">
        <h2 className="text-5xl font-bold text-center mb-20 text-gray-900">Category</h2>

        {showArrows && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-[55%] -translate-y-1/2 -translate-x-2 lg:-translate-x-6 z-20 bg-white shadow-xl rounded-full p-3 text-gray-800 hover:text-primary hover:scale-110 transition-all active:scale-95"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-[55%] -translate-y-1/2 translate-x-2 lg:translate-x-6 z-20 bg-white shadow-xl rounded-full p-3 text-gray-800 hover:text-primary hover:scale-110 transition-all active:scale-95"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <div
          ref={containerRef}
          className="flex gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 -mx-4 px-4 scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}`}
              className="group relative rounded-[2rem] overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[calc(25%-1.5rem)] snap-start border-4 border-transparent hover:border-primary/20"
            >
              <div className="aspect-[4/5] relative bg-gray-50">
                {category.isSplit ? (
                  <div className="grid grid-cols-2 h-full">
                    <div className="relative h-full overflow-hidden border-r border-white">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={`${category.name} Sketch`}
                        fill
                        className="object-cover grayscale contrast-125"
                      />
                    </div>
                    <div className="relative h-full overflow-hidden">
                      <Image
                        src={category.image || "/placeholder.svg"}
                        alt={`${category.name} Original`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                {/* Decorative overlay for better "book" feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
              </div>
              <div className="bg-primary py-5 text-center transition-colors duration-300 group-hover:bg-[#e66a33]">
                <span className="text-white font-extrabold text-2xl tracking-tight uppercase">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
