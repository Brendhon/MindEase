"use client";

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { PROTECTED_ROUTES } from "@/utils/routes";
import { cn } from "@/utils/ui/ui";
import { CheckSquare, LayoutDashboard, LucideIcon, User } from "lucide-react";
import { useMemo } from "react";
import { SidebarIcon } from "./sidebar-icon";
import { SidebarItem } from "./sidebar-item";
import { SidebarLabel } from "./sidebar-label";
import { getSpacingClasses, styles } from "./sidebar-styles";

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
 *     <Sidebar.Label label={{ detailed: "Dashboard Overview", summary: "Dashboard" }} />
 *   </Sidebar.Item>
 * </Sidebar>
 * ```
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
 */
export interface SidebarItemData {
  href: string;
  label: { detailed: string; summary: string };
  icon?: LucideIcon;
}

export interface SidebarProps {
  items?: SidebarItemData[];
}

const defaultItems: SidebarItemData[] = [
  { 
    href: PROTECTED_ROUTES.DASHBOARD, 
    label: { detailed: "Dashboard Overview", summary: "Dashboard" }, 
    icon: LayoutDashboard 
  },
  { 
    href: PROTECTED_ROUTES.TASKS, 
    label: { detailed: "Task Management", summary: "Tasks" }, 
    icon: CheckSquare 
  },
  { 
    href: PROTECTED_ROUTES.PROFILE, 
    label: { detailed: "User Profile Settings", summary: "Profile" }, 
    icon: User 
  },
];

function SidebarRoot({ items = defaultItems }: SidebarProps) {
  // Read cognitive accessibility settings
  const { settings } = useCognitiveSettings();

  // Memoize computed classes to avoid recalculation on every render
  const spacingClasses = useMemo(
    () => getSpacingClasses(settings.spacing),
    [settings.spacing]
  );

  // Extract gap class from spacing for nav element
  const navGapClass = useMemo(
    () => spacingClasses.split(" ")[0],
    [spacingClasses]
  );

  return (
    <aside
      className={cn(styles.aside, spacingClasses)}
      data-testid="sidebar-container"
      role="complementary"
      aria-label="Navigation sidebar"
    >
      <nav
        className={cn(styles.nav, navGapClass)}
        aria-label="Main navigation"
        data-testid="sidebar-nav"
      >
        {items.map((item) => {
          // Use detailed label for aria-label and testid
          const labelString = item.label.detailed;
          
          return (
            <SidebarItem
              key={item.href}
              href={item.href}
              label={labelString}
              contrast={settings.contrast}
              fontSize={settings.fontSize}
              animations={settings.animations}
              data-testid={`sidebar-link-${labelString.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {item.icon && <SidebarIcon icon={item.icon} />}
              <SidebarLabel label={item.label} />
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
