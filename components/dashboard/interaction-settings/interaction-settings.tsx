"use client";

import { useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/cognitive-settings";
import { useAccessibilityClasses } from "@/hooks/accessibility";
import { useTextDetail } from "@/hooks/accessibility";
import { SettingsSection } from "@/components/dashboard/settings-section";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/form/select";
import { BaseComponentProps } from "@/models/base";
import { cn } from "@/utils/ui";

/**
 * InteractionSettings Component - MindEase
 * Interaction accessibility settings section (animations, focusMode, timer settings)
 */
export interface InteractionSettingsProps extends BaseComponentProps {}

export function InteractionSettings({ "data-testid": testId }: InteractionSettingsProps) {
  const { settings, updateSetting } = useCognitiveSettings();
  
  // Use accessibility classes hook for optimized class generation
  // Only re-renders when spacing changes
  const { spacingClasses } = useAccessibilityClasses();
  
  // Use text detail hook for optimized text helpers
  // Only re-renders when textDetail setting changes
  const textDetail = useTextDetail();

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
            {textDetail.getText("profile_setting_animations")}
          </Switch.Label>
          <Switch.Description data-testid="profile-animations-description">
            {textDetail.getText("profile_setting_animations_desc")}
          </Switch.Description>
        </div>
      </Switch>

      {/* Focus Mode Setting */}
      <Switch
        data-testid="profile-focus-mode"
      >
        <Switch.Toggle checked={settings.focusMode} onChange={(checked) => updateSetting("focusMode", checked)} />
        <div className="flex flex-col">
          <Switch.Label
            onClick={() => updateSetting("focusMode", !settings.focusMode)}
            data-testid="profile-focus-mode-label"
          >
            {textDetail.getText("profile_setting_focus_mode")}
          </Switch.Label>
          <Switch.Description data-testid="profile-focus-mode-description">
            {textDetail.getText("profile_setting_focus_mode_desc")}
          </Switch.Description>
        </div>
      </Switch>

      {/* Timer Settings (Pomodoro Adapted) */}
      <div className={timerSettingsClasses}>
        {/* Focus Duration */}
        <Select>
          <Select.Label htmlFor="focus-duration">
            {textDetail.getText("profile_setting_focus_duration")}
          </Select.Label>
          <Select.Field
            id="focus-duration"
            value={settings.focusDuration || 25}
            onChange={(e) => updateSetting("focusDuration", +e.target.value)}
            data-testid="profile-focus-duration"
          >
            <option value="1">1 minuto - Para testes</option>
            <option value="15">{textDetail.getText("profile_setting_focus_duration_15")}</option>
            <option value="25">{textDetail.getText("profile_setting_focus_duration_25")}</option>
            <option value="30">{textDetail.getText("profile_setting_focus_duration_30")}</option>
            <option value="40">{textDetail.getText("profile_setting_focus_duration_40")}</option>
          </Select.Field>
          <p className={styles.description}>
            {textDetail.getText("profile_setting_focus_duration_desc")}
          </p>
        </Select>

        {/* Break Duration */}
        <Select>
          <Select.Label htmlFor="break-duration">
            {textDetail.getText("profile_setting_break_duration")}
          </Select.Label>
          <Select.Field
            id="break-duration"
            value={settings.shortBreakDuration || 5}
            onChange={(e) => updateSetting("shortBreakDuration", +e.target.value)}
            data-testid="profile-break-duration"
          >
            <option value="1">1 minuto - Para testes</option>
            <option value="5">{textDetail.getText("profile_setting_break_duration_5")}</option>
            <option value="10">{textDetail.getText("profile_setting_break_duration_10")}</option>
          </Select.Field>
          <p className={styles.description}>
            {textDetail.getText("profile_setting_break_duration_desc")}
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

