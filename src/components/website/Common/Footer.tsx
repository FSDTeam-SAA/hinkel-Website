import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-accent pt-16 pb-8 border-t border-gray-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Logo and Description */}
          <div className="md:col-span-4 lg:col-span-5">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Footer Logo"
                width={150}
                height={40}
                className="mb-8"
              />
            </Link>
            <p className="text-gray-500 text-lg leading-relaxed max-w-sm">
              Design amazing digital experiences that create more happy in the world.
            </p>
          </div>

          {/* Product Links */}
          <div className="md:col-span-2">
            <h3 className="text-gray-900 font-semibold mb-6">Product</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[#FF8B36] hover:text-[#e67a2e] transition-colors">Overview</Link></li>
              <li><Link href="#" className="text-[#FF8B36] hover:text-[#e67a2e] transition-colors">Features</Link></li>
              <li><Link href="#" className="text-[#FF8B36] hover:text-[#e67a2e] transition-colors">Solutions</Link></li>
              <li><Link href="#" className="text-[#FF8B36] hover:text-[#e67a2e] transition-colors">Tutorials</Link></li>
              <li><Link href="#" className="text-[#FF8B36] hover:text-[#e67a2e] transition-colors">Pricing</Link></li>
              <li><Link href="#" className="text-[#FF8B36] hover:text-[#e67a2e] transition-colors">Releases</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="md:col-span-2">
            <h3 className="text-gray-900 font-semibold mb-6">Resources</h3>
            <ul className="space-y-4">
              <li><Link href="#" className="text-[#FF8B36] hover:text-[#e67a2e] transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-[#FF8B36] hover:text-[#e67a2e] transition-colors">Newsletter</Link></li>
              <li><Link href="#" className="text-[#FF8B36] hover:text-[#e67a2e] transition-colors">Events</Link></li>
              <li><Link href="#" className="text-[#FF8B36] hover:text-[#e67a2e] transition-colors">Help centre</Link></li>
              <li><Link href="#" className="text-[#FF8B36] hover:text-[#e67a2e] transition-colors">Tutorials</Link></li>
              <li><Link href="#" className="text-[#FF8B36] hover:text-[#e67a2e] transition-colors">Support</Link></li>
            </ul>
          </div>

          {/* Subscribe Section */}
          <div className="md:col-span-4 lg:col-span-3">
            <h3 className="text-gray-900 font-semibold mb-6">Stay up to date</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white border-gray-300 focus:border-[#FF8B36] focus:ring-[#FF8B36] h-11"
              />
              <Button className="bg-[#FF8B36] hover:bg-[#e67a2e] text-white px-6 h-11 font-semibold transition-all duration-300">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2077 Untitled UI. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Terms</Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Privacy</Link>
            <Link href="#" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

