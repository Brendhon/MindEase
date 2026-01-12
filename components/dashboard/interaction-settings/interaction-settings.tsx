"use client";

import { useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { SettingsSection } from "@/components/dashboard/settings-section";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/form/input";
import { InputLabel } from "@/components/form/input/input-label";
import { InputField } from "@/components/form/input/input-field";
import { cn } from "@/utils/ui";

/**
 * InteractionSettings Component - MindEase
 * Interaction accessibility settings section (animations, focusMode, timer settings)
 */
export interface InteractionSettingsProps {
  /** Test ID for testing */
  "data-testid"?: string;
}

export function InteractionSettings({ "data-testid": testId }: InteractionSettingsProps) {
  const { settings, updateSetting, textDetail, spacingClasses } = useCognitiveSettings();

  const handleFocusDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= 120) {
      updateSetting("focusDuration", value);
    }
  };

  const handleBreakDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0 && value <= 60) {
      updateSetting("shortBreakDuration", value);
    }
  };

  const timerSettingsClasses = useMemo(
    () => cn(styles.timerSettings, spacingClasses.gap),
    [spacingClasses.gap]
  );

  return (
    <SettingsSection
      title={textDetail.getText("profile_section_interaction")}
      data-testid={testId || "profile-section-interaction"}
    >
      {/* Animations Setting */}
      <Switch
        data-testid="profile-animations"
      >
        <Switch.Toggle checked={settings.animations} onChange={(checked) => updateSetting("animations", checked)} />
        <div className="flex flex-col">
          <Switch.Label
            onClick={() => updateSetting("animations", !settings.animations)}
            data-testid="profile-animations-label"
          >
            {textDetail.getText("profile_animations_label")}
          </Switch.Label>
          <Switch.Description data-testid="profile-animations-description">
            {textDetail.getText("profile_animations_description")}
          </Switch.Description>
        </div>
      </Switch>

      {/* Focus Mode Setting */}
      <Switch
        data-testid="profile-focusmode"
      >
        <Switch.Toggle checked={settings.focusMode} onChange={(checked) => updateSetting("focusMode", checked)} />
        <div className="flex flex-col">
          <Switch.Label
            onClick={() => updateSetting("focusMode", !settings.focusMode)}
            data-testid="profile-focusmode-label"
          >
            {textDetail.getText("profile_focusmode_label")}
          </Switch.Label>
          <Switch.Description data-testid="profile-focusmode-description">
            {textDetail.getText("profile_focusmode_description")}
          </Switch.Description>
        </div>
      </Switch>

      {/* Timer Settings (Pomodoro Adapted) */}
      <div className={timerSettingsClasses}>
        {/* Focus Duration */}
        <Input>
          <InputLabel htmlFor="focus-duration">
            {textDetail.getText("profile_focus_duration_label")}
          </InputLabel>
          <InputField
            id="focus-duration"
            type="number"
            min="5"
            max="120"
            step="5"
            value={settings.focusDuration || 25}
            onChange={handleFocusDurationChange}
            data-testid="profile-focus-duration"
          />
          <p className={styles.description}>
            {textDetail.getText("profile_focus_duration_description")}
          </p>
        </Input>

        {/* Break Duration */}
        <Input>
          <InputLabel htmlFor="break-duration">
            {textDetail.getText("profile_break_duration_label")}
          </InputLabel>
          <InputField
            id="break-duration"
            type="number"
            min="1"
            max="60"
            step="1"
            value={settings.shortBreakDuration || 5}
            onChange={handleBreakDurationChange}
            data-testid="profile-break-duration"
          />
          <p className={styles.description}>
            {textDetail.getText("profile_break_duration_description")}
          </p>
        </Input>
      </div>
    </SettingsSection>
  );
}

InteractionSettings.displayName = "InteractionSettings";

const styles = {
  timerSettings: "flex flex-col",
  description: "text-sm text-text-secondary mt-1",
} as const;

