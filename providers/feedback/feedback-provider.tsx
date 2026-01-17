"use client";

import { FeedbackContext } from "@/contexts/feedback";
import { FeedbackMessage } from "@/hooks/feedback";
import { useCallback, useState } from "react";

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
