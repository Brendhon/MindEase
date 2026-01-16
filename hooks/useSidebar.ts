import { useCallback } from "react";
import { useSidebarContext } from "@/contexts/sidebar-context";

/**
 * useSidebar Hook - MindEase
 * Centralized hook for managing sidebar state
 * 
 * This hook encapsulates all business logic following Next.js best practices:
 * - Toggle sidebar visibility
 * - Open/close operations
 * - State management
 * 
 * The provider only manages basic state, while this hook handles all business logic.
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isOpen, toggle, close } = useSidebar();
 *   
 *   return (
 *     <button onClick={toggle}>
 *       {isOpen ? "Close" : "Open"} Sidebar
 *     </button>
 *   );
 * }
 * ```
 */
export function useSidebar() {
  const { isOpen, _setIsOpen } = useSidebarContext();

  /**
   * Toggle sidebar open/close state
   */
  const toggle = useCallback(() => {
    _setIsOpen((prev) => !prev);
  }, [_setIsOpen]);

  /**
   * Open sidebar
   */
  const open = useCallback(() => {
    _setIsOpen(true);
  }, [_setIsOpen]);

  /**
   * Close sidebar
   */
  const close = useCallback(() => {
    _setIsOpen(false);
  }, [_setIsOpen]);

  return {
    // State
    isOpen,

    // Operations
    toggle,
    open,
    close,
  };
}
