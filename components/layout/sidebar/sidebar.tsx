"use client";

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { PROTECTED_ROUTES } from "@/utils/routes";
import { cn } from "@/utils/ui/ui";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";
import { getAccessibilityText } from "@/utils/accessibility/content";
import { CheckSquare, LayoutDashboard, LucideIcon, User } from "lucide-react";
import { useMemo } from "react";
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
  const { spacingClasses } = useCognitiveSettings();

  // Generate spacing classes for the aside (padding and gap) - uses hook's pre-computed classes
  const asideClasses = useMemo(
    () => cn(spacingClasses.padding, spacingClasses.gap),
    [spacingClasses.padding, spacingClasses.gap]
  );

  return (
    <aside
      className={cn(styles.aside, asideClasses)}
      data-testid="sidebar-container"
      role="complementary"
      aria-label="Navigation sidebar"
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
  );
}

SidebarRoot.displayName = "Sidebar";

// Compose Sidebar with subcomponents
export const Sidebar = Object.assign(SidebarRoot, {
  Item: SidebarItem,
  Icon: SidebarIcon,
  Label: SidebarLabel,
});
