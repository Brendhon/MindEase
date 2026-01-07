/**
 * Profile Page - MindEase
 * User profile and accessibility settings configuration
 * 
 * Features:
 * - Simple, low cognitive load interface
 * - Accessible design (WCAG compliant)
 * - Keyboard navigation support
 * - Clear visual hierarchy
 * - Uses own accessibility settings (self-referential)
 */
"use client";

import { useMemo } from "react";
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { SettingsSection } from "@/components/profile/settings-section";
import { Switch } from "@/components/ui/switch";
import { RadioGroup } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/ui";
import { RotateCcw } from "lucide-react";

export default function ProfilePage() {
  const {
    settings,
    updateSetting,
    resetSettings,
    isLoading,
    error,
    spacingClasses,
    fontSizeClasses,
    animationClasses,
    textDetail,
  } = useCognitiveSettings();

  // Generate main container classes with spacing preference
  const mainClasses = useMemo(
    () => cn(styles.main, spacingClasses.padding, spacingClasses.gap),
    [spacingClasses.padding, spacingClasses.gap]
  );

  // Generate title classes with fontSize preference
  const titleClasses = useMemo(
    () => cn(styles.title, fontSizeClasses["2xl"]),
    [fontSizeClasses["2xl"]]
  );

  // Generate description classes with fontSize preference
  const descriptionClasses = useMemo(
    () => cn(styles.description, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  // Generate error classes with fontSize preference
  const errorClasses = useMemo(
    () => cn(styles.error, fontSizeClasses.sm),
    [fontSizeClasses.sm]
  );

  const handleReset = () => {
    if (confirm(textDetail.getText("profile_reset_button_aria"))) {
      resetSettings();
    }
  };

  if (isLoading) {
    return (
      <div className={cn(styles.container, animationClasses)} data-testid="profile-page-container">
        <div className={mainClasses}>
          <p className={cn(styles.loading, fontSizeClasses.base)} data-testid="profile-loading">
            {textDetail.getText("profile_loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(styles.container, animationClasses)} data-testid="profile-page-container">
      <main className={mainClasses} role="main">
        <header className={styles.header}>
          <h1 className={titleClasses} data-testid="profile-title">
            {textDetail.getText("profile_title")}
          </h1>
          <p className={descriptionClasses} data-testid="profile-description">
            {textDetail.getText("profile_description")}
          </p>
        </header>

        {error && (
          <div className={errorClasses} role="alert" data-testid="profile-error">
            {textDetail.getText("profile_error")}
          </div>
        )}

        <div className={cn(styles.content, spacingClasses.gap)}>
          {/* Visual Settings Section */}
          <SettingsSection
            title={textDetail.getText("profile_section_visual")}
            data-testid="profile-section-visual"
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

          {/* Interaction Settings Section */}
          <SettingsSection
            title={textDetail.getText("profile_section_interaction")}
            data-testid="profile-section-interaction"
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

          {/* Content Settings Section */}
          <SettingsSection
            title={textDetail.getText("profile_section_content")}
            data-testid="profile-section-content"
          >
            {/* Text Detail Setting */}
            <RadioGroup
              value={settings.textDetail}
              onChange={(value) => updateSetting("textDetail", value)}
              label={textDetail.getText("profile_textdetail_label")}
              description={textDetail.getText("profile_textdetail_description")}
              data-testid="profile-textdetail"
            >
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
        </div>

        {/* Reset Button */}
        <div className={styles.footer}>
          <Button
            variant="secondary"
            size="md"
            onClick={handleReset}
            className={styles.resetButton}
            aria-label={textDetail.getText("profile_reset_button_aria")}
            data-testid="profile-reset-button"
          >
            <Button.Icon icon={RotateCcw} position="left" size="md" />
            <Button.Text>{textDetail.getText("profile_reset_button")}</Button.Text>
          </Button>
        </div>
      </main>
    </div>
  );
}

/**
 * Profile Page Styles - MindEase
 * Centralized styles for profile page
 */

export const styles = {
  container: "flex min-h-full w-full bg-bg-secondary",
  main: "flex flex-col w-full max-w-4xl mx-auto",
  header: "flex flex-col",
  title: "font-semibold text-text-primary leading-tight",
  description: "text-text-secondary leading-relaxed mt-2",
  content: "flex flex-col w-full",
  footer: "flex justify-end mt-6",
  resetButton: "",
  loading: "text-text-secondary text-center",
  error: "bg-action-danger/10 text-action-danger border border-action-danger rounded-lg p-4",
} as const;
