"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { cn } from "@/utils/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ActiveTaskIndicatorIcon } from "./active-task-indicator-icon";
import { styles } from "./active-task-indicator-styles";
import type { TimerType } from "./use-active-task-indicator";

/**
 * ActiveTaskIndicatorHeader Component - MindEase
 * Displays header with status text/icon and minimize button
 */
export interface ActiveTaskIndicatorHeaderProps {
  /** Whether the indicator is minimized */
  isMinimized: boolean;
  
  /** Status text to display when not minimized */
  statusText: string;
  
  /** Timer type: "focus" or "break" */
  timerType: TimerType;
  
  /** Callback function to toggle minimize state */
  onToggleMinimize: (e: React.MouseEvent) => void;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function ActiveTaskIndicatorHeader({
  isMinimized,
  statusText,
  timerType,
  onToggleMinimize,
  "data-testid": testId,
}: ActiveTaskIndicatorHeaderProps) {
  const { fontSizeClasses } = useAccessibilityClasses();

  return (
    <div
      className={cn(styles.header, isMinimized && styles.headerMinimized)}
      data-testid={testId || "active-task-indicator-header"}
    >
      {!isMinimized ? (
        <p className={cn(styles.status, fontSizeClasses.sm)}>
          {statusText}
        </p>
      ) : (
        <ActiveTaskIndicatorIcon
          timerType={timerType}
          data-testid="active-task-indicator-icon"
        />
      )}
      <button
        type="button"
        onClick={onToggleMinimize}
        className={styles.minimizeButton}
        aria-label={isMinimized ? "Maximizar indicador de tarefa" : "Minimizar indicador de tarefa"}
        aria-expanded={!isMinimized}
        data-testid="active-task-indicator-toggle"
      >
        {isMinimized ? (
          <ChevronLeft size={18} aria-hidden="true" />
        ) : (
          <ChevronRight size={18} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

ActiveTaskIndicatorHeader.displayName = "ActiveTaskIndicatorHeader";
