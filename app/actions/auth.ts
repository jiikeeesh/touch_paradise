"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  const expectedPwd = process.env.ADMIN_PASSWORD || "password123";

  if (username === expectedUser && password === expectedPwd) {
    const cookieStore = await cookies();
    cookieStore.set("admin-token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    return { success: true };
  }

  return { error: "Invalid username or password" };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin-token");
  redirect("/admin/login");
}
