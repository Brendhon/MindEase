"use client";

import { useFeedbackContext } from "@/contexts/feedback-context";
import { generateRandomUUID } from "@/utils/uuid";
import { useCallback } from "react";

/**
 * Feedback types for semantic meaning
 */
export type FeedbackType = "success" | "error" | "warning" | "info";

/**
 * Feedback message configuration
 */
export interface FeedbackMessage {
  id: string;
  type: FeedbackType;
  message: string;
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
 * - Simple API
 *
 * @example
 * ```tsx
 * const { showFeedback } = useFeedback();
 *
 * showFeedback({
 *   type: "success",
 *   message: "Task created successfully"
 * });
 * ```
 */
export function useFeedback() {
  const context = useFeedbackContext();

  const showFeedback = useCallback(
    (options: {
      type: FeedbackType;
      message: string;
      duration?: number;
    }) => {
      context.addFeedback({
        id: generateRandomUUID(),
        type: options.type,
        message: options.message,
        duration: options.duration ?? 5000,
      });
    },
    [context]
  );

  return {
    showFeedback,
    success: useCallback(
      (message: string, duration?: number) => {
        showFeedback({ type: "success", message, duration });
      },
      [showFeedback]
    ),
    error: useCallback(
      (message: string, duration?: number) => {
        showFeedback({ type: "error", message, duration });
      },
      [showFeedback]
    ),
    warning: useCallback(
      (message: string, duration?: number) => {
        showFeedback({ type: "warning", message, duration });
      },
      [showFeedback]
    ),
    info: useCallback(
      (message: string, duration?: number) => {
        showFeedback({ type: "info", message, duration });
      },
      [showFeedback]
    ),
  };
}

