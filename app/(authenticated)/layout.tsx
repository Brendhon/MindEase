import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

/**
 * Authenticated Layout - MindEase
 * Layout with sidebar + header for authenticated routes
 */
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

