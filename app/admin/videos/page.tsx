import type { Metadata } from "next";
import { logout } from "@/app/actions/auth";
import { LogOut, Video } from "lucide-react";
import AdminVideosClient from "@/app/admin/AdminVideosClient";
import AdminNav from "@/components/AdminNav";
import AdminHeaderActions from "@/components/AdminHeaderActions";

export const metadata: Metadata = {
  title: "Featured Videos | Admin — Touch Paradise",
};

export default function AdminVideosPage() {
  return (
    <main>
      <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
        <div className="w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-1">
                Featured Videos
              </h1>
              <p className="text-slate-500">
                Manage the feature videos shown on the homepage
              </p>
            </div>
            <AdminHeaderActions />
          </div>

          <div className="lg:flex lg:gap-8 lg:items-start">
            <div className="lg:sticky lg:top-24 lg:flex-shrink-0">
              {/* Section nav */}
              <AdminNav />
            </div>

            <div className="lg:flex-1 w-full min-w-0">
              <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Video className="w-8 h-8 text-emerald-600" />
              Featured Videos
            </h2>
            <p className="text-slate-500 mb-8">Manage the feature videos shown on the homepage</p>
            <AdminVideosClient />
          </div>
              </div>
          </div>
        </div>
      </div>
    </main>
  );
}
