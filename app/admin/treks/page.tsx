import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import { logout } from "@/app/actions/auth";
import { LogOut, Mountain, Mail, Briefcase } from "lucide-react";
import AdminTreksClient from "./AdminTreksClient";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Treks Management | Admin — Touch Paradise",
};

export default function AdminTreksPage() {
  return (
    <PageLayout hideSocial={true}>
      <div className="bg-slate-50 min-h-screen py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-1">
                Treks Management
              </h1>
              <p className="text-slate-500">
                Create and manage trekking regions and packages
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

          {/* Nav between admin sections */}
          <div className="flex gap-2 mb-8">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition"
            >
              <Mail className="w-4 h-4" />
              Messages
            </Link>
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white shadow-sm border border-slate-200 text-emerald-700">
              <Mountain className="w-4 h-4" />
              Treks
            </span>
            <Link
              href="/admin/services"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition"
            >
              <Briefcase className="w-4 h-4" />
              Services
            </Link>
          </div>

          <AdminTreksClient />
        </div>
      </div>
    </PageLayout>
  );
}
