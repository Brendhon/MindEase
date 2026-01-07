# Accessibility Refactor Migration Guide

**Date:** January 2026  
**Version:** 2.0

## Overview

This document describes the major refactoring of the cognitive accessibility system in MindEase, moving from a CSS-based approach to a React/Tailwind-based approach with Firestore persistence.

## What Changed

### Architecture

**Before:**
- CSS variables + data-attributes for styling
- DOM manipulation via `applyAccessibilitySettings()`
- MutationObserver for sync
- Settings stored in DOM only

**After:**
- Tailwind dynamic classes for styling
- React state management only
- Firestore persistence with auto-sync
- JSON-based content system

### Key Benefits

1. **Simpler:** 1 hook instead of multiple, no DOM manipulation
2. **Type-safe:** Full TypeScript support end-to-end
3. **Maintainable:** Follows React patterns, easier to test
4. **Cross-device:** Settings sync via Firestore
5. **Performance:** No MutationObserver overhead

## New Structure

### Files Created

```
services/user-preferences/
├── user-preferences.ts       # Firestore CRUD service
└── index.ts                  # Barrel export

content/
└── accessibility-texts.json  # Detailed/summary text content

utils/accessibility/
├── content.ts                # Text content helpers
└── tailwind-classes.ts       # Dynamic Tailwind class generators
```

### Files Modified

```
models/UserPreferences.ts          # Added metadata, moved DEFAULT_ACCESSIBILITY_SETTINGS
providers/cognitive-settings-provider.tsx  # Firestore integration, removed DOM manipulation
contexts/cognitive-settings-context.tsx    # Added isLoading, error
hooks/useCognitiveSettings.ts             # Consolidated all functionality
app/globals.css                           # Removed data-attribute CSS (~150 lines)
```

### Files Removed

```
hooks/useTextDetail.ts         # Merged into useCognitiveSettings
```

### Functions Deprecated

```typescript
// In utils/accessibility/accessibility.ts
- applyAccessibilitySettings()
- readAccessibilitySettingsFromDOM()
- getAccessibilityObserverConfig()
- DEFAULT_ACCESSIBILITY_SETTINGS (moved to models/UserPreferences.ts)
```

## Migration Guide for Developers

### Using the New Hook

**Before:**
```tsx
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";
import { useTextDetail } from "@/hooks/useTextDetail";

function MyComponent() {
  const { settings } = useCognitiveSettings();
  const { render } = useTextDetail();
  
  return (
    <div data-font-size={settings.fontSize}>
      {render("Full text here", "Short")}
    </div>
  );
}
```

**After:**
```tsx
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";

function MyComponent() {
  const { 
    fontSizeClasses, 
    textDetail 
  } = useCognitiveSettings();
  
  return (
    <div className={fontSizeClasses.base}>
      {textDetail.render("Full text here", "Short")}
    </div>
  );
}
```

### Using Text Content System

**Before:**
```tsx
<button>
  {textDetail.isSummary ? "Save" : "Save Changes"}
</button>
```

**After:**
```tsx
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";

function MyComponent() {
  const { textDetail } = useCognitiveSettings();
  
  return (
    <button>
      {textDetail.getText("button_save")}
    </button>
  );
}
```

Add new content keys in `content/accessibility-texts.json`:
```json
{
  "detailed": {
    "button_save": "Save Changes"
  },
  "summary": {
    "button_save": "Save"
  }
}
```

### Using Tailwind Classes

**Before:**
```css
/* globals.css */
[data-spacing="relaxed"] {
  --space-4: 1.5rem;
}
```

**After:**
```tsx
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";

function MyComponent() {
  const { spacingClasses } = useCognitiveSettings();
  
  return (
    <div className={spacingClasses.padding}>
      Content with dynamic padding
    </div>
  );
}
```

### Applying Multiple Settings

```tsx
import { useCognitiveSettings } from "@/hooks/useCognitiveSettings";

function MyComponent() {
  const { 
    contrastClasses,
    fontSizeClasses,
    animationClasses,
    spacingClasses 
  } = useCognitiveSettings();
  
  return (
    <div className={cn(
      contrastClasses,
      fontSizeClasses.base,
      animationClasses,
      spacingClasses.padding
    )}>
      Accessible content
    </div>
  );
}

// Or use the convenience function:
function MyComponent() {
  const { getCombinedClasses } = useCognitiveSettings();
  
  return (
    <div className={getCombinedClasses("base")}>
      Accessible content
    </div>
  );
}
```

## Data Persistence

Settings are now automatically saved to Firestore:

- **Collection:** `user-preferences`
- **Document ID:** `userId` (from NextAuth session)
- **Auto-save:** Debounced 500ms after changes
- **Auto-load:** On mount for authenticated users
- **Isolated mode:** Still supported for Storybook (no Firestore)

## Testing Considerations

### Storybook Stories

Stories continue to work with the `isolated` prop:

```tsx
<CognitiveSettingsProvider 
  isolated={true} 
  initialSettings={{ contrast: 'high' }}
>
  <Component />
</CognitiveSettingsProvider>
```

### Unit Tests

Mock the hook:

```tsx
jest.mock('@/hooks/useCognitiveSettings', () => ({
  useCognitiveSettings: () => ({
    settings: {
      contrast: 'normal',
      spacing: 'normal',
      fontSize: 'normal',
      animations: true,
      focusMode: false,
      textDetail: 'detailed',
    },
    fontSizeClasses: { base: 'text-base' },
    // ... other mock values
  }),
}));
```

## Breaking Changes

### For Component Authors

1. **Remove data-attributes:** Components no longer need to read `data-contrast`, `data-spacing`, etc.
2. **Import from useCognitiveSettings:** All accessibility functionality is now in one hook
3. **Use Tailwind classes:** Replace CSS-based styling with dynamic Tailwind classes

### For Style Authors

1. **No more data-attribute CSS:** Remove any CSS that targets `[data-contrast]`, `[data-spacing]`, etc.
2. **Use Tailwind utilities:** Leverage Tailwind's built-in utilities instead of custom CSS

## Rollback Plan

If issues arise, the previous implementation is preserved in git history:

```bash
# Revert to pre-refactor state
git revert <commit-hash>

# Or checkout specific files
git checkout <commit-hash> -- hooks/useTextDetail.ts
git checkout <commit-hash> -- utils/accessibility/accessibility.ts
git checkout <commit-hash> -- app/globals.css
```

## Performance Impact

**Improvements:**
- ❌ No MutationObserver overhead
- ✅ Memoized class generation
- ✅ React's optimized re-rendering
- ✅ Debounced Firestore writes

**Considerations:**
- Initial load queries Firestore (cached after first load)
- 500ms debounce on saves (configurable if needed)

## Future Enhancements

1. **Offline support:** Add local storage fallback
2. **Real-time sync:** Listen to Firestore changes for multi-tab sync
3. **Preset profiles:** Allow users to save/load accessibility presets
4. **Analytics:** Track which settings are most used

## Questions?

For questions or issues with this migration:
1. Check this document
2. Review the plan file: `.cursor/plans/simplificar_acessibilidade_cognitiva_44d21176.plan.md`
3. Check git history for implementation details
4. Consult the team lead

---

**Migration completed:** January 2026  
**Status:** ✅ Complete - All tests passing, no linter errors

