import { prisma } from "@/lib/prisma";
import {
  Mail,
  Star,
  LogOut,
  Mountain,
  Briefcase,
  Users,
  ChevronLeft,
  MessageSquare,
} from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import AdminReviewsClient from "./AdminReviewsClient";

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const reviews = await (prisma as any).review.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <PageLayout hideSocial={true}>
      <div className="bg-slate-50 min-h-screen py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <Link
                  href="/admin"
                  className="hover:underline flex items-center gap-1 text-sm font-bold uppercase tracking-widest"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Dashboard
                </Link>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Customer Reviews
              </h1>
              <p className="text-slate-500">
                Moderate and approve submitted trip reviews
              </p>
            </div>

            <form action={logout}>
              <button
                type="submit"
                className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-red-600 transition text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </form>
          </div>

          {/* Nav */}
          <div className="flex gap-2 mb-8 flex-wrap">
            <Link
              href="/admin"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition"
            >
              <Mail className="w-4 h-4" />
              Messages
            </Link>
            <Link
              href="/admin/treks"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition"
            >
              <Mountain className="w-4 h-4" />
              Treks
            </Link>
            <Link
              href="/admin/services"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition"
            >
              <Briefcase className="w-4 h-4" />
              Services
            </Link>
            <Link
              href="/admin/team"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition"
            >
              <Users className="w-4 h-4" />
              Team
            </Link>
            <Link
              href="/admin/interviews"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition"
            >
              <Users className="w-4 h-4" />
              Interviews
            </Link>
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white shadow-sm border border-slate-200 text-emerald-700">
              <Star className="w-4 h-4" />
              Reviews
            </span>
          </div>

          <AdminReviewsClient initialReviews={reviews} />
        </div>
      </div>
    </PageLayout>
  );
}
