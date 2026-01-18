/**
 * Dashboard Cognitive Alerts Models - MindEase
 * Reusable interfaces for cognitive alert components
 */

import { BaseComponentProps } from '@/models/base';

/**
 * Base props for cognitive alert components
 * Used by all specific alert types (excessive time, missing break, prolonged navigation)
 */
export interface CognitiveAlertProps extends BaseComponentProps {
  /** Whether alert is visible */
  isVisible: boolean;

  /** Callback when alert is dismissed */
  onDismiss: () => void;
}
