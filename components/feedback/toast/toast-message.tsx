"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useTextDetail } from "@/hooks/useTextDetail";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";
import { cn } from "@/utils/ui";

/**
 * Toast.Message - Message subcomponent
 * Displays the toast message with accessibility-aware font sizing
 * Uses messageKey to get text from accessibility-texts.json based on user's textDetail preference
 * 
 * @example
 * ```tsx
 * <Toast type="success">
 *   <Toast.Icon />
 *   <Toast.Message messageKey="toast_success_task_created" />
 * </Toast>
 * ```
 */
export interface ToastMessageProps {
  messageKey: AccessibilityTextKey;
  className?: string;
  "data-testid"?: string;
}

export function ToastMessage({ messageKey, className, "data-testid": testId }: ToastMessageProps) {
  const { fontSizeClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();

  return (
    <div className={styles.content}>
      <p
        className={cn(styles.message, fontSizeClasses.sm, className)}
        data-testid={testId}
      >
        {getText(messageKey)}
      </p>
    </div>
  );
}

ToastMessage.displayName = "Toast.Message";

const styles = {
  content: "flex-1 min-w-0",
  message: "font-medium leading-normal",
} as const;

