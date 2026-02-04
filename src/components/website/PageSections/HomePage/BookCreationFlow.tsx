"use client";

import React, { useRef } from "react";
import { Book, CreditCard, Image, Wand2, CheckCircle } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const steps = [
  {
    id: 1,
    title: "Choose Your Format",
    description:
      "Start by selecting how you want to receive your finished masterpiece. You can choose a Professional Printed Coloring Book, a Digital PDF, or a Bundle containing both.",
    icon: Book,
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    title: "Secure Your Order",
    description:
      "Complete the checkout process to unlock the creation studio. Once payment is confirmed, you’ll have full access to our image-to-sketch conversion tools to begin building your book.",
    icon: CreditCard,
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: 3,
    title: "Convert Your Images",
    description:
      "Build your book one page at a time by uploading your favorite photos. For every upload, you get up to three conversion attempts to get the perfect sketch. Simply select the version you like best to lock it in as a page.",
    icon: Image,
    color: "bg-pink-100 text-pink-600",
  },
  {
    id: 4,
    title: "Build & Refine",
    description:
      "Use your 3 image conversions (per page) to refine your book. You can track your progress as you go, ensuring every page meets your vision before moving to the final stage.",
    icon: Wand2,
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: 5,
    title: "Final Review & Publish",
    description:
      "Once all pages are set, enter the Review Gallery. Here, you can flip through your entire book one last time. If everything looks perfect, hit Finalize to send your book to print or generate your digital download!",
    icon: CheckCircle,
    color: "bg-green-100 text-green-600",
  },
];

const BookCreationFlow = () => {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section className="py-20 overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            From Photo to{" "}
            <span className="text-primary italic">Masterpiece</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Create your personalized coloring book in 5 simple, creative steps.
            We&apos;ve made the process as intuitive and fun as coloring itself!
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gray-200 rounded-full" />

          <motion.div
            className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-blue-400 via-purple-400 to-green-400 rounded-full origin-top"
            style={{ scaleY }}
          />

          <div className="space-y-12 lg:space-y-0 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  "flex flex-col lg:flex-row items-center gap-8 lg:gap-16 group",
                  index % 2 === 0 ? "lg:flex-row-reverse" : "",
                )}
              >
                {/* Content Side */}
                <div className="flex-1 w-full lg:w-1/2 ">
                  <div
                    className={cn(
                      "bg-blue-100 p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1",
                      index % 2 === 0 ? "lg:text-left" : "lg:text-right",
                    )}
                  >
                    {/* Decorative Background Blob */}
                    <div
                      className={cn(
                        "absolute top-0 w-32 h-32 rounded-full opacity-10 -z-10 blur-2xl transition-all duration-500 group-hover:scale-150",
                        step.color.split(" ")[0],
                      )}
                      style={{
                        [index % 2 === 0 ? "right" : "left"]: "-20px",
                        top: "-20px",
                      }}
                    />

                    <div
                      className={cn(
                        "flex items-center gap-4 mb-4",
                        index % 2 === 0
                          ? "lg:flex-row"
                          : "lg:flex-row-reverse justify-end",
                      )}
                    >
                      <span className="text-sm font-bold tracking-wider text-gray-400 uppercase">
                        Step {step.id}
                      </span>
                      <div
                        className={cn(
                          "h-px w-12 bg-gray-200 transition-all duration-300 group-hover:w-20 group-hover:bg-primary/50",
                        )}
                      />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Icon/Timeline Node */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                    delay: 0.2,
                  }}
                  className="relative shrink-0 z-10"
                >
                  <div
                    className={cn(
                      "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-all duration-500",
                      step.color,
                    )}
                  >
                    <step.icon size={32} className="stroke-[1.5]" />
                  </div>
                  {/* Pulse Effect */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 animate-ping",
                      step.color.split(" ")[0].replace("bg-", "bg-"),
                    )}
                  />
                </motion.div>

                {/* Empty Side for alignment */}
                <div className="flex-1 w-full lg:w-1/2 hidden lg:block" />
              </motion.div>
            ))}
          </div>

          {/* Final Call to Action Element */}
          <div className="mt-16 pt-20 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="inline-flex flex-col items-center animate-bounce-slow"
            >
              <div className="hidden lg:block h-16 w-1 bg-linear-to-b from-green-200 to-transparent mb-4 rounded-full opacity-50 " />
              <Button
                size="lg"
                className="rounded-full px-8 z-50 py-6 text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all text-white duration-300 hover:scale-105"
                onClick={() => router.push("/create-book")}
              >
                Ready to Start?
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookCreationFlow;
