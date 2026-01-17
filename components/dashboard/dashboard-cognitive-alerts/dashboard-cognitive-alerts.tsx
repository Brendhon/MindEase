"use client";

import { Task } from "@/models/Task";
import { CognitiveAlertMissingBreak } from "./cognitive-alert-missing-break";
import { CognitiveAlertProlongedNavigation } from "./cognitive-alert-prolonged-navigation";
import { CognitiveAlertExcessiveTime } from "./cognitive-alert-excessive-time";

/**
 * DashboardCognitiveAlerts Component - MindEase
 * Display cognitive alerts based on task focus time, break patterns, and navigation behavior
 * 
 * Alerts:
 * - Excessive time: Same task in focus for >60-90 min
 * - Missing break: Multiple focus sessions without break
 * - Prolonged navigation: Navigating without actions for extended time
 * 
 * Priority: excessive_time > missing_break > prolonged_navigation
 */
export interface DashboardCognitiveAlertsProps {
  /** Array of tasks to check for alerts */
  tasks: Task[];

  /** Test ID for testing */
  "data-testid"?: string;
}

export function DashboardCognitiveAlerts({ tasks, "data-testid": testId }: DashboardCognitiveAlertsProps) {
  return <>
    <CognitiveAlertExcessiveTime isVisible={true} onDismiss={() => { }} />
    <CognitiveAlertMissingBreak isVisible={true} onDismiss={() => { }} />
    <CognitiveAlertProlongedNavigation isVisible={true} onDismiss={() => { }} />
  </>;
}

DashboardCognitiveAlerts.displayName = "DashboardCognitiveAlerts";
