"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Mountain, Briefcase, Users, Star, Settings, Video, ClipboardList } from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Messages", href: "/admin", icon: Mail },
    { name: "Treks", href: "/admin/treks", icon: Mountain },
    { name: "Services", href: "/admin/services", icon: Briefcase },
    { name: "Team", href: "/admin/team", icon: Users },
    { name: "Interviews", href: "/admin/interviews", icon: ClipboardList },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "Videos", href: "/admin/videos", icon: Video },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div 
      className="
        fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 px-2 flex justify-around items-center
        sm:relative sm:z-auto sm:bg-transparent sm:border-none sm:shadow-none sm:p-0 sm:gap-2 sm:mb-8 sm:flex-wrap sm:justify-start
      "
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.name}
            className={`
              flex transition relative items-center justify-center
              
              flex-col p-2 rounded-xl flex-1
              ${isActive 
                ? "text-emerald-600" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }
              
              sm:flex-row sm:flex-none sm:gap-2 sm:px-4 sm:py-2 sm:text-sm sm:font-medium
              ${isActive 
                ? "sm:bg-white sm:shadow-sm sm:border sm:border-slate-200 sm:text-emerald-700 sm:hover:bg-white" 
                : "sm:text-slate-600 sm:bg-transparent sm:border sm:border-transparent sm:hover:border-slate-200 sm:hover:bg-white sm:hover:shadow-sm"
              }
            `}
          >
            <Icon 
              className={`
                w-[22px] h-[22px] 
                sm:w-4 sm:h-4 
                ${isActive ? "fill-emerald-100/50 sm:fill-transparent" : ""}
              `} 
            />
            <span className={`
              hidden sm:block
              ${isActive ? "font-bold sm:font-medium" : "font-medium"}
            `}>
              {item.name}
            </span>
            
            {/* Mobile Active Indicator Dot */}
            {isActive && (
              <span className="sm:hidden absolute bottom-0.5 w-1 h-1 rounded-full bg-emerald-600" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
