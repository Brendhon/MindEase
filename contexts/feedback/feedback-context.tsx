import type { FeedbackMessage } from "@/hooks/feedback";
import { createContext, useContext } from "react";

interface FeedbackContextValue {
  feedbacks: FeedbackMessage[];
  addFeedback: (feedback: FeedbackMessage) => void;
  removeFeedback: (id: string) => void;
}

export const FeedbackContext = createContext<FeedbackContextValue | undefined>(
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

