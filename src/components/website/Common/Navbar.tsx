"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  // { href: "/services", label: "Services" },
  { href: "/about-us", label: "About" },
  { href: "/contact-us", label: "Contact Us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { status } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleMobileMenuClick = () => {
    setOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300 backdrop-blur-md bg-blue-100 border-b border-gray-100">
      <div className="container mx-auto px-4 sm:px-8 flex justify-between items-center py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Company Logo"
            width={120}
            height={120}
            className="cursor-pointer"
            priority
          />
        </Link>

        {/* Desktop Menu Items */}
        <ul className="hidden md:flex space-x-8 font-medium">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "transition-all duration-200 hover:text-primary relative pb-1",
                  isActive(item.href)
                    ? "text-primary font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary"
                    : "text-primary-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {status === "unauthenticated" ? (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-primary text-primary-foreground hover:bg-primary/10 px-8 rounded-lg font-semibold transition-all duration-300"
                >
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-primary text-white hover:bg-primary/90 px-8 rounded-lg font-semibold transition-all duration-300">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <Link href="/contact-us">
              <Button className="bg-primary text-white hover:bg-primary/90 px-8 rounded-lg font-semibold transition-all duration-300">
                Contact Us
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-500 hover:text-primary"
                aria-label="Toggle menu"
              >
                {open ? <X size={28} /> : <Menu size={28} />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-2 mt-8">
                {menuItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleMobileMenuClick}
                    className={cn(
                      "px-5 py-3 rounded-lg font-medium text-lg transition-all duration-200",
                      isActive(item.href)
                        ? "text-primary bg-primary/10 font-semibold"
                        : "text-gray-700 hover:text-primary hover:bg-gray-50",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                {status === "unauthenticated" && (
                  <div className="flex flex-col space-y-3 px-5 pt-6 mt-4 border-t">
                    <Link href="/login" onClick={handleMobileMenuClick}>
                      <Button
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary/10"
                      >
                        Log In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={handleMobileMenuClick}>
                      <Button className="w-full bg-primary text-white hover:bg-primary/90">
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
