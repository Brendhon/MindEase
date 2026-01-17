"use client";

import type { Task } from "@/models/Task";
import { ActiveTaskIndicatorIcon } from "./active-task-indicator-icon";
import { ActiveTaskIndicatorTaskText } from "./active-task-indicator-task-text";
import { ActiveTaskIndicatorTimer } from "./active-task-indicator-timer";
import { styles } from "./active-task-indicator-styles";
import { TimerType } from "@/models/Timer";

/**
 * ActiveTaskIndicatorContent Component - MindEase
 * Displays main content section with icon, task information, and timer
 * Handles both minimized and expanded states
 */
export interface ActiveTaskIndicatorContentProps {
  /** Task object or null */
  task: Task | null;
  
  /** Timer type: "focus" or "break" */
  timerType: TimerType;
  
  /** Whether the indicator is minimized */
  isMinimized: boolean;
  
  /** Remaining time in seconds */
  remainingTime: number;
  
  /** Callback function to handle click */
  onClick: () => void;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function ActiveTaskIndicatorContent({
  task,
  timerType,
  isMinimized,
  remainingTime,
  onClick,
  "data-testid": testId,
}: ActiveTaskIndicatorContentProps) {
  return (
    <div
      role="button"
      onClick={onClick}
      className={styles.button}
      data-testid={testId || "active-task-indicator-content"}
    >
      {!isMinimized ? (
        <>
          <div className={styles.content}>
            <ActiveTaskIndicatorIcon
              timerType={timerType}
              data-testid="active-task-indicator-icon"
            />
            <ActiveTaskIndicatorTaskText
              task={task}
              data-testid="active-task-indicator-task-text"
            />
          </div>
          <div className={styles.timerContainer}>
            <ActiveTaskIndicatorTimer
              remainingTime={remainingTime}
              data-testid="active-task-indicator-timer"
            />
          </div>
        </>
      ) : (
        <div className={styles.minimizedContent}>
          <ActiveTaskIndicatorTimer
            remainingTime={remainingTime}
            data-testid="active-task-indicator-timer"
          />
        </div>
      )}
    </div>
  );
}

ActiveTaskIndicatorContent.displayName = "ActiveTaskIndicatorContent";
