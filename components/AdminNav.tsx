"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Mountain, Briefcase, Users, Star, Settings, Video } from "lucide-react";

export default function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Messages", href: "/admin", icon: Mail },
    { name: "Treks", href: "/admin/treks", icon: Mountain },
    { name: "Services", href: "/admin/services", icon: Briefcase },
    { name: "Team", href: "/admin/team", icon: Users },
    { name: "Interviews", href: "/admin/interviews", icon: Users },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "Videos", href: "/admin/videos", icon: Video },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex gap-2 mb-8 flex-wrap">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        if (isActive) {
          return (
            <span
              key={item.href}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white shadow-sm border border-slate-200 text-emerald-700"
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </span>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition"
          >
            <Icon className="w-4 h-4" />
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}
