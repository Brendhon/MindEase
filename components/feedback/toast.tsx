"use client";

import { useFeedbackContext } from "@/contexts/feedback-context";
import type { FeedbackType } from "@/hooks/useFeedback";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { UserPreferences } from "@/models/UserPreferences";
import type { AccessibilityTextKey } from "@/utils/accessibility/content";
import { cn } from "@/utils/ui";
import { Transition } from "@headlessui/react";
import { Fragment, useEffect, useMemo } from "react";
import { ToastIcon } from "./toast-icon";
import { ToastMessage } from "./toast-message";
import { ToastDismiss } from "./toast-dismiss";

interface ToastProps {
  id: string;
  type: FeedbackType;
  messageKey: AccessibilityTextKey;
  duration: number;
}

/**
 * Get spacing classes for toast (padding + gap)
 */
function getToastSpacingClasses(spacingValue: number): string {
  return `gap-${spacingValue} p-${spacingValue}`;
}

/**
 * Get transition classes based on animation preference
 */
function getToastTransitionClasses(animations: boolean): string {
  return animations
    ? "transition-all duration-normal ease-base"
    : "transition-opacity duration-fast";
}

/**
 * Get contrast-aware classes for toast
 */
function getToastContrastClasses(
  contrast: UserPreferences["contrast"],
  type: FeedbackType
): string {
  const baseClasses = "shadow-medium";
  
  if (contrast === "high") {
    // High contrast: thicker border, outline, and stronger shadow for better visibility
    const borderColorClass =
      type === "error"
        ? "border-feedback-error"
        : type === "warning"
        ? "border-feedback-warning"
        : type === "success"
        ? "border-feedback-success"
        : "border-feedback-info";
    
    return `${baseClasses} border-4 ${borderColorClass} outline outline-2 outline-offset-2 outline-black/20 shadow-lg`;
  }

  return baseClasses;
}

/**
 * Get background and text color classes based on toast type and contrast
 */
function getToastTypeClasses(
  type: FeedbackType,
  contrast: UserPreferences["contrast"]
): { bgColor: string; textColor: string } {
  // In high contrast mode, use more saturated colors (defined in globals.css)
  // The colors are automatically applied via CSS variables
  const typeConfig = {
    success: {
      bgColor: "bg-feedback-success",
      textColor: "text-white",
    },
    error: {
      bgColor: "bg-feedback-error",
      textColor: "text-white",
    },
    warning: {
      bgColor: "bg-feedback-warning",
      textColor: "text-white",
    },
    info: {
      bgColor: "bg-feedback-info",
      textColor: "text-white",
    },
  };

  return typeConfig[type];
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
  const { spacingClasses } = useCognitiveSettings();

  const containerGapClasses = spacingClasses.gap;

  // Styles defined as constants
  if (feedbacks.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(toastStyles.toastContainer, containerGapClasses)}
      aria-live="polite"
      aria-atomic="false"
      role="region"
      aria-label="Notifications"
      data-testid="toast-container"
    >
      {feedbacks.map((feedback) => (
        <div key={feedback.id} className={toastStyles.toastItem}>
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
  const { settings, spacingValue } = useCognitiveSettings();

  // Memoize computed classes based on accessibility settings
  const spacingClasses = useMemo(
    () => getToastSpacingClasses(spacingValue),
    [spacingValue]
  );

  const transitionClasses = useMemo(
    () => getToastTransitionClasses(settings.animations),
    [settings.animations]
  );

  const contrastClasses = useMemo(
    () => getToastContrastClasses(settings.contrast, type),
    [settings.contrast, type]
  );

  const typeClasses = useMemo(
    () => getToastTypeClasses(type, settings.contrast),
    [type, settings.contrast]
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

  // Determine transition behavior based on animations setting
  const shouldReduceMotion = !settings.animations;

  return (
    <Transition
      appear
      show
      as={Fragment}
      enter={
        shouldReduceMotion
          ? "transition-opacity duration-fast"
          : transitionClasses
      }
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave={
        shouldReduceMotion
          ? "transition-opacity duration-fast"
          : transitionClasses
      }
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        role="alert"
        aria-live={type === "error" ? "assertive" : "polite"}
        aria-atomic="true"
        className={cn(
          toastStyles.toastCard,
          spacingClasses,
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

// Styles defined as constants (following project guidelines)
const toastStyles = {
  toastContainer: "fixed top-4 right-4 z-50 flex flex-col pointer-events-none",
  toastItem: "pointer-events-auto",
  toastCard: "relative flex items-start w-full max-w-md rounded-lg",
};

