"use client";

import { useMemo } from "react";
import { PROTECTED_ROUTES } from "@/utils/routes";
import { LayoutDashboard, CheckSquare, User, LucideIcon } from "lucide-react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { cn } from "@/utils/ui/ui";
import { styles, getSpacingClasses } from "./sidebar-styles";
import { SidebarItem } from "./sidebar-item";
import { SidebarIcon } from "./sidebar-icon";
import { SidebarLabel } from "./sidebar-label";

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
 *     <Sidebar.Label>Dashboard</Sidebar.Label>
 *   </Sidebar.Item>
 * </Sidebar>
 * ```
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
 */
export interface SidebarItemData {
  href: string;
  label: string;
  icon?: LucideIcon | React.ReactNode;
}

export interface SidebarProps {
  items?: SidebarItemData[];
}

const defaultItems: SidebarItemData[] = [
  { href: PROTECTED_ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { href: PROTECTED_ROUTES.TASKS, label: "Tasks", icon: CheckSquare },
  { href: PROTECTED_ROUTES.PROFILE, label: "Profile", icon: User },
];

function SidebarRoot({ items = defaultItems }: SidebarProps) {
  // Use hook in read-only mode to observe accessibility settings
  const { settings } = useCognitiveSettings(undefined, {
    readOnly: true,
    autoApply: false,
  });

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
        {items.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            label={item.label}
            contrast={settings.contrast}
            fontSize={settings.fontSize}
            animations={settings.animations}
            data-testid={`sidebar-link-${item.label.toLowerCase()}`}
          >
            {item.icon && <SidebarIcon icon={item.icon} />}
            <SidebarLabel>{item.label}</SidebarLabel>
          </SidebarItem>
        ))}
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
