"use client";

import Link from "next/link";
import { Mountain, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const SocialIcon = ({ d, label }: { d: string; label: string }) => (
  <a 
    href="#" 
    aria-label={label}
    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-600 transition-all group"
  >
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="w-5 h-5 text-white"
    >
      <path d={d} />
    </svg>
  </a>
);

const Footer = () => {
  const socialIcons = [
    { label: "Facebook", d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
    { label: "Instagram", d: "Rect 2 2 20 20 5, Path 16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z, M17.5 6.5h.01" }, // Simplified
    { label: "Twitter", d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" }
  ];

  // Using simple paths for Instagram since complex ones are hard to embed as single path
  const instagramPath = "M17 2H7C4.24 2 2 4.24 2 7V17C2 19.76 4.24 22 7 22H17C19.76 22 22 19.76 22 17V7C22 4.24 19.76 2 17 2ZM12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18ZM17 7.5C16.45 7.5 16 7.05 16 6.5C16 5.95 16.45 5.5 17 5.5C17.55 5.5 18 5.95 18 6.5C18 7.05 17.55 7.5 17 7.5Z";

  return (
    <footer id="contact" className="bg-slate-950 text-white pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-emerald-600 p-2 rounded-lg group-hover:bg-emerald-700 transition-colors">
                <Mountain className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                TOUCH <span className="text-emerald-500">PARADISE</span>
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm">
              Your gateway to the majestic Himalayas. Professional trekking 
              and expedition services with a focus on safety and sustainability.
            </p>
            <div className="flex gap-4">
              <SocialIcon label="Facebook" d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              <SocialIcon label="Instagram" d={instagramPath} />
              <SocialIcon label="Twitter" d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-lg font-bold">Quick Links</h4>
            <ul className="space-y-4">
              {["Treks", "Tours", "About Us", "Our Guides", "Contact"].map((link) => (
                <li key={link}>
                  <Link href={`#${link.toLowerCase().replace(" ", "")}`} className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Locations */}
          <div className="space-y-8">
            <h4 className="text-lg font-bold">Popular Treks</h4>
            <ul className="space-y-4">
              {["Everest Base Camp", "Annapurna Circuit", "Mardi Himal", "Gosaikunda Lake", "Langtang Valley"].map((trek) => (
                <li key={trek}>
                  <Link href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                    {trek}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h4 className="text-lg font-bold">Contact Us</h4>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <MapPin className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-slate-400 text-sm leading-relaxed">
                  Balaju, Kathmandu, Nepal <br /> P.O. Box: 44600
                </span>
              </li>
              <li className="flex gap-4">
                <Phone className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-slate-400 text-sm">
                  +977 9841259682
                </span>
              </li>
              <li className="flex gap-4">
                <Mail className="w-6 h-6 text-emerald-500 flex-shrink-0" />
                <span className="text-slate-400 text-sm">
                  info@touchparadise.com.np
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Touch Paradise Trekking & Expeditions Pvt. Ltd.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-slate-500 hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-slate-500 hover:text-white text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
