import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/next-auth";
import { redirect } from "next/navigation";

/**
 * Authenticated Layout - MindEase
 * 
 * Layout with sidebar + header for authenticated routes.
 * 
 * This layout is protected by the proxy (middleware), but we also verify
 * the session here as a server-side check for additional security.
 * 
 * @see proxy.ts for route protection logic
 */
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side session verification (additional security layer)
  const session = await getServerSession(authOptions);

  // If no session, redirect to login (proxy should handle this, but this is a fallback)
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-bg-secondary font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}

