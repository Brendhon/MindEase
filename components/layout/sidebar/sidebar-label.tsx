"use client";

import { useTextDetail } from "@/hooks/useTextDetail";

/**
 * Sidebar.Label - Label subcomponent
 * Renders text labels for sidebar navigation items
 * Supports detailed and summary modes based on user preferences
 * 
 * @example
 * ```tsx
 * <Sidebar.Item href="/dashboard">
 *   <Sidebar.Icon icon={LayoutDashboard} />
 *   <Sidebar.Label label={{ detailed: "Dashboard Overview", summary: "Dashboard" }} />
 * </Sidebar.Item>
 * ```
 */
export interface SidebarLabelProps {
  label: { detailed: string; summary: string };
}

export function SidebarLabel({ label }: SidebarLabelProps) {
  const { render } = useTextDetail();

  return <span>{render(label.detailed, label.summary)}</span>;
}

SidebarLabel.displayName = "Sidebar.Label";

