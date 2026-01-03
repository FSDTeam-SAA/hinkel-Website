"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { status } = useSession();

  // Detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/services", label: "Services" },
    { href: "/about-us", label: "About" },
    { href: "/contact-us", label: "Contact Us" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 backdrop-blur-md ${scrolled
        ? "bg-primary/80 backdrop-opacity-90 shadow-md"
        : "bg-transparent backdrop-grayscale"
        }`}
    >
      <div className="container mx-auto px-8 flex justify-between items-center py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="logo"
              width={120}
              height={120}
              className="cursor-pointer"
            />
          </Link>
        </div>

        {/* Desktop Menu Items */}
        <div
          className={`hidden md:flex space-x-8 font-medium transition-colors duration-300 ${scrolled ? "text-white" : "text-primary"
            }`}
        >
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-all duration-200 hover:text-[#FF8B36] ${item.label === "Home" ? "text-[#FF8B36] font-semibold" : scrolled ? "text-white" : "text-primary"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          {status === "unauthenticated" ? (
            <>
              <Link href="/register">
                <Button
                  className="cursor-pointer bg-[#FF8B36] text-white hover:bg-[#e67a2e] px-8 rounded-lg font-semibold transition-all duration-300"
                >
                  Sign Up
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-[#FF8B36] text-[#FF8B36] hover:cursor-pointer bg-[#FF8B36]/10 px-8 rounded-lg font-semibold transition-all duration-300"
                >
                  Log In
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/contact-us">
              <Button
                className="cursor-pointer bg-[#FF8B36] text-white hover:bg-[#e67a2e] px-8 rounded-lg font-semibold transition-all duration-300"
              >
                Contact Us
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                className="text-gray-500 bg-white hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {open ? <X size={28} /> : <Menu size={28} />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-6 mt-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="text-gray-700 px-5 hover:text-[#FF8B36] font-medium text-lg transition-all duration-200 py-2"
                  >
                    {item.label}
                  </Link>
                ))}
                {status === "unauthenticated" && (
                  <div className="flex flex-col space-y-4 px-5 pt-4 border-t">
                    <Link href="/login" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full cursor-pointer border-[#FF8B36] text-[#FF8B36]">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setOpen(false)}>
                      <Button className="w-full cursor-pointer bg-[#FF8B36] text-white">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

