import { useCognitiveSettingsContext } from "@/contexts/cognitive-settings-context";

/**
 * useCognitiveSettings Hook - MindEase
 * 
 * Hook for reading and updating cognitive accessibility settings.
 * 
 * Provides access to current user preferences and methods to update them.
 * Changes are automatically applied to the DOM via the CognitiveSettingsProvider.
 * 
 * @example
 * ```tsx
 * // Reading settings
 * function MyComponent() {
 *   const { settings } = useCognitiveSettings();
 *   return <div>Contrast: {settings.contrast}</div>;
 * }
 * 
 * // Updating settings
 * function SettingsPanel() {
 *   const { settings, updateSetting, resetSettings } = useCognitiveSettings();
 *   
 *   return (
 *     <button onClick={() => updateSetting("contrast", "high")}>
 *       High Contrast
 *     </button>
 *   );
 * }
 * ```
 * 
 * @throws Error if used outside CognitiveSettingsProvider
 */
export function useCognitiveSettings() {
  const { settings, updateSetting, updateSettings, resetSettings } = useCognitiveSettingsContext();

  return {
    settings,
    updateSetting,
    updateSettings,
    resetSettings,
  };
}
