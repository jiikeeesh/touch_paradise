import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  if (token !== "authenticated") {
    redirect("/login");
  }

  return (
    <>
      {children}
    </>
  );
}
