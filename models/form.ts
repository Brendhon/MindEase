/**
 * Form Models - MindEase
 * Reusable interfaces for form components (input, select, etc.)
 */

import { LabelHTMLAttributes, ReactNode } from "react";
import { BaseComponentProps } from "./base";

/**
 * Base props for form label components (Input.Label and Select.Label)
 * Used by components that display labels for form fields
 */
export interface FormLabelProps extends BaseComponentProps, LabelHTMLAttributes<HTMLLabelElement> {
  /** Label content */
  children: ReactNode;
}

/**
 * Base props for form error components (Input.Error and Select.Error)
 * Used by components that display error messages for form fields
 */
export interface FormErrorProps extends BaseComponentProps {
  /** Error message content */
  children: ReactNode;
  
  /** Optional ID for accessibility (aria-describedby) */
  id?: string;
  
  /** Optional custom className */
  className?: string;
}
