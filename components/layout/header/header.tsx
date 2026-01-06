/**
 * Header Component - MindEase
 * Main header for authenticated layout
 */
export interface HeaderProps {
  title?: string;
}

export function Header({ title = "MindEase" }: HeaderProps) {
  return (
    <header className="h-16 bg-surface-primary border-b border-border-subtle flex items-center px-6">
      <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
    </header>
  );
}

