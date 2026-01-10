"use client";

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { SettingsSection } from "@/components/dashboard/settings-section";
import { Switch } from "@/components/ui/switch";

/**
 * InteractionSettings Component - MindEase
 * Interaction accessibility settings section (animations, focusMode)
 */
export interface InteractionSettingsProps {
  /** Test ID for testing */
  "data-testid"?: string;
}

export function InteractionSettings({ "data-testid": testId }: InteractionSettingsProps) {
  const { settings, updateSetting, textDetail } = useCognitiveSettings();

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
    </SettingsSection>
  );
}

InteractionSettings.displayName = "InteractionSettings";

