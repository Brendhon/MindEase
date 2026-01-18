'use client';

import { useTextDetail } from '@/hooks/accessibility';
import type { AccessibilityTextKey } from '@/utils/accessibility';

/**
 * Sidebar.Label - Label subcomponent
 * Renders text labels for sidebar navigation items
 * Uses labelKey to get text from accessibility-texts.json based on user's textDetail preference
 *
 * @example
 * ```tsx
 * <Sidebar.Item href="/dashboard">
 *   <Sidebar.Icon icon={LayoutDashboard} />
 *   <Sidebar.Label labelKey="sidebar_dashboard" />
 * </Sidebar.Item>
 * ```
 */
export interface SidebarLabelProps {
  labelKey: AccessibilityTextKey;
}

export function SidebarLabel({ labelKey }: SidebarLabelProps) {
  const { getText } = useTextDetail();

  return <span>{getText(labelKey)}</span>;
}

SidebarLabel.displayName = 'Sidebar.Label';
