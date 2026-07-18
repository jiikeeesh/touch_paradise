import { LogOut, User } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { cookies } from "next/headers";

export default async function AdminHeaderActions() {
  const cookieStore = await cookies();
  const username = cookieStore.get("admin-username")?.value || "Admin";

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 px-3 py-2 rounded-lg">
        <User className="w-4 h-4 text-emerald-600" />
        <span>{username}</span>
      </div>
      <form action={logout}>
        <button
          type="submit"
          className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-red-600 transition text-sm font-medium shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </form>
    </div>
  );
}
