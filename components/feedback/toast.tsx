"use client";

import { useFeedbackContext } from "@/contexts/feedback-context";
import type { FeedbackType } from "@/hooks/useFeedback";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { UserPreferences } from "@/models/UserPreferences";
import { cn } from "@/utils/ui";
import { Transition } from "@headlessui/react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { Fragment, useEffect, useMemo } from "react";

interface ToastProps {
  id: string;
  type: FeedbackType;
  message: string;
  duration: number;
}

/**
 * Get spacing classes based on user preference
 */
function getToastSpacingClasses(spacing: UserPreferences["spacing"]): string {
  switch (spacing) {
    case "compact":
      return "gap-2 p-3";
    case "relaxed":
      return "gap-4 p-6";
    default:
      return "gap-3 p-4";
  }
}

/**
 * Get font size classes based on user preference
 */
function getToastFontSizeClasses(fontSize: UserPreferences["fontSize"]): string {
  switch (fontSize) {
    case "small":
      return "text-xs";
    case "large":
      return "text-base";
    default:
      return "text-sm";
  }
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
    // High contrast: add border for better visibility
    return `${baseClasses} border-2 ${
      type === "error"
        ? "border-feedback-error"
        : type === "warning"
        ? "border-feedback-warning"
        : type === "success"
        ? "border-feedback-success"
        : "border-feedback-info"
    }`;
  }

  return baseClasses;
}

/**
 * Accessible toast notification component
 *
 * Features:
 * - ARIA live regions for screen readers
 * - Keyboard navigation (ESC to dismiss)
 * - Respects cognitive accessibility settings (contrast, spacing, fontSize, animations)
 * - Semantic icons and colors
 * - Auto-dismiss with configurable duration
 * - Manual dismiss button
 */
function Toast({ id, type, message, duration }: ToastProps) {
  const { removeFeedback } = useFeedbackContext();
  const { settings } = useCognitiveSettings();

  // Memoize computed classes based on accessibility settings
  const spacingClasses = useMemo(
    () => getToastSpacingClasses(settings.spacing),
    [settings.spacing]
  );

  const fontSizeClasses = useMemo(
    () => getToastFontSizeClasses(settings.fontSize),
    [settings.fontSize]
  );

  const transitionClasses = useMemo(
    () => getToastTransitionClasses(settings.animations),
    [settings.animations]
  );

  const contrastClasses = useMemo(
    () => getToastContrastClasses(settings.contrast, type),
    [settings.contrast, type]
  );

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => removeFeedback(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration]);

  const handleDismiss = () => removeFeedback(id);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") handleDismiss();
  };

  const iconConfig = {
    success: {
      icon: CheckCircle2,
      ariaLabel: "Success",
      bgColor: "bg-feedback-success",
      textColor: "text-white",
      iconColor: "text-white",
    },
    error: {
      icon: AlertCircle,
      ariaLabel: "Error",
      bgColor: "bg-feedback-error",
      textColor: "text-white",
      iconColor: "text-white",
    },
    warning: {
      icon: AlertTriangle,
      ariaLabel: "Warning",
      bgColor: "bg-feedback-warning",
      textColor: "text-white",
      iconColor: "text-white",
    },
    info: {
      icon: Info,
      ariaLabel: "Information",
      bgColor: "bg-feedback-info",
      textColor: "text-white",
      iconColor: "text-white",
    },
  };

  const config = iconConfig[type];
  const Icon = config.icon;

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
          config.bgColor,
          config.textColor
        )}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
        data-testid={`toast-${type}-${id}`}
      >
        <div className={toastStyles.toastIconWrapper}>
          <Icon
            className={cn(toastStyles.toastTypeIcon, config.iconColor)}
            aria-hidden="true"
            data-testid={`toast-icon-${type}`}
          />
        </div>
        <div className={toastStyles.toastContent}>
          <p
            className={cn(toastStyles.toastMessage, fontSizeClasses)}
            data-testid={`toast-message-${id}`}
          >
            {message}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className={cn(
            toastStyles.toastDismissButton,
            !settings.animations && "transition-none"
          )}
          aria-label={`Dismiss ${config.ariaLabel} message`}
          data-testid={`toast-button-dismiss-${id}`}
        >
          <X className={toastStyles.toastDismissIcon} aria-hidden="true" />
        </button>
      </div>
    </Transition>
  );
}

/**
 * Get container gap classes based on spacing preference
 */
function getToastContainerGapClasses(spacing: UserPreferences["spacing"]): string {
  switch (spacing) {
    case "compact":
      return "gap-2";
    case "relaxed":
      return "gap-4";
    default:
      return "gap-3";
  }
}

/**
 * Toast container that renders all active toasts
 * Positioned in a non-intrusive location (top-right by default)
 * Respects cognitive accessibility settings for spacing
 */
export function ToastContainer() {
  const { feedbacks } = useFeedbackContext();
  const { settings } = useCognitiveSettings();

  const containerGapClasses = useMemo(
    () => getToastContainerGapClasses(settings.spacing),
    [settings.spacing]
  );

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
          <Toast
            id={feedback.id}
            type={feedback.type}
            message={feedback.message}
            duration={feedback.duration ?? 5000}
          />
        </div>
      ))}
    </div>
  );
}

// Styles defined as constants (following project guidelines)
const toastStyles = {
  toastContainer: "fixed top-4 right-4 z-50 flex flex-col pointer-events-none",
  toastItem: "pointer-events-auto",
  toastCard:
    "relative flex items-start w-full max-w-md rounded-lg",
  toastIconWrapper: "flex-shrink-0",
  toastTypeIcon: "w-5 h-5",
  toastContent: "flex-1 min-w-0",
  toastMessage: "font-medium leading-normal",
  toastDismissButton:
    "flex-shrink-0 p-1 rounded-md hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent transition-colors",
  toastDismissIcon: "w-4 h-4",
};

