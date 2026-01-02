"use client";

import * as z from "zod";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// Zod schema using union of literals
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),
  message: z.string().min(1, "Message is required"),
});

export default function GetInTouch() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      console.log(values);
      toast.success("Your message has been sent successfully!");
      form.reset();
    } catch {
      toast.error("Failed to send message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gray-50 py-10">
      <div className="container mx-auto bg-white rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-2">
        {/* Left side: Image with gradient overlay */}
        <div className="relative h-64 md:h-auto rounded-l-2xl overflow-hidden">
          <Image
            src="/image/GetInTouch.png"
            alt="Contact Image"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20 rounded-l-2xl" />
        </div>

        {/* Right side: Form */}
        <div className="p-10">
          <h2
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Contact Us <span className="text-[#E0A523]">Builders AZ LLC</span>
          </h2>
          <p className="text-[#000000BA] mb-6   md:text-4xl">
            Get in touch with us
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your Name"
                        {...field}
                        className="py-3 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="hello@example.com"
                          {...field}
                          className="py-3 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1234567890"
                          {...field}
                          className="py-3 rounded-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Message */}
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your message here..."
                        {...field}
                        className="h-[150px] rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E0A523] hover:bg-[#c68c1a] text-white rounded-md py-3 font-semibold cursor-pointer"
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
