"use client";

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { Button } from "@/components/ui";
import { RotateCcw } from "lucide-react";
import { useTextDetail } from "@/hooks/useTextDetail";

/**
 * ProfileResetButton Component - MindEase
 * Reset button for restoring default accessibility settings
 */
export interface ProfileResetButtonProps {
  /** Test ID for testing */
  "data-testid"?: string;
}

export function ProfileResetButton({ "data-testid": testId }: ProfileResetButtonProps) {
  const { resetSettings } = useCognitiveSettings();
  const { getText } = useTextDetail();

  return (
    <div className={styles.footer} data-testid={testId || "profile-reset-button-container"}>
      <Button
        variant="secondary"
        size="md"
        onClick={resetSettings}
        className={styles.resetButton}
        aria-label={getText("profile_reset_button_aria")}
        data-testid={testId || "profile-reset-button"}
      >
        <Button.Icon icon={RotateCcw} position="left" size="md" />
        <Button.Text>{getText("profile_reset_button")}</Button.Text>
      </Button>
    </div>
  );
}

ProfileResetButton.displayName = "ProfileResetButton";

/**
 * ProfileResetButton Styles - MindEase
 * Centralized styles for profile reset button component
 */

export const styles = {
  footer: "flex justify-end mt-6",
  resetButton: "",
} as const;

