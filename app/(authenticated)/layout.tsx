"use client";

import { Sidebar, Header } from "@/components/layout";
import { BreakSessionCompleteDialogWrapper } from "@/components/tasks/break-session-complete-dialog";
import { FocusSessionCompleteDialogWrapper } from "@/components/tasks/focus-session-complete-dialog";
import { BreakTimerProvider } from "@/contexts/break-timer-context";
import { FocusTimerProvider } from "@/contexts/focus-timer-context";
import { SidebarProvider } from "@/contexts/sidebar-context";

/**
 * Authenticated Layout - MindEase
 * 
 * Layout with sidebar + header for authenticated routes.
 * 
 * Provides:
 * - FocusTimerProvider: Global timer management for task-focused sessions
 * - BreakTimerProvider: Global break timer management for Pomodoro sessions
 * - FocusSessionCompleteDialogWrapper: Global dialog for completed focus sessions
 * - BreakSessionCompleteDialogWrapper: Global dialog for completed break sessions
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
      <BreakTimerProvider>
        <SidebarProvider>
          <div className="flex min-h-screen bg-bg-secondary font-sans">
            <Sidebar />
            <main className="flex-1 flex flex-col">
              <Header />
              <div className="flex-1">{children}</div>
            </main>
          </div>
          <FocusSessionCompleteDialogWrapper />
          <BreakSessionCompleteDialogWrapper />
        </SidebarProvider>
      </BreakTimerProvider>
    </FocusTimerProvider>
  );
}

