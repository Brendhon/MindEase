"use client";

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { SettingsSection } from "@/components/profile/settings-section";
import { RadioGroup } from "@/components/ui/radio-group";

/**
 * VisualSettings Component - MindEase
 * Visual accessibility settings section (contrast, spacing, fontSize)
 */
export interface VisualSettingsProps {
  /** Test ID for testing */
  "data-testid"?: string;
}

export function VisualSettings({ "data-testid": testId }: VisualSettingsProps) {
  const { settings, updateSetting, textDetail } = useCognitiveSettings();

  return (
    <SettingsSection
      title={textDetail.getText("profile_section_visual")}
      data-testid={testId || "profile-section-visual"}
    >
      {/* Contrast Setting */}
      <RadioGroup
        value={settings.contrast}
        onChange={(value) => updateSetting("contrast", value)}
        label={textDetail.getText("profile_contrast_label")}
        description={textDetail.getText("profile_contrast_description")}
        data-testid="profile-contrast"
      >
        <RadioGroup.Option
          value="normal"
          label={textDetail.getText("profile_contrast_normal")}
          description={textDetail.getText("profile_contrast_normal_desc")}
          data-testid="profile-contrast-normal"
        />
        <RadioGroup.Option
          value="high"
          label={textDetail.getText("profile_contrast_high")}
          description={textDetail.getText("profile_contrast_high_desc")}
          data-testid="profile-contrast-high"
        />
        <RadioGroup.Option
          value="low"
          label={textDetail.getText("profile_contrast_low")}
          description={textDetail.getText("profile_contrast_low_desc")}
          data-testid="profile-contrast-low"
        />
      </RadioGroup>

      {/* Spacing Setting */}
      <RadioGroup
        value={settings.spacing}
        onChange={(value) => updateSetting("spacing", value)}
        label={textDetail.getText("profile_spacing_label")}
        description={textDetail.getText("profile_spacing_description")}
        data-testid="profile-spacing"
      >
        <RadioGroup.Option
          value="compact"
          label={textDetail.getText("profile_spacing_compact")}
          description={textDetail.getText("profile_spacing_compact_desc")}
          data-testid="profile-spacing-compact"
        />
        <RadioGroup.Option
          value="normal"
          label={textDetail.getText("profile_spacing_normal")}
          description={textDetail.getText("profile_spacing_normal_desc")}
          data-testid="profile-spacing-normal"
        />
        <RadioGroup.Option
          value="relaxed"
          label={textDetail.getText("profile_spacing_relaxed")}
          description={textDetail.getText("profile_spacing_relaxed_desc")}
          data-testid="profile-spacing-relaxed"
        />
      </RadioGroup>

      {/* Font Size Setting */}
      <RadioGroup
        value={settings.fontSize}
        onChange={(value) => updateSetting("fontSize", value)}
        label={textDetail.getText("profile_fontsize_label")}
        description={textDetail.getText("profile_fontsize_description")}
        data-testid="profile-fontsize"
      >
        <RadioGroup.Option
          value="small"
          label={textDetail.getText("profile_fontsize_small")}
          description={textDetail.getText("profile_fontsize_small_desc")}
          data-testid="profile-fontsize-small"
        />
        <RadioGroup.Option
          value="normal"
          label={textDetail.getText("profile_fontsize_normal")}
          description={textDetail.getText("profile_fontsize_normal_desc")}
          data-testid="profile-fontsize-normal"
        />
        <RadioGroup.Option
          value="large"
          label={textDetail.getText("profile_fontsize_large")}
          description={textDetail.getText("profile_fontsize_large_desc")}
          data-testid="profile-fontsize-large"
        />
      </RadioGroup>
    </SettingsSection>
  );
}

VisualSettings.displayName = "VisualSettings";

