"use client";

import { useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { SettingsSection } from "@/components/dashboard/settings-section";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/form/select";
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
        <Select>
          <Select.Label htmlFor="focus-duration">
            {textDetail.getText("profile_focus_duration_label")}
          </Select.Label>
          <Select.Field
            id="focus-duration"
            value={settings.focusDuration || 25}
            onChange={(e) => updateSetting("focusDuration", +e.target.value)}
            data-testid="profile-focus-duration"
          >
            <option value="15">{textDetail.getText("profile_focus_duration_option_15")}</option>
            <option value="25">{textDetail.getText("profile_focus_duration_option_25")}</option>
            <option value="30">{textDetail.getText("profile_focus_duration_option_30")}</option>
            <option value="40">{textDetail.getText("profile_focus_duration_option_40")}</option>
          </Select.Field>
          <p className={styles.description}>
            {textDetail.getText("profile_focus_duration_description")}
          </p>
        </Select>

        {/* Break Duration */}
        <Select>
          <Select.Label htmlFor="break-duration">
            {textDetail.getText("profile_break_duration_label")}
          </Select.Label>
          <Select.Field
            id="break-duration"
            value={settings.shortBreakDuration || 5}
            onChange={(e) => updateSetting("shortBreakDuration", +e.target.value)}
            data-testid="profile-break-duration"
          >
            <option value="5">{textDetail.getText("profile_break_duration_option_5")}</option>
            <option value="10">{textDetail.getText("profile_break_duration_option_10")}</option>
          </Select.Field>
          <p className={styles.description}>
            {textDetail.getText("profile_break_duration_description")}
          </p>
        </Select>
      </div>
    </SettingsSection>
  );
}

InteractionSettings.displayName = "InteractionSettings";

const styles = {
  timerSettings: "flex flex-col",
  description: "text-sm text-text-secondary mt-1",
} as const;

