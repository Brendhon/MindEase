"use client";

import { Clock, Coffee } from "lucide-react";
import { cn } from "@/utils/ui";
import { useMemo } from "react";
import { getTypeClasses } from "./active-task-indicator-styles";
import { TimerType } from "@/models/Timer";

/**
 * ActiveTaskIndicatorIcon Component - MindEase
 * Displays contextual icon based on timer type
 */
export interface ActiveTaskIndicatorIconProps {
  /** Timer type: "focus" or "break" */
  timerType: TimerType;
  
  /** Test ID for testing */
  "data-testid"?: string;
}

export function ActiveTaskIndicatorIcon({
  timerType,
  "data-testid": testId,
}: ActiveTaskIndicatorIconProps) {
  const typeClasses = useMemo(() => getTypeClasses(timerType), [timerType]);

  const Icon = timerType === "focus" ? Clock : Coffee;
  const iconSize = 20;

  return (
    <div
      className={cn(styles.container, typeClasses.iconColor)}
      data-testid={testId || `active-task-indicator-icon-${timerType}`}
    >
      <Icon size={iconSize} aria-hidden="true" />
    </div>
  );
}

ActiveTaskIndicatorIcon.displayName = "ActiveTaskIndicatorIcon";

const styles = {
  container: "flex-shrink-0",
} as const;
