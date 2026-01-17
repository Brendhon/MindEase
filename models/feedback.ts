/**
 * Feedback Models - MindEase
 * Reusable interfaces for feedback components (dialog and toast)
 */

import { BaseComponentProps, BaseComponentWithChildren, BaseComponentWithClassName } from "@/models/base";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";

/**
 * Base props for message components (Dialog.Message and Toast.Message)
 * Used by components that display messages with translation keys
 */
export interface MessageComponentProps extends BaseComponentProps, BaseComponentWithClassName {
  /** Translation key for message */
  messageKey: AccessibilityTextKey;
}

/**
 * InfoComponentProps - Base props for info components (Dialog.Info)
 * Used by components that display additional information
 */
export interface InfoComponentProps extends BaseComponentWithChildren, BaseComponentProps, BaseComponentWithClassName { }
