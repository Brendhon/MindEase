"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PROTECTED_ROUTES } from "@/utils/routes";

/**
 * Sidebar Component - MindEase
 * 
 * Navigation sidebar for authenticated layout.
 * 
 * Uses Next.js Link component with automatic prefetching for optimal performance.
 * Active state is determined by exact pathname matching.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/routing/linking-and-navigating
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
      <nav className="flex flex-col gap-2" aria-label="Main navigation">
        {items.map((item) => {
          // Check if current pathname matches the item href (exact match)
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              // Prefetch is enabled by default in Next.js Link
              // This improves navigation performance by preloading route data
              prefetch={true}
              className={`px-4 py-2 rounded-md transition-colors duration-150 ${
                isActive
                  ? "bg-action-primary/10 text-action-primary font-medium"
                  : "text-text-secondary hover:bg-surface-secondary hover:text-text-primary"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              {item.icon && <span className="mr-2" aria-hidden="true">{item.icon}</span>}
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

