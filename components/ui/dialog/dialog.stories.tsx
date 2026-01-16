import { AuthProvider } from '@/providers/auth-provider';
import { CognitiveSettingsProvider } from '@/providers/cognitive-settings-provider';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import { fn } from 'storybook/test';
import { Button } from '../button';
import { Dialog } from './index';

const meta = {
  title: 'Components/UI/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <SessionProvider>
        <AuthProvider>
          <CognitiveSettingsProvider>
            <Story />
          </CognitiveSettingsProvider>
        </AuthProvider>
      </SessionProvider>
    ),
  ],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Controls dialog visibility',
    },
    title: {
      control: 'text',
      description: 'Dialog title',
    },
    onClose: {
      action: 'closed',
      description: 'Callback when dialog is closed',
    },
  },
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Dialog component with accessible modal functionality.
 * Uses Headless UI for keyboard navigation and focus management.
 */

// Basic dialog
export const Basic: Story = {
  args: {
    isOpen: true,
    title: 'Basic Dialog',
    children: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          This is a basic dialog with some content. You can close it by clicking outside or pressing ESC.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={fn()}>
            <Button.Text>Cancel</Button.Text>
          </Button>
          <Button variant="primary" onClick={fn()}>
            <Button.Text>Confirm</Button.Text>
          </Button>
        </div>
      </div>
    ),
  },
};

// Dialog with prevent close
export const PreventClose: Story = {
  args: {
    isOpen: true,
    title: 'Prevent Close Dialog',
    children: <div>This dialog cannot be closed by clicking outside or pressing ESC.</div>,
    preventClose: true,
  },
};

// Dialog with form
export const WithForm: Story = {
  args: {
    isOpen: true,
    title: 'Create Task',
    children: (
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="w-full px-3 py-2 border border-border-subtle rounded-md bg-surface-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-action-primary"
            placeholder="Enter task title"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full px-3 py-2 border border-border-subtle rounded-md bg-surface-primary text-text-primary focus:outline-none focus:ring-2 focus:ring-action-primary"
            placeholder="Enter task description"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={fn()}>
            <Button.Text>Cancel</Button.Text>
          </Button>
          <Button type="submit" variant="primary">
            <Button.Text>Create</Button.Text>
          </Button>
        </div>
      </form>
    ),
  },
};

// Dialog with confirmation
export const Confirmation: Story = {
  args: {
    isOpen: true,
    title: 'Confirm Action',
    children: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          Are you sure you want to delete this item? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={fn()}>
            <Button.Text>Cancel</Button.Text>
          </Button>
          <Button variant="danger" onClick={fn()}>
            <Button.Icon icon={XCircle} position="left" />
            <Button.Text>Delete</Button.Text>
          </Button>
        </div>
      </div>
    ),
  },
};

// Dialog with info message
export const InfoMessage: Story = {
  args: {
    isOpen: true,
    title: 'Information',
    children: (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-feedback-info shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-text-secondary">
              Your changes have been saved successfully. You can continue working or close this dialog.
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="primary" onClick={fn()}>
            <Button.Text>Got it</Button.Text>
          </Button>
        </div>
      </div>
    ),
  },
};

// Dialog with success message
export const SuccessMessage: Story = {
  args: {
    isOpen: true,
    title: 'Success',
    children: (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-feedback-success shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-text-secondary">
              Your task has been created successfully!
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="primary" onClick={fn()}>
            <Button.Text>Continue</Button.Text>
          </Button>
        </div>
      </div>
    ),
  },
};

// Dialog with warning
export const WarningMessage: Story = {
  args: {
    isOpen: true,
    title: 'Warning',
    children: (
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-feedback-warning shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-text-secondary">
              This action will permanently delete your data. Please make sure you want to proceed.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={fn()}>
            <Button.Text>Cancel</Button.Text>
          </Button>
          <Button variant="secondary" onClick={fn()}>
            <Button.Text>Proceed</Button.Text>
          </Button>
        </div>
      </div>
    ),
  },
};

// Dialog with long content
export const LongContent: Story = {
  args: {
    isOpen: true,
    title: 'Terms and Conditions',
    children: (
      <div className="space-y-4 max-h-96 overflow-y-auto">
        <div className="text-text-secondary space-y-3">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p>
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
          <p>
            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
          <Button variant="ghost" onClick={fn()}>
            <Button.Text>Decline</Button.Text>
          </Button>
          <Button variant="primary" onClick={fn()}>
            <Button.Text>Accept</Button.Text>
          </Button>
        </div>
      </div>
    ),
  },
};

// Interactive example
export const Interactive: Story = {
  args: {
    isOpen: false,
    title: 'Interactive Dialog',
    children: (
      <div className="space-y-4">
        <p className="text-text-secondary">
          This is an interactive dialog. Click the button below to close it, or click outside the dialog.
        </p>
        <div className="flex justify-end">
          <Button variant="primary" onClick={fn()}>
            <Button.Text>Close</Button.Text>
          </Button>
        </div>
      </div>
    ),
  },
  render: (args) => {
    const [isOpen, setIsOpen] = useState(args.isOpen);

    return (
      <>
        <Button variant="primary" onClick={() => setIsOpen(true)}>
          <Button.Text>Open Dialog</Button.Text>
        </Button>
        <Dialog
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      </>
    );
  },
};

// Showcase different accessibility settings
export const AccessibilityShowcase: Story = {
  args: {
    isOpen: false,
    title: 'Accessibility Showcase',
    onClose: fn(),
    children: null,
  },
  render: () => {
    const [normalOpen, setNormalOpen] = useState(false);
    const [highContrastOpen, setHighContrastOpen] = useState(false);
    const [compactSpacingOpen, setCompactSpacingOpen] = useState(false);
    const [relaxedSpacingOpen, setRelaxedSpacingOpen] = useState(false);
    const [largeFontOpen, setLargeFontOpen] = useState(false);
    const [noAnimationsOpen, setNoAnimationsOpen] = useState(false);

    return (
      <div className="flex gap-6 flex-col p-6">
        <div>
          <h3 className="mb-3 text-sm font-medium text-text-secondary">Normal Settings</h3>
          <CognitiveSettingsProvider
            isolated={true}
            initialSettings={{
              contrast: 'normal',
              spacing: 'normal',
              fontSize: 'normal',
              animations: true,
              focusMode: false,
              textDetail: 'detailed',
            }}
          >
            <Button variant="primary" onClick={() => setNormalOpen(true)}>
              <Button.Text>Open Normal Dialog</Button.Text>
            </Button>
            <Dialog
              isOpen={normalOpen}
              onClose={() => setNormalOpen(false)}
              title="Normal Dialog"
            >
              <div className="space-y-4">
                <p className="text-text-secondary">
                  This dialog uses normal accessibility settings.
                </p>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setNormalOpen(false)}>
                    <Button.Text>Cancel</Button.Text>
                  </Button>
                  <Button variant="primary" onClick={() => setNormalOpen(false)}>
                    <Button.Text>Confirm</Button.Text>
                  </Button>
                </div>
              </div>
            </Dialog>
          </CognitiveSettingsProvider>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium text-text-secondary">High Contrast</h3>
          <CognitiveSettingsProvider
            isolated={true}
            initialSettings={{
              contrast: 'high',
              spacing: 'normal',
              fontSize: 'normal',
              animations: true,
              focusMode: false,
              textDetail: 'detailed',
            }}
          >
            <Button variant="primary" onClick={() => setHighContrastOpen(true)}>
              <Button.Text>Open High Contrast Dialog</Button.Text>
            </Button>
            <Dialog
              isOpen={highContrastOpen}
              onClose={() => setHighContrastOpen(false)}
              title="High Contrast Dialog"
            >
              <div className="space-y-4">
                <p className="text-text-secondary">
                  This dialog has stronger borders and outlines for better visibility.
                </p>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setHighContrastOpen(false)}>
                    <Button.Text>Cancel</Button.Text>
                  </Button>
                  <Button variant="primary" onClick={() => setHighContrastOpen(false)}>
                    <Button.Text>Confirm</Button.Text>
                  </Button>
                </div>
              </div>
            </Dialog>
          </CognitiveSettingsProvider>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium text-text-secondary">Compact Spacing</h3>
          <CognitiveSettingsProvider
            isolated={true}
            initialSettings={{
              contrast: 'normal',
              spacing: 'compact',
              fontSize: 'normal',
              animations: true,
              focusMode: false,
              textDetail: 'detailed',
            }}
          >
            <Button variant="primary" onClick={() => setCompactSpacingOpen(true)}>
              <Button.Text>Open Compact Spacing Dialog</Button.Text>
            </Button>
            <Dialog
              isOpen={compactSpacingOpen}
              onClose={() => setCompactSpacingOpen(false)}
              title="Compact Spacing"
            >
              <div className="space-y-4">
                <p className="text-text-secondary">
                  This dialog uses compact spacing for tighter layout.
                </p>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setCompactSpacingOpen(false)}>
                    <Button.Text>Cancel</Button.Text>
                  </Button>
                  <Button variant="primary" onClick={() => setCompactSpacingOpen(false)}>
                    <Button.Text>Confirm</Button.Text>
                  </Button>
                </div>
              </div>
            </Dialog>
          </CognitiveSettingsProvider>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium text-text-secondary">Relaxed Spacing</h3>
          <CognitiveSettingsProvider
            isolated={true}
            initialSettings={{
              contrast: 'normal',
              spacing: 'relaxed',
              fontSize: 'normal',
              animations: true,
              focusMode: false,
              textDetail: 'detailed',
            }}
          >
            <Button variant="primary" onClick={() => setRelaxedSpacingOpen(true)}>
              <Button.Text>Open Relaxed Spacing Dialog</Button.Text>
            </Button>
            <Dialog
              isOpen={relaxedSpacingOpen}
              onClose={() => setRelaxedSpacingOpen(false)}
              title="Relaxed Spacing"
            >
              <div className="space-y-4">
                <p className="text-text-secondary">
                  This dialog uses relaxed spacing for more breathing room.
                </p>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setRelaxedSpacingOpen(false)}>
                    <Button.Text>Cancel</Button.Text>
                  </Button>
                  <Button variant="primary" onClick={() => setRelaxedSpacingOpen(false)}>
                    <Button.Text>Confirm</Button.Text>
                  </Button>
                </div>
              </div>
            </Dialog>
          </CognitiveSettingsProvider>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium text-text-secondary">Large Font</h3>
          <CognitiveSettingsProvider
            isolated={true}
            initialSettings={{
              contrast: 'normal',
              spacing: 'normal',
              fontSize: 'large',
              animations: true,
              focusMode: false,
              textDetail: 'detailed',
            }}
          >
            <Button variant="primary" onClick={() => setLargeFontOpen(true)}>
              <Button.Text>Open Large Font Dialog</Button.Text>
            </Button>
            <Dialog
              isOpen={largeFontOpen}
              onClose={() => setLargeFontOpen(false)}
              title="Large Font Dialog"
            >
              <div className="space-y-4">
                <p className="text-text-secondary">
                  This dialog uses larger font sizes for better readability.
                </p>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setLargeFontOpen(false)}>
                    <Button.Text>Cancel</Button.Text>
                  </Button>
                  <Button variant="primary" onClick={() => setLargeFontOpen(false)}>
                    <Button.Text>Confirm</Button.Text>
                  </Button>
                </div>
              </div>
            </Dialog>
          </CognitiveSettingsProvider>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium text-text-secondary">Animations Disabled</h3>
          <CognitiveSettingsProvider
            isolated={true}
            initialSettings={{
              contrast: 'normal',
              spacing: 'normal',
              fontSize: 'normal',
              animations: false,
              focusMode: false,
              textDetail: 'detailed',
            }}
          >
            <Button variant="primary" onClick={() => setNoAnimationsOpen(true)}>
              <Button.Text>Open No Animations Dialog</Button.Text>
            </Button>
            <Dialog
              isOpen={noAnimationsOpen}
              onClose={() => setNoAnimationsOpen(false)}
              title="No Animations"
            >
              <div className="space-y-4">
                <p className="text-text-secondary">
                  This dialog uses minimal transitions when animations are disabled.
                </p>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setNoAnimationsOpen(false)}>
                    <Button.Text>Cancel</Button.Text>
                  </Button>
                  <Button variant="primary" onClick={() => setNoAnimationsOpen(false)}>
                    <Button.Text>Confirm</Button.Text>
                  </Button>
                </div>
              </div>
            </Dialog>
          </CognitiveSettingsProvider>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

