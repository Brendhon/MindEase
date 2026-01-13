"use client";

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui";
import { styles } from "./dialog-manager-styles";

/**
 * Dialog.Info - Info subcomponent
 * Displays additional information in the dialog
 * 
 * @example
 * ```tsx
 * <DialogManager>
 *   <Dialog.Message messageKey="dialog_confirm_delete" />
 *   <Dialog.Info>
 *     <p>This action cannot be undone.</p>
 *   </Dialog.Info>
 * </DialogManager>
 * ```
 */
export interface DialogInfoProps {
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
}

export function DialogInfo({
  children,
  className,
  "data-testid": testId,
}: DialogInfoProps) {
  const { fontSizeClasses } = useCognitiveSettings();

  return (
    <div
      className={cn(styles.info, fontSizeClasses.sm, className)}
      data-testid={testId}
    >
      {children}
    </div>
  );
}

DialogInfo.displayName = "Dialog.Info";
