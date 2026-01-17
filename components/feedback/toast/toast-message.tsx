"use client";

import { useAccessibilityClasses, useTextDetail } from "@/hooks/accessibility";
import { MessageComponentProps } from "@/models/feedback";
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

export function ToastMessage({ messageKey, className, "data-testid": testId }: MessageComponentProps) {
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

