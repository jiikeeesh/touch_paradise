import { prisma } from "@/lib/prisma";
import type { ContactMessage } from "@prisma/client";
import { Mail, Phone, Calendar, Mountain, LogOut, Video } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { logout } from "@/app/actions/auth";
import AdminVideosClient from "./AdminVideosClient";
import DeleteMessageButton from "./DeleteMessageButton";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <PageLayout>
      <div className="bg-slate-50 min-h-screen py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
              <p className="text-slate-500">Manage your contact form requests</p>
            </div>

            {/* Logout button form */}
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

          {/* Section nav */}
          <div className="flex gap-2 mb-8">
            <span className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-white shadow-sm border border-slate-200 text-emerald-700">
              <Mail className="w-4 h-4" />
              Messages
            </span>
            <a
              href="/admin/treks"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 transition"
            >
              <Mountain className="w-4 h-4" />
              Treks
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {messages.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No messages yet</h3>
                <p className="text-slate-500">Incoming requests will appear here once users submit the contact form.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-semibold text-slate-500 tracking-wider">
                      <th className="p-5 w-1/4">User Info</th>
                      <th className="p-5 w-1/5 whitespace-nowrap">Actions</th>
                      <th className="p-5 w-1/6">Desired Trek</th>
                      <th className="p-5 w-1/3">Message</th>
                      <th className="p-5 whitespace-nowrap text-right pr-8">Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {messages.map((msg: ContactMessage) => (
                      <tr key={msg.id} className="hover:bg-slate-50/50 transition duration-150">
                        <td className="p-5 align-top">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold flex-shrink-0">
                              {msg.firstName[0]}
                              {msg.lastName[0]}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{msg.firstName} {msg.lastName}</p>
                              <p className="text-xs text-slate-500 font-mono mt-1" title={msg.id}>
                                ID: {msg.id.substring(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 align-top">
                          <div className="flex flex-col gap-2">
                            <a 
                              href={`mailto:${msg.email}`} 
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg hover:bg-emerald-100 transition shadow-sm border border-emerald-100"
                              title="Send Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              Email User
                            </a>
                            {msg.phone && (
                              <a 
                                href={`tel:${msg.phone}`} 
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg hover:bg-blue-100 transition shadow-sm border border-blue-100"
                                title="Call Number"
                              >
                                <Phone className="w-3.5 h-3.5" />
                                Call Number
                              </a>
                            )}
                            <hr className="border-slate-100 my-1" />
                            <DeleteMessageButton id={msg.id} />
                          </div>
                        </td>
                        <td className="p-5 align-top">
                          {msg.trek ? (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-full border border-emerald-100">
                              <Mountain className="w-3.5 h-3.5" />
                              {msg.trek}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-sm">Not specified</span>
                          )}
                        </td>
                        <td className="p-5 text-sm text-slate-700 align-top">
                          <p className="line-clamp-4 hover:line-clamp-none transition-all">{msg.message}</p>
                        </td>
                        <td className="p-5 align-top text-sm text-slate-500 whitespace-nowrap text-right pr-8">
                          <div className="flex items-center justify-end gap-1.5 mb-1">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs">
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="mt-16 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Video className="w-8 h-8 text-emerald-600" />
              Featured Videos
            </h2>
            <p className="text-slate-500 mb-8">Manage the feature videos shown on the homepage</p>
            <AdminVideosClient />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
