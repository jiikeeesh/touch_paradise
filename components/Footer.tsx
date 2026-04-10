"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const SocialIcon = ({ d, label, href = "#", fill = false }: { d: string; label: string; href?: string; fill?: boolean }) => (
  <a 
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-600 transition-all group"
  >
    <svg 
      viewBox="0 0 24 24" 
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
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
  // Using simple paths for Instagram since complex ones are hard to embed as single path
  const instagramPath = "M17 2H7C4.24 2 2 4.24 2 7V17C2 19.76 4.24 22 7 22H17C19.76 22 22 19.76 22 17V7C22 4.24 19.76 2 17 2ZM12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18ZM17 7.5C16.45 7.5 16 7.05 16 6.5C16 5.95 16.45 5.5 17 5.5C17.55 5.5 18 5.95 18 6.5C18 7.05 17.55 7.5 17 7.5Z";

  return (
    <footer id="contact" className="bg-slate-950 text-white pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
              <span className="font-bold text-2xl tracking-tight text-white">
                TOUCH <span className="text-emerald-500">PARADISE</span>
              </span>
            <p className="text-slate-400 leading-relaxed text-sm">
              Your gateway to the majestic Himalayas. Professional trekking 
              and expedition services with a focus on safety and sustainability.
            </p>
            <div className="flex gap-4">
              <SocialIcon label="Facebook" d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              <SocialIcon label="Instagram" d={instagramPath} />
              <SocialIcon
                label="WhatsApp"
                href="https://wa.me/9779841259682"
                fill
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M12 0C5.373 0 0 5.373 0 12c0 2.136.566 4.14 1.541 5.872L0 24l6.293-1.512A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-4.992-1.364l-.358-.214-3.712.893.927-3.617-.234-.372A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"
              />
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
              <li className="flex flex-col gap-3">
                <div className="flex gap-3 items-center">
                  <Phone className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <span className="text-slate-400 text-sm">+977 9841259682</span>
                </div>
                <div className="flex gap-3 pl-8">
                  {/* WhatsApp button */}
                  <a
                    href="https://wa.me/9779841259682"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs font-semibold transition-all shadow-lg shadow-[#25D366]/20 hover:shadow-[#25D366]/40 hover:scale-105 active:scale-95"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M12 0C5.373 0 0 5.373 0 12c0 2.136.566 4.14 1.541 5.872L0 24l6.293-1.512A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 0 1-4.992-1.364l-.358-.214-3.712.893.927-3.617-.234-.372A9.818 9.818 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
                    </svg>
                    WhatsApp
                  </a>
                  {/* Call Now button */}
                  <a
                    href="tel:+9779841259682"
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/50 hover:bg-emerald-600 hover:border-emerald-600 text-emerald-400 hover:text-white text-xs font-semibold transition-all hover:scale-105 active:scale-95"
                  >
                    <Phone className="w-4 h-4" />
                    Call Now
                  </a>
                </div>
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
            © 2009 Touch Paradise Trekking & Expeditions Pvt. Ltd.
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
