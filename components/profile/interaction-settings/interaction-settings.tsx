"use client";

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { SettingsSection } from "@/components/profile/settings-section";
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
        checked={settings.animations}
        onChange={(checked) => updateSetting("animations", checked)}
        label={textDetail.getText("profile_animations_label")}
        description={textDetail.getText("profile_animations_description")}
        data-testid="profile-animations"
      />

      {/* Focus Mode Setting */}
      <Switch
        checked={settings.focusMode}
        onChange={(checked) => updateSetting("focusMode", checked)}
        label={textDetail.getText("profile_focusmode_label")}
        description={textDetail.getText("profile_focusmode_description")}
        data-testid="profile-focusmode"
      />
    </SettingsSection>
  );
}

InteractionSettings.displayName = "InteractionSettings";

