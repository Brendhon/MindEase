"use client";

import { useEffect } from "react";
import { Header, Sidebar } from "@/components/layout";
import { ActiveTaskIndicator } from "@/components/tasks/active-task-indicator";
import { BreakSessionCompleteDialogWrapper } from "@/components/tasks/break-session-complete-dialog";
import { FocusSessionCompleteDialogWrapper } from "@/components/tasks/focus-session-complete-dialog";
import { BreakTimerProvider } from "@/providers/break-timer-provider";
import { FocusTimerProvider } from "@/providers/focus-timer-provider";
import { SidebarProvider } from "@/providers/sidebar-provider";
import { TasksProvider } from "@/providers/tasks-provider";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";

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
 * - Cognitive settings loading: Loads user preferences from Firestore before rendering
 * 
 * Note: Session verification is handled by middleware (proxy.ts)
 */
export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loadSettings } = useCognitiveSettings();

  // Load settings from Firestore on mount
  // This ensures settings are available before any component renders
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

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
            <ActiveTaskIndicator />
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
  loadingContainer: "flex min-h-screen items-center justify-center bg-bg-secondary",
  loadingText: "text-text-primary text-lg",
};
