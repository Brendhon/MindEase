"use client";

import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import { useTextDetail } from "@/hooks/useTextDetail";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";
import { cn } from "@/utils/ui";
import { styles } from "./dialog-manager-styles";

/**
 * Dialog.Message - Message subcomponent
 * Displays the dialog message with accessibility-aware font sizing
 * Uses messageKey to get text from accessibility-texts.json based on user's textDetail preference
 * 
 * @example
 * ```tsx
 * <DialogManager>
 *   <Dialog.Message messageKey="dialog_confirm_delete" />
 * </DialogManager>
 * ```
 */
export interface DialogMessageProps {
  messageKey: AccessibilityTextKey;
  className?: string;
  "data-testid"?: string;
}

export function DialogMessage({
  messageKey,
  className,
  "data-testid": testId,
}: DialogMessageProps) {
    const { getText } = useTextDetail();
  const { fontSizeClasses } = useAccessibilityClasses();  

  return (
    <p
      className={cn(styles.message, fontSizeClasses.base, className)}
      data-testid={testId}
    >
      {getText(messageKey)}
    </p>
  );
}

DialogMessage.displayName = "Dialog.Message";
