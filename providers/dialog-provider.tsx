"use client";

import { DialogManager } from "@/components/feedback";
import { DialogConfig, DialogContext } from "@/contexts/dialog-context";
import { generateRandomUUID } from "@/utils/uuid";
import { useCallback, useState } from "react";

interface DialogProviderProps {
  children: React.ReactNode;
}

/**
 * Provider for global dialog management
 * Manages state and lifecycle of dialogs
 */
export function DialogProvider({ children }: DialogProviderProps) {
  const [dialog, setDialog] = useState<DialogConfig | null>(null);

  const openDialog = useCallback((config: Omit<DialogConfig, "id">) => {
    setDialog({
      ...config,
      id: generateRandomUUID(),
    });
  }, []);

  const closeDialog = useCallback(() => {
    setDialog(null);
  }, []);

  const updateDialog = useCallback((updates: Partial<DialogConfig>) => {
    setDialog((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  return (
    <DialogContext.Provider
      value={{
        dialog,
        openDialog,
        closeDialog,
        updateDialog,
      }}
    >
      {children}
      <DialogManager />
    </DialogContext.Provider>
  );
}
