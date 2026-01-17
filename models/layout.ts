/**
 * Layout Models - MindEase
 * Reusable interfaces for layout components
 */

import { BaseComponentProps } from "@/models/base";
import { ReactNode } from "react";

/**
 * Base props for page container components
 * Used by components that wrap page content with container styling
 */
export interface PageContainerComponentProps extends BaseComponentProps {
  /** Page content to render */
  children: ReactNode;
  
  /** Optional custom className */
  className?: string;
}
