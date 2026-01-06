"use client";

import { Fragment, useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import type { FeedbackType } from "@/hooks/useFeedback";
import { useFeedbackContext } from "@/contexts/feedback-context";

interface ToastProps {
  id: string;
  type: FeedbackType;
  message: string;
  duration: number;
}

/**
 * Accessible toast notification component
 *
 * Features:
 * - ARIA live regions for screen readers
 * - Keyboard navigation (ESC to dismiss)
 * - Respects prefers-reduced-motion
 * - Semantic icons and colors
 * - Auto-dismiss with configurable duration
 * - Manual dismiss button
 */
function Toast({ id, type, message, duration }: ToastProps) {
  const { removeFeedback } = useFeedbackContext();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion safely (client-side only)
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        removeFeedback(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, removeFeedback]);

  const handleDismiss = () => {
    removeFeedback(id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleDismiss();
    }
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

  // Styles defined as constants (following project guidelines)
  const toastStyles = {
    container:
      "relative flex items-start gap-3 w-full max-w-md p-4 rounded-lg shadow-medium",
    iconContainer: "flex-shrink-0",
    content: "flex-1 min-w-0",
    message: "text-sm font-medium leading-normal",
    dismissButton:
      "flex-shrink-0 p-1 rounded-md hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent transition-colors",
  };

  return (
    <Transition
      appear
      show
      as={Fragment}
      enter={
        prefersReducedMotion
          ? "transition-opacity duration-fast"
          : "transition-all duration-normal ease-base"
      }
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave={
        prefersReducedMotion
          ? "transition-opacity duration-fast"
          : "transition-all duration-normal ease-base"
      }
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div
        role="alert"
        aria-live={type === "error" ? "assertive" : "polite"}
        aria-atomic="true"
        className={`${toastStyles.container} ${config.bgColor} ${config.textColor}`}
        onKeyDown={handleKeyDown}
        tabIndex={-1}
      >
        <div className={toastStyles.iconContainer}>
          <Icon
            className={`w-5 h-5 ${config.iconColor}`}
            aria-hidden="true"
          />
        </div>
        <div className={toastStyles.content}>
          <p className={toastStyles.message}>{message}</p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className={toastStyles.dismissButton}
          aria-label={`Dismiss ${config.ariaLabel} message`}
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </Transition>
  );
}

/**
 * Toast container that renders all active toasts
 * Positioned in a non-intrusive location (top-right by default)
 */
export function ToastContainer() {
  const { feedbacks } = useFeedbackContext();

  // Styles defined as constants
  const containerStyles =
    "fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none";

  if (feedbacks.length === 0) {
    return null;
  }

  return (
    <div
      className={containerStyles}
      aria-live="polite"
      aria-atomic="false"
      role="region"
      aria-label="Notifications"
    >
      {feedbacks.map((feedback) => (
        <div key={feedback.id} className="pointer-events-auto">
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

