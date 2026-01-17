"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useTextDetail } from "@/hooks/useTextDetail";
import { PROTECTED_ROUTES } from "@/utils/routes/routes";
import { cn } from "@/utils/ui";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ActiveTaskIndicatorContent } from "./active-task-indicator-content";
import { ActiveTaskIndicatorIcon } from "./active-task-indicator-icon";
import {
  getContrastClasses,
  getTransitionClasses,
  getTypeClasses,
  styles,
} from "./active-task-indicator-styles";
import { ActiveTaskIndicatorTimer } from "./active-task-indicator-timer";
import { useActiveTaskIndicator } from "./use-active-task-indicator";

/**
 * ActiveTaskIndicator Component - MindEase
 * Global floating component that displays the active task in focus or break
 * 
 * This component is visible on all authenticated screens and shows:
 * - Task title (if available)
 * - Timer type (focus or break)
 * - Remaining time
 * 
 * The component is positioned fixed in the bottom-right corner and is fully accessible.
 */
export function ActiveTaskIndicator() {
  const { activeTimer, activeTask, timerType, remainingTime } = useActiveTaskIndicator();
  const { spacingClasses, fontSizeClasses } = useAccessibilityClasses();
  const { settings } = useCognitiveSettings();
  const { getText } = useTextDetail();
  const router = useRouter();
  const [isMinimized, setIsMinimized] = useState(false);

  // Get type-specific classes
  const typeClasses = useMemo(() => timerType ? getTypeClasses(timerType) : null, [timerType]);

  // Get contrast classes
  const contrastClasses = useMemo(
    () => timerType ? getContrastClasses(settings.contrast, timerType) : null,
    [settings.contrast, timerType]
  );

  // Get transition classes
  const transitionClasses = useMemo(
    () => getTransitionClasses(settings.animations),
    [settings.animations]
  );

  // Build card classes
  const cardClasses = useMemo(
    () =>
      cn(
        styles.card,
        typeClasses?.bgColor,
        typeClasses?.borderColor,
        contrastClasses,
        !isMinimized && spacingClasses.padding,
        isMinimized && styles.cardMinimized,
        transitionClasses
      ),
    [typeClasses, contrastClasses, spacingClasses.padding, transitionClasses, isMinimized]
  );

  // Build container classes
  const containerClasses = useMemo(
    () => cn(styles.container, isMinimized && styles.containerMinimized),
    [isMinimized]
  );

  // Get status text
  const statusText = useMemo(() => {
    const text = timerType === "focus"
      ? "tasks_focus_session_active"
      : "tasks_break_session_active";
    return getText(text);
  }, [timerType, getText]);

  // Handle click to navigate to tasks page
  const handleClick = useCallback(() => router.push(PROTECTED_ROUTES.TASKS), [router]);

  // Handle toggle minimize/maximize
  const handleToggleMinimize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized((prev) => !prev);
  }, []);

  // Build aria label
  const ariaLabel = useMemo(() => {
    const taskTitle = activeTask?.title || "Sem título";
    const status = timerType === "focus" ? "em foco" : "em pausa";
    return `Tarefa ${status}: ${taskTitle}, tempo restante: ${remainingTime} segundos`;
  }, [timerType, activeTask?.title, remainingTime]);

  // Don't render if there's no active timer
  if (!activeTimer || !timerType) {
    return null;
  }

  return (
    <div
      className={containerClasses}
      role="button"
      onClick={handleClick}
      aria-live="polite"
      aria-label={ariaLabel}
      data-testid="active-task-indicator"
    >
      <div className={cardClasses}>
        <div className={cn(styles.header, isMinimized && styles.headerMinimized)}>
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
            onClick={handleToggleMinimize}
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

        {!isMinimized && (
          <>
            <div className={styles.content}>
              <ActiveTaskIndicatorIcon
                timerType={timerType}
                data-testid="active-task-indicator-icon"
              />
              <div className={styles.textContainer}>
                <ActiveTaskIndicatorContent
                  task={activeTask}
                  data-testid="active-task-indicator-content"
                />
              </div>
            </div>
            <div className={styles.timerContainer}>
              <ActiveTaskIndicatorTimer
                remainingTime={remainingTime}
                data-testid="active-task-indicator-timer"
              />
            </div>
          </>
        )}
        {isMinimized && (
          <div className={styles.minimizedContent}>
            <ActiveTaskIndicatorTimer
              remainingTime={remainingTime}
              data-testid="active-task-indicator-timer"
            />
          </div>
        )}
      </div>
    </div>
  );
}

ActiveTaskIndicator.displayName = "ActiveTaskIndicator";
