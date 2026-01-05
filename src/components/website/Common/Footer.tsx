"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { memo, useState } from "react";

// Extract link data to reduce repetition and improve maintainability
const FOOTER_LINKS = {
  product: [
    { label: "Kids", href: "/kids" },
    { label: "Seniors", href: "/seniors" },
    { label: "Adults", href: "/adults" },
    { label: "Pets", href: "/pets" },
  ],
  resources: [
    { label: "Contact", href: "/contact" },
    { label: "About", href: "/about" },
  ],
  legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Cookies", href: "/cookies" },
  ],
} as const;

// Extracted sub-components for better code splitting and reusability
const FooterLinkSection = memo(
  ({
    title,
    links,
  }: {
    title: string;
    links: readonly { label: string; href: string }[];
  }) => (
    <div className="md:col-span-2">
      <h3 className="text-primary-foreground font-semibold mb-6">{title}</h3>
      <nav aria-label={`${title} links`}>
        <ul className="space-y-4">
          {links.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="text-primary-foreground hover:text-primary hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  ),
);

FooterLinkSection.displayName = "FooterLinkSection";

const NewsletterSection = memo(() => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email && email.includes("@")) {
      console.log("Subscribe:", email);
      // Add your subscription logic here
      setEmail("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubscribe();
    }
  };

  return (
    <div className="md:col-span-4 lg:col-span-3">
      <h3 className="text-gray-900 font-semibold mb-6">Stay up to date</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <label htmlFor="footer-email" className="sr-only">
          Email address
        </label>
        <Input
          id="footer-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your email"
          className="bg-white border-gray-300 focus:border-primary focus:ring-primary h-11"
          aria-label="Email address for newsletter"
        />
        <Button
          onClick={handleSubscribe}
          className="bg-primary hover:bg-[#e67a2e] text-white px-6 h-11 font-semibold transition-all duration-300 focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          Subscribe
        </Button>
      </div>
    </div>
  );
});

NewsletterSection.displayName = "NewsletterSection";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-accent pt-16 pb-8 border-t border-gray-100"
      role="contentinfo"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Logo and Description */}
          <div className="md:col-span-4 lg:col-span-5">
            <Link
              href="/"
              className="inline-block focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
            >
              <Image
                src="/images/logo.png"
                alt="Company Logo"
                width={150}
                height={40}
                className="mb-8"
                priority={false}
                loading="lazy"
              />
            </Link>
            <p className="text-gray-500 text-lg leading-relaxed max-w-sm">
              Design amazing digital experiences that create more happy in the
              world.
            </p>
          </div>

          {/* Product Links */}
          <FooterLinkSection title="Product" links={FOOTER_LINKS.product} />

          {/* Resources Links */}
          <FooterLinkSection
            title="Quick Links"
            links={FOOTER_LINKS.resources}
          />

          {/* Subscribe Section */}
          <NewsletterSection />
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} Untitled UI. All rights reserved.
          </p>
          <nav aria-label="Legal links">
            <ul className="flex gap-8">
              {FOOTER_LINKS.legal.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-gray-400 hover:text-gray-600 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);
