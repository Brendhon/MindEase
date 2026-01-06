"use client";

import { cn } from "@/utils/ui";

/**
 * Button.Loading - Loading indicator subcomponent
 * Use this for custom loading states
 * 
 * @example
 * ```tsx
 * <Button variant="primary" isLoading>
 *   <Button.Loading />
 *   <Button.Text>Saving...</Button.Text>
 * </Button>
 * ```
 */
export interface ButtonLoadingProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  "aria-label"?: string;
}

export function ButtonLoading({ size = "md", className, "aria-label": ariaLabel = "Loading" }: ButtonLoadingProps) {
  const iconSize = styles.iconSizes[size];
  
  return (
    <span className={cn(styles.loadingSpinner, iconSize, className)} aria-label={ariaLabel} role="status">
      <svg
        className={styles.spinner}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className={styles.spinnerCircle}
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className={styles.spinnerPath}
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>
  );
}

ButtonLoading.displayName = "Button.Loading";

const styles = {
  iconSizes: {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  } as const,
  loadingSpinner: "flex-shrink-0 animate-spin",
  spinner: "w-full h-full",
  spinnerCircle: "opacity-25",
  spinnerPath: "opacity-75",
} as const;
