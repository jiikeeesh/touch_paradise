import { prisma } from "@/lib/prisma";
import { Mail, Phone, Calendar, Briefcase, GraduationCap, MessageSquare, LogOut, Mountain, Users, ChevronLeft } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import DeleteInterviewButton from "./DeleteInterviewButton";

export const dynamic = "force-dynamic";

export default async function AdminInterviewsPage() {
  const applications = await (prisma as any).interviewApplication.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <PageLayout hideSocial={true}>
      <div className="bg-slate-50 min-h-screen py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-emerald-600 mb-2">
                <Link href="/admin" className="hover:underline flex items-center gap-1 text-sm font-bold uppercase tracking-widest">
                  <ChevronLeft className="w-4 h-4" />
                  Back to Dashboard
                </Link>
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Interview Applications</h1>
              <p className="text-slate-500">Manage potential candidates for your team</p>
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
          <div className="flex gap-2 mb-8">
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
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white shadow-sm border border-slate-200 text-emerald-700">
              <Users className="w-4 h-4" />
              Interviews
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {applications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <GraduationCap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No applications yet</h3>
                <p className="text-slate-500">Candidates will appear here once they apply from the Team page.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-semibold text-slate-500 tracking-wider">
                      <th className="p-5 w-1/4">Candidate Info</th>
                      <th className="p-5 w-1/4">Role & Experience</th>
                      <th className="p-5 w-1/3">Motivation / Message</th>
                      <th className="p-5 whitespace-nowrap text-right pr-8">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="p-5 align-top">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold flex-shrink-0">
                              {app.name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{app.name}</p>
                              <div className="flex flex-col gap-1 mt-2">
                                <a href={`mailto:${app.email}`} className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {app.email}
                                </a>
                                <a href={`tel:${app.phone}`} className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {app.phone}
                                </a>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 align-top">
                          <div className="flex flex-col gap-3">
                            <div>
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 mb-2">
                                <Briefcase className="w-3.5 h-3.5" />
                                {app.position}
                              </div>
                              <p className="text-sm text-slate-600 flex items-center gap-1.5">
                                <GraduationCap className="w-4 h-4 text-slate-400" />
                                {app.experience || "No experience details"}
                              </p>
                            </div>
                            <DeleteInterviewButton id={app.id} />
                          </div>
                        </td>
                        <td className="p-5 text-sm text-slate-700 align-top">
                          <div className="flex gap-2">
                            <MessageSquare className="w-4 h-4 text-slate-300 flex-shrink-0" />
                            <p className="line-clamp-4 hover:line-clamp-none transition-all">{app.message}</p>
                          </div>
                        </td>
                        <td className="p-5 align-top text-sm text-slate-500 whitespace-nowrap text-right pr-8">
                          <div className="flex items-center justify-end gap-1.5 mb-1">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {new Date(app.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs">
                            {new Date(app.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
