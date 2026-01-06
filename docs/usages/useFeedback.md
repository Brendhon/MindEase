# useFeedback Hook

Accessible toast notification system for user feedback.

## Overview

The `useFeedback` hook provides a simple, accessible way to show toast notifications to users. It follows cognitive accessibility principles:

- **Semantic types**: success, error, warning, info
- **Screen reader support**: ARIA live regions
- **Keyboard navigation**: ESC to dismiss
- **Motion preferences**: Respects `prefers-reduced-motion`
- **Auto-dismiss**: Configurable duration (default: 5 seconds)
- **Manual dismiss**: Button to close immediately

## Usage

### Basic Example

```tsx
"use client";

import { useFeedback } from "@/hooks/useFeedback";

export function MyComponent() {
  const { showFeedback, success, error, warning, info } = useFeedback();

  const handleSave = async () => {
    try {
      await saveData();
      success("Data saved successfully");
    } catch (err) {
      error("Failed to save data");
    }
  };

  return (
    <button onClick={handleSave}>
      Save
    </button>
  );
}
```

### Using Helper Methods

```tsx
const { success, error, warning, info } = useFeedback();

// Success message
success("Task created successfully");

// Error message
error("Failed to create task");

// Warning message
warning("This action cannot be undone");

// Info message
info("New features available");
```

### Custom Duration

```tsx
const { showFeedback } = useFeedback();

// Show for 10 seconds
showFeedback({
  type: "success",
  message: "Processing complete",
  duration: 10000,
});

// Persistent (no auto-dismiss)
showFeedback({
  type: "error",
  message: "Critical error occurred",
  duration: 0, // 0 = no auto-dismiss
});
```

## API

### `useFeedback()`

Returns an object with the following methods:

#### `showFeedback(options)`

Show a feedback message with custom options.

**Parameters:**
- `options.type` (`"success" | "error" | "warning" | "info"`): Semantic type
- `options.message` (`string`): Message to display
- `options.duration` (`number`, optional): Duration in milliseconds (default: 5000). Use `0` for persistent messages.

#### `success(message, duration?)`

Shorthand for success messages.

#### `error(message, duration?)`

Shorthand for error messages.

#### `warning(message, duration?)`

Shorthand for warning messages.

#### `info(message, duration?)`

Shorthand for info messages.

## Accessibility Features

- **ARIA live regions**: Messages are announced to screen readers
- **Role="alert"**: Error messages use assertive live region
- **Keyboard support**: ESC key dismisses the toast
- **Focus management**: Dismiss button is keyboard accessible
- **Motion preferences**: Animations respect `prefers-reduced-motion`
- **Semantic colors**: Uses design tokens for consistent feedback colors

## Implementation Details

The hook uses:
- `FeedbackProvider` context for global state management
- `ToastContainer` component for rendering
- Headless UI `Transition` for accessible animations
- Design tokens for colors and spacing

## See Also

- [Design Tokens Reference](./design-tokens.md)
- [Tailwind Tokens Reference](./tailwind-tokens-reference.md)

