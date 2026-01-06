"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { FeedbackMessage } from "@/hooks/useFeedback";

interface FeedbackContextValue {
  feedbacks: FeedbackMessage[];
  addFeedback: (feedback: FeedbackMessage) => void;
  removeFeedback: (id: string) => void;
}

const FeedbackContext = createContext<FeedbackContextValue | undefined>(
  undefined
);

/**
 * Hook to access feedback context
 * @throws Error if used outside FeedbackProvider
 */
export function useFeedbackContext(): FeedbackContextValue {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedbackContext must be used within FeedbackProvider");
  }
  return context;
}

interface FeedbackProviderProps {
  children: React.ReactNode;
}

/**
 * Provider for global feedback/toast management
 * Manages state and lifecycle of feedback messages
 */
export function FeedbackProvider({ children }: FeedbackProviderProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackMessage[]>([]);

  const addFeedback = useCallback((feedback: FeedbackMessage) => {
    setFeedbacks((prev) => [...prev, feedback]);
  }, []);

  const removeFeedback = useCallback((id: string) => {
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return (
    <FeedbackContext.Provider
      value={{
        feedbacks,
        addFeedback,
        removeFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
}

