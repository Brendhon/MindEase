"use client";

import { useAccessibilityClasses } from "@/hooks/accessibility";
import { useCognitiveSettings } from "@/hooks/cognitive-settings";
import { useSidebar } from "@/hooks/sidebar";
import type { AccessibilityTextKey } from "@/utils/accessibility";
import { getAccessibilityText } from "@/utils/accessibility";
import { PROTECTED_ROUTES } from "@/utils/routes";
import { cn } from "@/utils/ui";
import { CheckSquare, LayoutDashboard, LucideIcon, User } from "lucide-react";
import { useEffect, useMemo } from "react";
import { SidebarIcon } from "./sidebar-icon";
import { SidebarItem } from "./sidebar-item";
import { SidebarLabel } from "./sidebar-label";
import { styles } from "./sidebar-styles";

/**
 * Sidebar Component - MindEase
 * 
 * Navigation sidebar for authenticated layout with cognitive accessibility support.
 * 
 * Features:
 * - Responsive to user accessibility preferences (contrast, spacing, font size, animations)
 * - Keyboard navigation support
 * - ARIA labels and semantic HTML
 * - Low visual stimulation design
 * - Uses design tokens for consistent styling
 * 
 * Uses composition pattern - accepts Sidebar subcomponents:
 * - Sidebar.Item for navigation items
 * - Sidebar.Icon for icons
 * - Sidebar.Label for text labels
 * 
 * @example
 * ```tsx
 * <Sidebar>
 *   <Sidebar.Item href="/dashboard">
 *     <Sidebar.Icon icon={LayoutDashboard} />
 *     <Sidebar.Label labelKey="sidebar_dashboard" />
 *   </Sidebar.Item>
 * </Sidebar>
 * ```
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
 */
export interface SidebarItemData {
  href: string;
  labelKey: AccessibilityTextKey;
  icon?: LucideIcon;
}

export interface SidebarProps {
  items?: SidebarItemData[];
}

const defaultItems: SidebarItemData[] = [
  { 
    href: PROTECTED_ROUTES.DASHBOARD, 
    labelKey: "sidebar_dashboard", 
    icon: LayoutDashboard 
  },
  { 
    href: PROTECTED_ROUTES.TASKS, 
    labelKey: "sidebar_tasks", 
    icon: CheckSquare 
  },
  { 
    href: PROTECTED_ROUTES.PROFILE, 
    labelKey: "sidebar_profile", 
    icon: User 
  },
];

function SidebarRoot({ items = defaultItems }: SidebarProps) {
  // Read cognitive accessibility settings - classes are automatically computed
  const { settings } = useCognitiveSettings();
  const { spacingClasses } = useAccessibilityClasses();
  const { isOpen, close } = useSidebar();

  // Hide sidebar when focus mode is enabled (unless it's explicitly opened)
  // In focus mode, sidebar is treated as a distraction and should be hidden by default
  const isFocusModeActive = settings.focusMode;
  const shouldHideSidebar = isFocusModeActive && !isOpen;

  // Generate spacing classes for the aside (padding and gap) - uses hook's pre-computed classes
  const asideClasses = useMemo(
    () => cn(spacingClasses.padding, spacingClasses.gap),
    [spacingClasses.padding, spacingClasses.gap]
  );

  // Close sidebar when clicking outside (on mobile)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when sidebar is open on mobile
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <>
      {/* Overlay for mobile - only visible when sidebar is open */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={close}
          aria-hidden="true"
          data-testid="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          styles.aside,
          asideClasses,
          styles.container,
          // Mobile: slide in/out from left
          // Desktop: hide when focus mode is active (unless explicitly opened)
          isOpen ? styles.containerOpen : styles.containerClosed,
          // Hide sidebar on desktop when focus mode is active
          shouldHideSidebar && "md:hidden"
        )}
        data-testid="sidebar-container"
        role="complementary"
        aria-label="Navigation sidebar"
        aria-hidden={shouldHideSidebar || !isOpen ? "true" : undefined}
      >
        <nav
          className={cn(styles.nav, spacingClasses.gap)}
          aria-label="Main navigation"
          data-testid="sidebar-nav"
        >
          {items.map((item) => {
            // Use detailed label for aria-label and testid (always use detailed mode for accessibility)
            const labelString = getAccessibilityText(item.labelKey, "detailed");
            
            return (
              <SidebarItem
                key={item.href}
                href={item.href}
                label={labelString}
                data-testid={`sidebar-link-${labelString.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {item.icon && <SidebarIcon icon={item.icon} />}
                <SidebarLabel labelKey={item.labelKey} />
              </SidebarItem>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

SidebarRoot.displayName = "Sidebar";

// Compose Sidebar with subcomponents
export const Sidebar = Object.assign(SidebarRoot, {
  Item: SidebarItem,
  Icon: SidebarIcon,
  Label: SidebarLabel,
});
