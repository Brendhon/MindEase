/**
 * Form Models - MindEase
 * Reusable interfaces for form components (input, select, etc.)
 */

import { LabelHTMLAttributes } from 'react';
import {
  BaseComponentProps,
  BaseComponentWithChildren,
  BaseComponentWithClassName,
} from './base';

/**
 * Base props for form label components (Input.Label and Select.Label)
 * Used by components that display labels for form fields
 */
export interface FormLabelProps
  extends
    BaseComponentProps,
    BaseComponentWithChildren,
    LabelHTMLAttributes<HTMLLabelElement> {}

/**
 * Base props for form error components (Input.Error and Select.Error)
 * Used by components that display error messages for form fields
 */
export interface FormErrorProps
  extends
    BaseComponentProps,
    BaseComponentWithChildren,
    BaseComponentWithClassName {
  /** Optional ID for accessibility (aria-describedby) */
  id?: string;
}
