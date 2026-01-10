"use client";

import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { SettingsSection } from "@/components/profile/settings-section";
import { RadioGroup } from "@/components/ui/radio-group";

/**
 * ContentSettings Component - MindEase
 * Content accessibility settings section (textDetail)
 */
export interface ContentSettingsProps {
  /** Test ID for testing */
  "data-testid"?: string;
}

export function ContentSettings({ "data-testid": testId }: ContentSettingsProps) {
  const { settings, updateSetting, textDetail } = useCognitiveSettings();

  return (
    <SettingsSection
      title={textDetail.getText("profile_section_content")}
      data-testid={testId || "profile-section-content"}
    >
      {/* Text Detail Setting */}
      <RadioGroup
        value={settings.textDetail}
        onChange={(value) => updateSetting("textDetail", value)}
        data-testid="profile-textdetail"
      >
        <RadioGroup.Header>
          <RadioGroup.Label data-testid="profile-textdetail-label">
            {textDetail.getText("profile_textdetail_label")}
          </RadioGroup.Label>
          <RadioGroup.Description data-testid="profile-textdetail-description">
            {textDetail.getText("profile_textdetail_description")}
          </RadioGroup.Description>
        </RadioGroup.Header>
        <RadioGroup.Option
          value="detailed"
          label={textDetail.getText("profile_textdetail_detailed")}
          description={textDetail.getText("profile_textdetail_detailed_desc")}
          data-testid="profile-textdetail-detailed"
        />
        <RadioGroup.Option
          value="summary"
          label={textDetail.getText("profile_textdetail_summary")}
          description={textDetail.getText("profile_textdetail_summary_desc")}
          data-testid="profile-textdetail-summary"
        />
      </RadioGroup>
    </SettingsSection>
  );
}

ContentSettings.displayName = "ContentSettings";

