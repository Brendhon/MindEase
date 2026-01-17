"use client";

import { SettingsSection } from "@/components/dashboard";
import { RadioGroup } from "@/components/ui";
import { useCognitiveSettings } from "@/hooks/cognitive-settings";
import { useTextDetail } from "@/hooks/accessibility";
import { BaseComponentProps } from "@/models/base";

/**
 * ContentSettings Component - MindEase
 * Content accessibility settings section (textDetail)
 */
export interface ContentSettingsProps extends BaseComponentProps {}

export function ContentSettings({ "data-testid": testId }: ContentSettingsProps) {
  const { settings, updateSetting } = useCognitiveSettings();
  const { getText } = useTextDetail();

  return (
    <SettingsSection
      title={getText("profile_section_content")}
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
            {getText("profile_setting_text_detail")}
          </RadioGroup.Label>
          <RadioGroup.Description data-testid="profile-textdetail-description">
            {getText("profile_setting_text_detail_desc")}
          </RadioGroup.Description>
        </RadioGroup.Header>
        <RadioGroup.Option
          value="detailed"
          label={getText("profile_setting_text_detail_detailed")}
          description={getText("profile_setting_text_detail_detailed_desc")}
          data-testid="profile-textdetail-detailed"
        />
        <RadioGroup.Option
          value="summary"
          label={getText("profile_setting_text_detail_summary")}
          description={getText("profile_setting_text_detail_summary_desc")}
          data-testid="profile-textdetail-summary"
        />
      </RadioGroup>
    </SettingsSection>
  );
}

ContentSettings.displayName = "ContentSettings";

