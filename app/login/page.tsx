"use client";

import { useState, useTransition } from "react";
import { Lock, User } from "lucide-react";
import { login } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/admin");
        router.refresh();
      }
    });
  };

  return (
    <PageLayout hideSocial={true}>
      <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-4 py-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-10 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Access</h1>
            <p className="text-slate-500 mt-2">Sign in to manage submissions</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="username"
                  type="text"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 transition"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 transition"
                  placeholder="Enter password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-200 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending ? "Authenticating..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </PageLayout>
  );
}
