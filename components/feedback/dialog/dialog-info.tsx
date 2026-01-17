"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
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
  const { fontSizeClasses } = useAccessibilityClasses();

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
