import type { Metadata } from "next";
import { logout } from "@/app/actions/auth";
import { LogOut, Users, Mail, Mountain, Briefcase } from "lucide-react";
import TeamManagementClient from "./TeamManagementClient";
import AdminNav from "@/components/AdminNav";
import { getTeamMembers } from "@/app/actions/team";
import { prisma } from "@/lib/prisma";
import AdminHeaderActions from "@/components/AdminHeaderActions";

export const metadata: Metadata = {
  title: "Team Management | Admin — Touch Paradise",
};

export default async function AdminTeamPage() {
  const members = await getTeamMembers();
  const interviews = await (prisma as any).interviewApplication.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <main>
      <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
        <div className="w-full">
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
            <AdminHeaderActions />
          </div>

          <div className="lg:flex lg:gap-8 lg:items-start">
            <div className="lg:sticky lg:top-24 lg:flex-shrink-0">
              {/* Admin Nav */}
              <AdminNav />
            </div>
            
            <div className="lg:flex-1 w-full min-w-0">

          <TeamManagementClient initialMembers={members} interviews={interviews} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
