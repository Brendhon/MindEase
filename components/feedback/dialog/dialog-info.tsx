'use client';

import { useAccessibilityClasses } from '@/hooks/accessibility';
import { InfoComponentProps } from '@/models/feedback';
import { cn } from '@/utils/ui';
import { styles } from './dialog-manager-styles';

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

export function DialogInfo({
  children,
  className,
  'data-testid': testId,
}: InfoComponentProps) {
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

DialogInfo.displayName = 'Dialog.Info';
