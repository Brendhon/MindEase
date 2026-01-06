"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PROTECTED_ROUTES } from "@/utils/routes";

/**
 * Sidebar Component - MindEase
 * Navigation sidebar for authenticated layout
 */
export interface SidebarProps {
  items?: Array<{ href: string; label: string; icon?: React.ReactNode }>;
}

const defaultItems = [
  { href: PROTECTED_ROUTES.DASHBOARD, label: "Dashboard" },
  { href: PROTECTED_ROUTES.TASKS, label: "Tasks" },
  { href: PROTECTED_ROUTES.PROFILE, label: "Profile" },
];

export function Sidebar({ items = defaultItems }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-surface-primary border-r border-border-subtle p-4">
      <nav className="flex flex-col gap-2">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-md transition-colors duration-150 ${
                isActive
                  ? "bg-action-primary/10 text-action-primary font-medium"
                  : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
              }`}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

