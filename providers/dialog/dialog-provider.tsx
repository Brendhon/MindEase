'use client';

import { ReactNode, useState, useCallback } from 'react';
import { DialogConfig, DialogContext } from '@/contexts/dialog';
import { DialogManager } from '@/components/feedback';

/**
 * Dialog Provider Props
 */
export interface DialogProviderProps {
  children: ReactNode;
}

/**
 * Dialog Provider Component - MindEase
 * Provides dialog context to children components
 *
 * This provider manages ONLY basic state (dialog).
 * All business logic is handled by the useDialog hook.
 */
export function DialogProvider({ children }: DialogProviderProps) {
  const [dialog, setDialog] = useState<DialogConfig | null>(null);

  // Internal setter for useDialog hook to use
  const setDialogState = useCallback(
    (
      newDialog:
        | DialogConfig
        | null
        | ((prev: DialogConfig | null) => DialogConfig | null)
    ) => setDialog(newDialog),
    []
  );

  return (
    <DialogContext.Provider
      value={{
        dialog,
        _setDialog: setDialogState,
      }}
    >
      {children}
      <DialogManager />
    </DialogContext.Provider>
  );
}
