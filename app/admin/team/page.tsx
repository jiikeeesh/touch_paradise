import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import { logout } from "@/app/actions/auth";
import { LogOut, Users, Mail, Mountain, Briefcase } from "lucide-react";
import TeamManagementClient from "./TeamManagementClient";
import AdminNav from "@/components/AdminNav";
import { getTeamMembers } from "@/app/actions/team";

export const metadata: Metadata = {
  title: "Team Management | Admin — Touch Paradise",
};

export default async function AdminTeamPage() {
  const members = await getTeamMembers();

  return (
    <PageLayout hideSocial={true}>
      <div className="bg-slate-50 min-h-screen py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-1">
                Team Management
              </h1>
              <p className="text-slate-500">
                Add and manage your guides and office staff
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

          <TeamManagementClient initialMembers={members} />
        </div>
      </div>
    </PageLayout>
  );
}
