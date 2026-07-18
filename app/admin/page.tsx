import { prisma } from "@/lib/prisma";
import type { ContactMessage } from "@prisma/client";
import { Mail, Phone, Calendar, Mountain, LogOut, Video, Briefcase, Users, Star, Settings } from "lucide-react";
import { logout } from "@/app/actions/auth";
import AdminVideosClient from "./AdminVideosClient";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import DeleteMessageButton from "./DeleteMessageButton";
import AdminHeaderActions from "@/components/AdminHeaderActions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main>
      <div className="bg-slate-50 min-h-screen p-4 sm:p-8">
        <div className="w-full">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
              <p className="text-slate-500">Manage your contact form requests</p>
            </div>

            <AdminHeaderActions />
          </div>

          <div className="lg:flex lg:gap-8 lg:items-start">
            <div className="lg:sticky lg:top-24 lg:flex-shrink-0">
              {/* Section nav */}
              <AdminNav />
            </div>

            <div className="lg:flex-1 w-full min-w-0">

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
              <div>
                {/* Mobile View (Cards) */}
                <div className="md:hidden divide-y divide-slate-100">
                  {messages.map((msg: ContactMessage) => (
                    <div key={msg.id} className="p-5 space-y-4">
                      {/* User Info & Date */}
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold flex-shrink-0">
                            {msg.firstName[0]}
                            {msg.lastName[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{msg.firstName} {msg.lastName}</p>
                            <p className="text-xs text-slate-500 font-mono mt-1">
                              ID: {msg.id.substring(0, 8)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right text-xs text-slate-500 flex-shrink-0">
                          <div className="font-medium text-slate-700">{new Date(msg.createdAt).toLocaleDateString()}</div>
                          <div className="mt-0.5">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                      </div>
                      
                      {/* Desired Trek */}
                      {msg.trek && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-100">
                          <Mountain className="w-3.5 h-3.5" />
                          {msg.trek}
                        </div>
                      )}
                      
                      {/* Message */}
                      <div className="text-sm text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                        {msg.message}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        <a 
                          href={`mailto:${msg.email}`} 
                          className="flex-1 inline-flex justify-center items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100 transition hover:bg-emerald-100"
                        >
                          <Mail className="w-3.5 h-3.5" /> Email
                        </a>
                        {msg.phone && (
                          <a 
                            href={`tel:${msg.phone}`} 
                            className="flex-1 inline-flex justify-center items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl border border-blue-100 transition hover:bg-blue-100"
                          >
                            <Phone className="w-3.5 h-3.5" /> Call
                          </a>
                        )}
                        <DeleteMessageButton 
                          id={msg.id} 
                          className="flex-1 justify-center rounded-xl px-3 py-2 border border-red-100 text-xs font-bold"
                          showText={true}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop View (Table) */}
                <div className="hidden md:block overflow-x-auto">
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
              </div>
            )}
          </div>

          </div>
        </div>
      </div>
      </div>
    </main>
  );
}
