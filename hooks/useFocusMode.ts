import { useState, useCallback, useEffect } from "react";

/**
 * useFocusMode Hook - MindEase
 * Hook for managing focus mode state
 */
export function useFocusMode(initialState = false) {
  const [isFocusMode, setIsFocusMode] = useState(initialState);

  const toggleFocusMode = useCallback(() => {
    setIsFocusMode((prev) => !prev);
  }, []);

  const enableFocusMode = useCallback(() => {
    setIsFocusMode(true);
  }, []);

  const disableFocusMode = useCallback(() => {
    setIsFocusMode(false);
  }, []);

  useEffect(() => {
    if (isFocusMode) {
      document.body.setAttribute("data-focus-mode", "true");
    } else {
      document.body.removeAttribute("data-focus-mode");
    }
  }, [isFocusMode]);

  return {
    isFocusMode,
    toggleFocusMode,
    enableFocusMode,
    disableFocusMode,
  };
}

