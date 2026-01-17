"use client";

import { SettingsSection } from "@/components/dashboard";
import { RadioGroup } from "@/components/ui";
import { useCognitiveSettings } from "@/hooks/cognitive-settings";
import { useTextDetail } from "@/hooks/accessibility";

/**
 * VisualSettings Component - MindEase
 * Visual accessibility settings section (contrast, spacing, fontSize)
 */
export interface VisualSettingsProps {
  /** Test ID for testing */
  "data-testid"?: string;
}

export function VisualSettings({ "data-testid": testId }: VisualSettingsProps) {
  const { settings, updateSetting } = useCognitiveSettings();
  const { getText } = useTextDetail();

  return (
    <SettingsSection
      title={getText("profile_section_visual")}
      data-testid={testId || "profile-section-visual"}
    >
      {/* Contrast Setting */}
      <RadioGroup
        value={settings.contrast}
        onChange={(value) => updateSetting("contrast", value)}
        data-testid="profile-contrast"
      >
        <RadioGroup.Header>
          <RadioGroup.Label data-testid="profile-contrast-label">
            {getText("profile_setting_contrast")}
          </RadioGroup.Label>
          <RadioGroup.Description data-testid="profile-contrast-description">
            {getText("profile_setting_contrast_desc")}
          </RadioGroup.Description>
        </RadioGroup.Header>
        <RadioGroup.Option
          value="normal"
          label={getText("profile_setting_contrast_normal")}
          description={getText("profile_setting_contrast_normal_desc")}
          data-testid="profile-contrast-normal"
        />
        <RadioGroup.Option
          value="high"
          label={getText("profile_setting_contrast_high")}
          description={getText("profile_setting_contrast_high_desc")}
          data-testid="profile-contrast-high"
        />
        <RadioGroup.Option
          value="low"
          label={getText("profile_setting_contrast_low")}
          description={getText("profile_setting_contrast_low_desc")}
          data-testid="profile-contrast-low"
        />
      </RadioGroup>

      {/* Spacing Setting */}
      <RadioGroup
        value={settings.spacing}
        onChange={(value) => updateSetting("spacing", value)}
        data-testid="profile-spacing"
      >
        <RadioGroup.Header>
          <RadioGroup.Label data-testid="profile-spacing-label">
            {getText("profile_setting_spacing")}
          </RadioGroup.Label>
          <RadioGroup.Description data-testid="profile-spacing-description">
            {getText("profile_setting_spacing_desc")}
          </RadioGroup.Description>
        </RadioGroup.Header>
        <RadioGroup.Option
          value="compact"
            label={getText("profile_setting_spacing_compact")}
          description={getText("profile_setting_spacing_compact_desc")}
          data-testid="profile-spacing-compact"
        />
        <RadioGroup.Option
          value="normal"
          label={getText("profile_setting_spacing_normal")}
          description={getText("profile_setting_spacing_normal_desc")}
          data-testid="profile-spacing-normal"
        />
        <RadioGroup.Option
          value="relaxed"
          label={getText("profile_setting_spacing_relaxed")}
          description={getText("profile_setting_spacing_relaxed_desc")}
          data-testid="profile-spacing-relaxed"
        />
      </RadioGroup>

      {/* Font Size Setting */}
      <RadioGroup
        value={settings.fontSize}
        onChange={(value) => updateSetting("fontSize", value)}
        data-testid="profile-fontsize"
      >
        <RadioGroup.Header>
          <RadioGroup.Label data-testid="profile-fontsize-label">
            {getText("profile_setting_font_size")}
          </RadioGroup.Label>
          <RadioGroup.Description data-testid="profile-fontsize-description">
            {getText("profile_setting_font_size_desc")}
          </RadioGroup.Description>
        </RadioGroup.Header>
        <RadioGroup.Option
          value="small"
          label={getText("profile_setting_font_size_small")}
          description={getText("profile_setting_font_size_small_desc")}
          data-testid="profile-fontsize-small"
        />
        <RadioGroup.Option
          value="normal"
          label={getText("profile_setting_font_size_normal")}
          description={getText("profile_setting_font_size_normal_desc")}
          data-testid="profile-fontsize-normal"
        />
        <RadioGroup.Option
          value="large"
          label={getText("profile_setting_font_size_large")}
          description={getText("profile_setting_font_size_large_desc")}
          data-testid="profile-fontsize-large"
        />
      </RadioGroup>
    </SettingsSection>
  );
}

VisualSettings.displayName = "VisualSettings";

