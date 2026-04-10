"use client";

import { useState, useTransition } from "react";
import { Lock, User } from "lucide-react";
import { login } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function LoginForm() {
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
    <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-4 py-20">
      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200 border border-slate-100 p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="relative">
              <Lock className="w-8 h-8 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Access</h1>
          <p className="text-slate-500 mt-2">Sign in to manage submissions</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 text-center animate-in fade-in slide-in-from-top-2 duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500">
                <User className="h-5 w-5 text-slate-400" />
              </div>
              <input
                name="username"
                type="text"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 transition bg-slate-50/50 focus:bg-white"
                placeholder="Enter username"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-500">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                name="password"
                type="password"
                required
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-900 transition bg-slate-50/50 focus:bg-white"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-200 mt-4 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
          >
            <span className={isPending ? "opacity-0" : "opacity-100 transition-opacity"}>
              Sign In
            </span>
            {isPending && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
