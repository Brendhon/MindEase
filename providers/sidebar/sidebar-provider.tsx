"use client";

import { ReactNode, useState, useCallback } from "react";
import { SidebarContext } from "@/contexts/sidebar";

/**
 * Sidebar Provider Props
 */
export interface SidebarProviderProps {
  children: ReactNode;
}

/**
 * Sidebar Provider Component - MindEase
 * Provides sidebar context to children components
 * 
 * This provider manages ONLY basic state (isOpen).
 * All business logic is handled by the useSidebar hook.
 */
export function SidebarProvider({
  children,
}: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Internal setter for useSidebar hook to use
  const setIsOpenState = useCallback((newIsOpen: boolean | ((prev: boolean) => boolean)) => setIsOpen(newIsOpen), []);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        _setIsOpen: setIsOpenState,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
