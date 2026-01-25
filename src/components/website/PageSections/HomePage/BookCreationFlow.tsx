import React from "react";
import { Book, CreditCard, Image, Wand2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <section className="py-20 bg-linear-to-b from-white to-gray-50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            From Photo to{" "}
            <span className="text-primary italic">Masterpiece</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Create your personalized coloring book in 5 simple, creative steps.
            We&apos;ve made the process as intuitive and fun as coloring itself!
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-linear-to-b from-blue-200 via-purple-200 to-green-200 rounded-full opacity-30" />

          <div className="space-y-12 lg:space-y-0 relative z-10">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex flex-col lg:flex-row items-center gap-8 lg:gap-16 group",
                  index % 2 === 0 ? "lg:flex-row-reverse" : "",
                )}
              >
                {/* Content Side */}
                <div className="flex-1 w-full lg:w-1/2">
                  <div
                    className={cn(
                      "bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden group-hover:-translate-y-1",
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
                        Step 0{step.id}
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
                <div className="relative shrink-0 z-10">
                  <div
                    className={cn(
                      "w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-all duration-500 transform group-hover:scale-110",
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
                </div>

                {/* Empty Side for alignment */}
                <div className="flex-1 w-full lg:w-1/2 hidden lg:block" />
              </div>
            ))}
          </div>

          {/* Final Call to Action Element */}
          <div className="mt-16 text-center">
            <div className="inline-flex flex-col items-center animate-bounce-slow">
              <div className="h-16 w-1 bg-linear-to-b from-green-200 to-transparent mb-4 rounded-full opacity-50" />
              <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
                Ready to start?
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookCreationFlow;
