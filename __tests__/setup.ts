import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock accessibility hooks
vi.mock('@/hooks/accessibility', () => ({
  useAccessibilityClasses: () => ({
    spacingClasses: {
      padding: 'p-4',
      gap: 'gap-2',
      margin: 'm-4',
    },
    fontSizeClasses: {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
    },
    contrastClasses: 'contrast-normal',
    animationClasses: 'animate-normal',
  }),
  useTextDetail: () => ({
    getText: (key: string) => key, // Returns the key as fallback for testing
  }),
}));

// Mock cognitive settings hook
vi.mock('@/hooks/cognitive-settings', () => ({
  useCognitiveSettings: () => ({
    settings: {
      fontSize: 'base',
      contrast: 'normal',
      spacing: 'normal',
      animations: 'normal',
      complexity: 'normal',
      focusMode: false,
      textDetail: 'normal',
    },
    updateSettings: vi.fn(),
  }),
}));

// Mock auth hook
vi.mock('@/hooks/auth', () => ({
  useAuth: () => ({
    signIn: vi.fn(),
    signOut: vi.fn(),
    isAuthenticated: false,
    isLoading: false,
    user: null,
  }),
}));

// Mock feedback hook
vi.mock('@/hooks/feedback', () => ({
  useFeedback: () => ({
    showToast: vi.fn(),
    showAlert: vi.fn(),
    showError: vi.fn(),
    showSuccess: vi.fn(),
  }),
}));

// Mock dialog hook
vi.mock('@/hooks/dialog', () => ({
  useDialog: () => ({
    openDialog: vi.fn(),
    closeDialog: vi.fn(),
    isOpen: false,
  }),
}));

// Mock tasks hook
vi.mock('@/hooks/tasks', () => ({
  useTasks: () => ({
    tasks: [],
    isLoading: false,
    error: null,
    createTask: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  }),
}));

// Mock timer hooks
vi.mock('@/hooks/timer', () => ({
  useFocusTimer: () => ({
    start: vi.fn(),
    pause: vi.fn(),
    reset: vi.fn(),
    isRunning: false,
    remainingTime: 0,
  }),
  useBreakTimer: () => ({
    start: vi.fn(),
    pause: vi.fn(),
    reset: vi.fn(),
    isRunning: false,
    remainingTime: 0,
  }),
}));
