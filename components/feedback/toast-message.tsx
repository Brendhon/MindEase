"use client";

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { UserPreferences } from "@/models/UserPreferences";
import { cn } from "@/utils/ui";
import { useMemo } from "react";

/**
 * Toast.Message - Message subcomponent
 * Displays the toast message with accessibility-aware font sizing
 * 
 * @example
 * ```tsx
 * <Toast type="success">
 *   <Toast.Icon />
 *   <Toast.Message>Success message</Toast.Message>
 * </Toast>
 * ```
 */
export interface ToastMessageProps {
  children: string;
  className?: string;
  "data-testid"?: string;
}

/**
 * Get font size classes based on user preference
 */
function getToastFontSizeClasses(fontSize: UserPreferences["fontSize"]): string {
  switch (fontSize) {
    case "small":
      return "text-xs";
    case "large":
      return "text-base";
    default:
      return "text-sm";
  }
}

export function ToastMessage({ children, className, "data-testid": testId }: ToastMessageProps) {
  const { settings } = useCognitiveSettings();

  const fontSizeClasses = useMemo(
    () => getToastFontSizeClasses(settings.fontSize),
    [settings.fontSize]
  );

  return (
    <div className={styles.content}>
      <p
        className={cn(styles.message, fontSizeClasses, className)}
        data-testid={testId}
      >
        {children}
      </p>
    </div>
  );
}

ToastMessage.displayName = "Toast.Message";

const styles = {
  content: "flex-1 min-w-0",
  message: "font-medium leading-normal",
} as const;

