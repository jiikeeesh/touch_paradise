import SessionManager from "./SessionManager";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SessionManager />
      {children}
    </>
  );
}
