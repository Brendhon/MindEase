"use client";

import { useFeedbackContext } from "@/contexts/feedback";
import { generateRandomUUID } from "@/utils/uuid";
import type { AccessibilityTextKey } from "@/utils/accessibility";
import { useCallback } from "react";

/**
 * Feedback types for semantic meaning
 */
export type FeedbackType = "success" | "error" | "warning" | "info";

/**
 * Feedback message configuration
 * Uses messageKey to reference text content from accessibility-texts.json
 */
export interface FeedbackMessage {
  id: string;
  type: FeedbackType;
  messageKey: AccessibilityTextKey;
  duration?: number;
}

/**
 * Hook to show feedback messages (toasts) with accessibility support
 *
 * Features:
 * - Semantic types (success, error, warning, info)
 * - Automatic cleanup
 * - Screen reader announcements
 * - Respects user motion preferences
 * - Uses accessibility text keys for detailed/summary modes
 * - Simple API
 *
 * @example
 * ```tsx
 * const { showFeedback } = useFeedback();
 *
 * showFeedback({
 *   type: "success",
 *   messageKey: "toast_success_task_created"
 * });
 * ```
 */
export function useFeedback() {
  const context = useFeedbackContext();

  const showFeedback = useCallback(
    (options: {
      type: FeedbackType;
      messageKey: AccessibilityTextKey;
      duration?: number;
    }) => {
      context.addFeedback({
        id: generateRandomUUID(),
        type: options.type,
        messageKey: options.messageKey,
        duration: options.duration ?? 5000,
      });
    },
    [context]
  );

  return {
    showFeedback,
    success: useCallback(
      (messageKey: AccessibilityTextKey, duration?: number) => {
        showFeedback({ type: "success", messageKey, duration });
      },
      [showFeedback]
    ),
    error: useCallback(
      (messageKey: AccessibilityTextKey, duration?: number) => {
        showFeedback({ type: "error", messageKey, duration });
      },
      [showFeedback]
    ),
    warning: useCallback(
      (messageKey: AccessibilityTextKey, duration?: number) => {
        showFeedback({ type: "warning", messageKey, duration });
      },
      [showFeedback]
    ),
    info: useCallback(
      (messageKey: AccessibilityTextKey, duration?: number) => {
        showFeedback({ type: "info", messageKey, duration });
      },
      [showFeedback]
    ),
  };
}

