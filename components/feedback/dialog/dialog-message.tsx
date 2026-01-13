"use client";

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
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
  const { fontSizeClasses, textDetail } = useCognitiveSettings();

  return (
    <p
      className={cn(styles.message, fontSizeClasses.base, className)}
      data-testid={testId}
    >
      {textDetail.getText(messageKey)}
    </p>
  );
}

DialogMessage.displayName = "Dialog.Message";
