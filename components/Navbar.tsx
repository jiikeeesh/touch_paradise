"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Treks", href: "/treks" },
  { name: "Services", href: "/services" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // On inner pages, always show the solid navbar
  const isHome = pathname === "/";
  const solidNav = !isHome || scrolled;

  useEffect(() => {
    if (!isHome) return;
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        solidNav
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3 border-b border-slate-100"
          : "bg-white/10 backdrop-blur-sm py-5 border-b border-white/10"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center group relative z-[60]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/touch-paradise.svg"
              alt="Touch Paradise"
              // Removed brightness-0 invert so the logo's real colors are always visible.
              className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative group ${
                    isActive
                      ? "text-emerald-500"
                      : solidNav
                      ? "text-slate-700 hover:text-emerald-600"
                      : "text-white hover:text-emerald-400"
                  }`}
                >
                  {link.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-emerald-500 transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
            <Link
              href="/contact"
              className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-600/30 hover:-translate-y-0.5"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </Link>
          </div>

          {/* Mobile Menu Button - Better Hamburger */}
          <div className="md:hidden relative z-[60]">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex flex-col justify-center items-center w-10 h-10 rounded-full focus:outline-none transition-colors ${
                isOpen ? "bg-slate-100" : solidNav ? "text-slate-900 hover:bg-slate-50" : "text-white hover:bg-white/10"
              }`}
            >
              <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isOpen ? "rotate-45 translate-y-1.5" : "-translate-y-1"}`}></span>
              <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm my-0.5 ${isOpen ? "opacity-0" : "opacity-100"}`}></span>
              <span className={`bg-current block transition-all duration-300 ease-out h-0.5 w-5 rounded-sm ${isOpen ? "-rotate-45 -translate-y-1.5" : "translate-y-1"}`}></span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="absolute top-20 left-4 right-4 bg-white rounded-3xl shadow-2xl overflow-hidden z-50 md:hidden border border-slate-100"
            >
              <div className="p-4 flex flex-col gap-2">
                {navLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      key={link.name}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`block px-5 py-4 text-base font-bold rounded-2xl transition-all ${
                          isActive
                            ? "text-emerald-600 bg-emerald-50/50"
                            : "text-slate-600 hover:text-emerald-600 hover:bg-slate-50"
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="pt-2 mt-2 border-t border-slate-100"
                >
                  <Link
                    href="tel:+9779841259682"
                    className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-4 rounded-2xl text-base font-bold w-full shadow-lg shadow-emerald-600/20 active:scale-95 transition-transform"
                  >
                    <Phone className="w-5 h-5" />
                    Call Us Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
