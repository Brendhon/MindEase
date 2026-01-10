"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

/**
 * Sidebar Context - MindEase
 * 
 * Manages sidebar open/close state for mobile menu functionality.
 * 
 * Features:
 * - Toggle sidebar visibility
 * - Close sidebar on navigation
 * - Responsive behavior (desktop always visible, mobile toggleable)
 */
interface SidebarContextType {
  isOpen: boolean;
  toggle: () => void;
  open: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export interface SidebarProviderProps {
  children: ReactNode;
}

/**
 * SidebarProvider - Provides sidebar state management
 * 
 * @example
 * ```tsx
 * <SidebarProvider>
 *   <Sidebar />
 *   <Header />
 * </SidebarProvider>
 * ```
 */
export function SidebarProvider({ children }: SidebarProviderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <SidebarContext.Provider value={{ isOpen, toggle, open, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

/**
 * useSidebar - Hook to access sidebar state and controls
 * 
 * @throws {Error} If used outside SidebarProvider
 * 
 * @example
 * ```tsx
 * const { isOpen, toggle, close } = useSidebar();
 * ```
 */
export function useSidebar() {
  const context = useContext(SidebarContext);
  
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  
  return context;
}
