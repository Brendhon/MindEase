"use client";

import { Header, Sidebar } from "@/components/layout";
import { BreakSessionCompleteDialogWrapper } from "@/components/tasks/break-session-complete-dialog";
import { FocusSessionCompleteDialogWrapper } from "@/components/tasks/focus-session-complete-dialog";
import { BreakTimerProvider } from "@/contexts/break-timer-context";
import { FocusTimerProvider } from "@/contexts/focus-timer-context";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { TasksProvider } from "@/providers/tasks-provider";

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
    <TasksProvider>
      <FocusTimerProvider>
        <BreakTimerProvider>
          <SidebarProvider>
            <div className={styles.container}>
              <Sidebar />
              <main className={styles.main}>
                <Header />
                <div className={styles.content}>{children}</div>
              </main>
            </div>
            <FocusSessionCompleteDialogWrapper />
            <BreakSessionCompleteDialogWrapper />
          </SidebarProvider>
        </BreakTimerProvider>
      </FocusTimerProvider>
    </TasksProvider>
  );
}


const styles = {
  container: "flex min-h-screen bg-bg-secondary font-sans",
  main: "flex-1 flex flex-col",
  content: "flex-1 flex flex-col",
};
