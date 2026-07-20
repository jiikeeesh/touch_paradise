import type { Metadata } from "next";
import { logout } from "@/app/actions/auth";
import { LogOut, Briefcase, Mail, Mountain, Users } from "lucide-react";
import AdminServicesClient from "./AdminServicesClient";
import AdminNav from "@/components/AdminNav";
import AdminHeaderActions from "@/components/AdminHeaderActions";

export const metadata: Metadata = {
  title: "Services Management | Admin — Touch Paradise",
};

export default function AdminServicesPage() {
  return (
    <main>
      <div className="bg-slate-50 min-h-screen p-4 pb-24 sm:p-8">
        <div className="w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-1">
                Services Management
              </h1>
              <p className="text-slate-500">
                Manage your adventure categories and specific service offerings
              </p>
            </div>
            <AdminHeaderActions />
          </div>

          <div className="lg:flex lg:gap-8 lg:items-start">
            <div className="lg:sticky lg:top-24 lg:flex-shrink-0">
              {/* Admin Nav */}
              <AdminNav />
            </div>
            
            <div className="lg:flex-1 w-full min-w-0">

          <AdminServicesClient />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
