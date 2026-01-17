"use client";

import { useFeedbackContext } from "@/contexts/feedback";
import { useCognitiveSettings } from "@/hooks/cognitive-settings";
import type { FeedbackType } from "@/hooks/feedback";
import type { AccessibilityTextKey } from "@/utils/accessibility";
import { cn } from "@/utils/ui";
import { Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo } from "react";
import { ToastDismiss } from "./toast-dismiss";
import { ToastIcon } from "./toast-icon";
import { ToastMessage } from "./toast-message";
import { getContrastClasses, getTransitionClasses, getTypeClasses, styles } from "./toast-styles";
import { useAccessibilityClasses } from "@/hooks/accessibility";

interface ToastProps {
  id: string;
  type: FeedbackType;
  messageKey: AccessibilityTextKey;
  duration: number;
}

/**
 * Get aria label for dismiss button based on toast type
 */
function getDismissAriaLabel(type: FeedbackType): string {
  const labels = {
    success: "Dismiss Success message",
    error: "Dismiss Error message",
    warning: "Dismiss Warning message",
    info: "Dismiss Information message",
  };

  return labels[type];
}


/**
 * Toast container that renders all active toasts
 * Positioned in a non-intrusive location (top-right by default)
 * Respects cognitive accessibility settings for spacing
 */
export function ToastContainer() {
  const { feedbacks } = useFeedbackContext();
  const { spacingClasses } = useAccessibilityClasses();

  const containerGapClasses = spacingClasses.gap;

  // Styles defined as constants
  if (feedbacks.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(styles.toastContainer, containerGapClasses)}
      aria-live="polite"
      aria-atomic="false"
      role="region"
      aria-label="Notifications"
      data-testid="toast-container"
    >
      {feedbacks.map((feedback) => (
        <div key={feedback.id} className={styles.toastItem}>
          <ToastRoot
            id={feedback.id}
            type={feedback.type}
            messageKey={feedback.messageKey}
            duration={feedback.duration ?? 5000}
          />
        </div>
      ))}
    </div>
  );
}

// Internal Toast component (used by ToastContainer)
function ToastRoot({ id, type, messageKey, duration }: ToastProps) {
  const { removeFeedback } = useFeedbackContext();

  // Use cognitive settings hook for automatic accessibility class generation
  // These classes automatically update when user preferences change
  const { settings } = useCognitiveSettings();
  const { spacingClasses, animationClasses } = useAccessibilityClasses();

  // Generate spacing classes for toast (padding + gap) - uses hook's pre-computed classes
  const toastSpacingClasses = useMemo(
    () => cn(spacingClasses.padding, spacingClasses.gap),
    [spacingClasses.padding, spacingClasses.gap]
  );

  // Generate contrast classes with toast-specific logic (type-based borders)
  const contrastClasses = useMemo(
    () => getContrastClasses(settings.contrast, type),
    [settings.contrast, type]
  );

  // Get type-specific colors (background and text)
  const typeClasses = useMemo(
    () => getTypeClasses(type),
    [type]
  );

  // Generate transition classes with toast-specific logic
  const transitionClass = useMemo(
    () => getTransitionClasses(settings.animations),
    [settings.animations]
  );

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => removeFeedback(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, removeFeedback]);

  const handleDismiss = () => removeFeedback(id);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleDismiss();
  };

  return (
    <Transition
      appear
      show
      as={Fragment}
      enter={transitionClass}
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave={transitionClass}
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        role="alert"
        aria-live={type === "error" ? "assertive" : "polite"}
        aria-atomic="true"
        className={cn(
          styles.toastCard,
          toastSpacingClasses, // Dynamically updates based on settings.spacing
          animationClasses, // Dynamically updates based on settings.animations
          contrastClasses,
          typeClasses.bgColor,
          typeClasses.textColor
        )}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        data-testid={`toast-${type}-${id}`}
      >
        <ToastIcon type={type} data-testid={`toast-icon-${type}`} />
        <ToastMessage
          messageKey={messageKey}
          data-testid={`toast-message-${id}`}
        />
        <ToastDismiss
          onDismiss={handleDismiss}
          ariaLabel={getDismissAriaLabel(type)}
          data-testid={`toast-button-dismiss-${id}`}
        />
      </div>
    </Transition>
  );
}

ToastRoot.displayName = "Toast";

// Compose Toast with subcomponents (for testing and composition)
export const Toast = Object.assign(ToastRoot, {
  Icon: ToastIcon,
  Message: ToastMessage,
  Dismiss: ToastDismiss,
});

