"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import { useActiveTaskIndicator } from "@/hooks/tasks";
import { useBeforeUnload } from "@/hooks/utils";
import { useBreakTimer } from "@/hooks/break-timer";
import { useCognitiveSettings } from "@/hooks/cognitive-settings";
import { useFocusTimer } from "@/hooks/focus-timer";
import { useTextDetail } from "@/hooks/accessibility";
import { PROTECTED_ROUTES } from "@/utils/routes/routes";
import { cn } from "@/utils/ui";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { ActiveTaskIndicatorContent } from "./active-task-indicator-content";
import { ActiveTaskIndicatorHeader } from "./active-task-indicator-header";
import {
  getContrastClasses,
  getTransitionClasses,
  getTypeClasses,
  styles,
} from "./active-task-indicator-styles";

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
  const { spacingClasses } = useAccessibilityClasses();
  const { settings } = useCognitiveSettings();
  const { getText } = useTextDetail();
  const router = useRouter();
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Get timer states to check if any timer is active (running or paused)
  const { isRunning: isFocusRunning } = useFocusTimer();
  const { isRunning: isBreakRunning } = useBreakTimer();

  // Block navigation when timer is running (focus or break)
  // This shows browser confirmation dialog "Suas alterações serão perdidas" when user tries to leave
  // Only blocks when timer is actually running (not when idle)
  const shouldBlockNavigation = useMemo(() => {
    return isFocusRunning() || isBreakRunning();
  }, [isFocusRunning, isBreakRunning]);

  useBeforeUnload(shouldBlockNavigation);

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
      role="region"
      aria-live="polite"
      aria-label={ariaLabel}
      data-testid="active-task-indicator"
    >
      <div className={cardClasses}>
        <ActiveTaskIndicatorHeader
          isMinimized={isMinimized}
          statusText={statusText}
          timerType={timerType}
          onToggleMinimize={handleToggleMinimize}
          data-testid="active-task-indicator-header"
        />

        <ActiveTaskIndicatorContent
          task={activeTask}
          timerType={timerType}
          isMinimized={isMinimized}
          remainingTime={remainingTime}
          onClick={handleClick}
          data-testid="active-task-indicator-content"
        />
      </div>
    </div>
  );
}

ActiveTaskIndicator.displayName = "ActiveTaskIndicator";
