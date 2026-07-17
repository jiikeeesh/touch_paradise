import PageLayout from "@/components/PageLayout";
import AdminSettingsClient from "./AdminSettingsClient";
import AdminNav from "@/components/AdminNav";
import { logout } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <PageLayout hideSocial={true}>
      <div className="bg-slate-50 min-h-screen py-8 sm:py-24 pb-32">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Site Settings</h1>
              <p className="text-slate-500">Manage global settings for your website</p>
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
          
          <AdminNav />
          <AdminSettingsClient />
        </div>
      </div>
    </PageLayout>
  );
}
