import { PageContainerComponentProps } from "@/models/layout";
import { cn } from "@/utils/ui";

/**
 * Page Container Component - MindEase
 * Consistent page container with cognitive accessibility features
 */
export function PageContainer({ children, className = "", "data-testid": dataTestId = "page-container" }: PageContainerComponentProps) {
  return (
    <div className={cn(styles.container, className)} data-testid={dataTestId}>
      {children}
    </div>
  );
}

const styles = {
  container: "max-w-4xl mx-auto p-8",
} as const;