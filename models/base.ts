import { ReactNode } from "react";

/**
 * Base component props with test ID support
 * Used across all components for testing purposes
 */
export interface BaseComponentProps {
  /** Test ID for testing */
  "data-testid"?: string;
}

export interface BaseComponentWithChildren {
  /** Children */
  children?: ReactNode;
}

export interface BaseComponentWithClassName {
  /** Class name */
  className?: string;
}