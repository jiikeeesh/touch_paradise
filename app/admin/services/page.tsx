import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import { logout } from "@/app/actions/auth";
import { LogOut, Briefcase, Mail, Mountain, Users } from "lucide-react";
import AdminServicesClient from "./AdminServicesClient";
import AdminNav from "@/components/AdminNav";

export const metadata: Metadata = {
  title: "Services Management | Admin — Touch Paradise",
};

export default function AdminServicesPage() {
  return (
    <PageLayout hideSocial={true}>
      <div className="bg-slate-50 min-h-screen py-24">
        <div className="container mx-auto px-4 max-w-7xl">
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
            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-red-600 transition text-sm"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </form>
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
    </PageLayout>
  );
}
