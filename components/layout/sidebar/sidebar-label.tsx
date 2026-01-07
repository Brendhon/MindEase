"use client";

import { ReactNode } from "react";

/**
 * Sidebar.Label - Label subcomponent
 * Renders text labels for sidebar navigation items
 * 
 * @example
 * ```tsx
 * <Sidebar.Item href="/dashboard">
 *   <Sidebar.Icon icon={LayoutDashboard} />
 *   <Sidebar.Label>Dashboard</Sidebar.Label>
 * </Sidebar.Item>
 * ```
 */
export interface SidebarLabelProps {
  children: ReactNode;
}

export function SidebarLabel({ children }: SidebarLabelProps) {
  return <span>{children}</span>;
}

SidebarLabel.displayName = "Sidebar.Label";

