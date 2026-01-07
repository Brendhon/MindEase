/**
 * Accessibility Content Utilities - MindEase
 * Type-safe helpers for accessing detailed/summary text content
 */
import accessibilityTexts from "@/content/accessibility-texts.json";
import { UserPreferences } from "@/models/UserPreferences";

/**
 * Available text keys in the accessibility content system
 */
export type AccessibilityTextKey = keyof typeof accessibilityTexts.detailed;

/**
 * Get text content based on text detail mode
 * 
 * @param key - Content key from accessibility-texts.json
 * @param mode - Text detail mode (detailed or summary)
 * @returns The appropriate text content
 * 
 * @example
 * ```tsx
 * const text = getAccessibilityText("welcome", "summary");
 * // Returns: "Bem-vindo"
 * ```
 */
export function getAccessibilityText(
  key: AccessibilityTextKey,
  mode: UserPreferences["textDetail"]
): string {
  const content = accessibilityTexts[mode];
  
  if (!content || !(key in content)) {
    console.warn(`Accessibility text key "${key}" not found for mode "${mode}"`);
    // Fallback to detailed mode if key not found in current mode
    return accessibilityTexts.detailed[key] || key;
  }
  
  return content[key as keyof typeof content];
}

/**
 * Create a text getter function bound to a specific mode
 * Useful for components that always use the same mode
 * 
 * @param mode - Text detail mode to bind to
 * @returns Function that gets text for the bound mode
 * 
 * @example
 * ```tsx
 * const getText = createTextGetter("summary");
 * const welcomeText = getText("welcome"); // "Bem-vindo"
 * ```
 */
export function createTextGetter(mode: UserPreferences["textDetail"]) {
  return (key: AccessibilityTextKey): string => {
    return getAccessibilityText(key, mode);
  };
}

/**
 * Get all available text keys
 * Useful for debugging or generating documentation
 */
export function getAvailableTextKeys(): AccessibilityTextKey[] {
  return Object.keys(accessibilityTexts.detailed) as AccessibilityTextKey[];
}

/**
 * Check if a text key exists in the content system
 */
export function hasTextKey(key: string): key is AccessibilityTextKey {
  return key in accessibilityTexts.detailed;
}

