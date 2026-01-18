import { createContext, useContext } from 'react';

/**
 * Sidebar Context - MindEase
 * Global sidebar state management
 *
 * This context provides ONLY basic state:
 * - Sidebar open/close state
 * - Internal setter for useSidebar hook
 *
 * All business logic (toggle, open, close operations)
 * is handled by the useSidebar hook. Components should use useSidebar(), not useSidebarContext().
 */

export interface SidebarContextValue {
  /** Sidebar open state */
  isOpen: boolean;

  // Internal setter - only used by useSidebar hook
  _setIsOpen: (isOpen: boolean | ((prev: boolean) => boolean)) => void;
}

export const SidebarContext = createContext<SidebarContextValue | undefined>(
  undefined
);

/**
 * Hook to access sidebar context
 *
 * ⚠️ **Note**: This hook is for internal use by useSidebar hook only.
 * Components should use useSidebar() instead, which provides all business logic.
 *
 * @throws Error if used outside SidebarProvider
 *
 * @internal
 */
export function useSidebarContext(): SidebarContextValue {
  const context = useContext(SidebarContext);

  if (context === undefined) {
    throw new Error('useSidebarContext must be used within SidebarProvider');
  }

  return context;
}
