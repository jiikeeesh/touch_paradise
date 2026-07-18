import AdminSettingsClient from "./AdminSettingsClient";
import AdminNav from "@/components/AdminNav";
import { logout } from "@/app/actions/auth";
import { LogOut } from "lucide-react";
import AdminHeaderActions from "@/components/AdminHeaderActions";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <main>
      <div className="bg-slate-50 min-h-screen py-8 sm:py-24 pb-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Site Settings</h1>
              <p className="text-slate-500">Manage global settings for your website</p>
            </div>
            <AdminHeaderActions />
          </div>
          
          <div className="lg:flex lg:gap-8 lg:items-start">
            <div className="lg:sticky lg:top-24 lg:flex-shrink-0">
              <AdminNav />
            </div>
            
            <div className="lg:flex-1 w-full min-w-0">
              <AdminSettingsClient />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
