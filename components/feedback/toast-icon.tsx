"use client";

import type { FeedbackType } from "@/hooks/useFeedback";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

/**
 * Toast.Icon - Icon subcomponent
 * Displays the appropriate icon based on toast type
 * 
 * @example
 * ```tsx
 * <Toast type="success">
 *   <Toast.Icon />
 *   <Toast.Message>Success message</Toast.Message>
 * </Toast>
 * ```
 */
export interface ToastIconProps {
  type: FeedbackType;
  className?: string;
  "data-testid"?: string;
}

const iconConfig = {
  success: {
    icon: CheckCircle2,
    ariaLabel: "Success",
  },
  error: {
    icon: AlertCircle,
    ariaLabel: "Error",
  },
  warning: {
    icon: AlertTriangle,
    ariaLabel: "Warning",
  },
  info: {
    icon: Info,
    ariaLabel: "Information",
  },
} as const;

export function ToastIcon({ type, className, "data-testid": testId }: ToastIconProps) {
  const config = iconConfig[type];
  const Icon = config.icon;

  return (
    <div className={styles.iconWrapper}>
      <Icon
        className={cn(styles.icon, className)}
        aria-hidden="true"
        data-testid={testId || `toast-icon-${type}`}
      />
    </div>
  );
}

ToastIcon.displayName = "Toast.Icon";

const styles = {
  iconWrapper: "flex-shrink-0",
  icon: "w-5 h-5 text-white",
} as const;

