import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import { logout } from "@/app/actions/auth";
import { LogOut, Mountain, Mail, Briefcase, Users } from "lucide-react";
import AdminTreksClient from "./AdminTreksClient";
import AdminNav from "@/components/AdminNav";

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

          {/* Admin Nav */}
          <AdminNav />

          <AdminTreksClient />
        </div>
      </div>
    </PageLayout>
  );
}
