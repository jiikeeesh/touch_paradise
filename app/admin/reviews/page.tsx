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
import AdminNav from "@/components/AdminNav";
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

          <div className="lg:flex lg:gap-8 lg:items-start">
            <div className="lg:sticky lg:top-24 lg:flex-shrink-0">
              {/* Nav */}
              <AdminNav />
            </div>

            <div className="lg:flex-1 w-full min-w-0">

          <AdminReviewsClient initialReviews={reviews} />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
