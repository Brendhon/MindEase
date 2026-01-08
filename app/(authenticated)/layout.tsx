"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { FocusTimerProvider } from "@/contexts/focus-timer-context";

/**
 * Authenticated Layout - MindEase
 * 
 * Layout with sidebar + header for authenticated routes.
 * 
 * Provides:
 * - FocusTimerProvider: Global timer management for task-focused sessions
 * 
 * Note: Session verification is handled by middleware (proxy.ts)
 */
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FocusTimerProvider>
      <div className="flex min-h-screen bg-bg-secondary font-sans">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1">{children}</div>
        </main>
      </div>
    </FocusTimerProvider>
  );
}

