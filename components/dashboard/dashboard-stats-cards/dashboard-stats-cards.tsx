"use client";

import { Card } from "@/components/ui/card";
import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { Task } from "@/models/Task";
import { cn } from "@/utils/ui";
import { BarChart3, CheckCircle2, Clock, ListTodo } from "lucide-react";
import { useMemo } from "react";

/**
 * DashboardStatsCards Component - MindEase
 * Display task statistics cards (total, pending, in progress, completed)
 */
export interface DashboardStatsCardsProps {
  /** Array of tasks to calculate statistics from */
  tasks: Task[];
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function DashboardStatsCards({ tasks, "data-testid": testId }: DashboardStatsCardsProps) {
  const { textDetail } = useCognitiveSettings();
  const { fontSizeClasses, spacingClasses } = useAccessibilityClasses();

  // Calculate statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((task) => task.status === 0).length;
    const inProgress = tasks.filter((task) => task.status === 1).length;
    const completed = tasks.filter((task) => task.status === 2).length;

    return { total, pending, inProgress, completed };
  }, [tasks]);

  const containerClasses = useMemo(
    () => cn(styles.container, spacingClasses.gap),
    [spacingClasses.gap]
  );

  const titleClasses = useMemo(
    () => cn(styles.title, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

  const valueClasses = useMemo(
    () => cn(styles.value, fontSizeClasses["2xl"]),
    [fontSizeClasses["2xl"]]
  );

  return (
    <div className={containerClasses} data-testid={testId || "dashboard-stats-cards"}>
      <StatCard
        icon={BarChart3}
        title={textDetail.getText("dashboard_stats_total")}
        value={stats.total}
        titleClasses={titleClasses}
        valueClasses={valueClasses}
        data-testid="dashboard-stat-total"
      />
      <StatCard
        icon={ListTodo}
        title={textDetail.getText("dashboard_stats_pending")}
        value={stats.pending}
        titleClasses={titleClasses}
        valueClasses={valueClasses}
        data-testid="dashboard-stat-pending"
      />
      <StatCard
        icon={Clock}
        title={textDetail.getText("dashboard_stats_in_progress")}
        value={stats.inProgress}
        titleClasses={titleClasses}
        valueClasses={valueClasses}
        data-testid="dashboard-stat-in-progress"
      />
      <StatCard
        icon={CheckCircle2}
        title={textDetail.getText("dashboard_stats_completed")}
        value={stats.completed}
        titleClasses={titleClasses}
        valueClasses={valueClasses}
        data-testid="dashboard-stat-completed"
      />
    </div>
  );
}

DashboardStatsCards.displayName = "DashboardStatsCards";

/**
 * StatCard Component - Internal component for individual stat card
 */
interface StatCardProps {
  icon: React.ComponentType<{ className?: string; size?: number }>;
  title: string;
  value: number;
  titleClasses: string;
  valueClasses: string;
  "data-testid"?: string;
}

function StatCard({
  icon: Icon,
  title,
  value,
  titleClasses,
  valueClasses,
  "data-testid": testId,
}: StatCardProps) {
  return (
    <Card className={styles.card} data-testid={testId}>
      <div className={styles.cardHeader}>
        <Icon className={styles.icon} size={20} />
        <span className={titleClasses}>{title}</span>
      </div>
      <div className={styles.cardValue}>
        <span className={valueClasses}>{value}</span>
      </div>
    </Card>
  );
}

/**
 * DashboardStatsCards Styles - MindEase
 * Centralized styles for dashboard stats cards component
 */

export const styles = {
  container: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
  card: "gap-2",
  cardHeader: "flex items-center gap-2",
  icon: "text-text-secondary",
  title: "text-text-secondary font-medium",
  cardValue: "flex items-center",
  value: "font-semibold text-text-primary",
} as const;
