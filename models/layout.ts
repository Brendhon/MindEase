/**
 * Layout Models - MindEase
 * Reusable interfaces for layout components
 */

import {
  BaseComponentProps,
  BaseComponentWithChildren,
  BaseComponentWithClassName,
} from '@/models/base';

/**
 * Base props for page container components
 * Used by components that wrap page content with container styling
 */
export interface PageContainerComponentProps
  extends
    BaseComponentProps,
    BaseComponentWithChildren,
    BaseComponentWithClassName {}
