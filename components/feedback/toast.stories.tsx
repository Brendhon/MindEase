import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ToastContainer } from './toast';
import { FeedbackProvider } from '@/providers/feedback-provider';
import { CognitiveSettingsProvider } from '@/providers/cognitive-settings-provider';
import { useFeedbackContext } from '@/contexts/feedback-context';
import { useEffect } from 'react';
import type { FeedbackMessage } from '@/hooks/useFeedback';
import { useFeedback } from '@/hooks/useFeedback';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'Components/Feedback/Toast',
  component: ToastContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <CognitiveSettingsProvider>
        <FeedbackProvider>
          <div className="min-h-screen p-8">
            <Story />
          </div>
        </FeedbackProvider>
      </CognitiveSettingsProvider>
    ),
  ],
} satisfies Meta<typeof ToastContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Helper component to initialize toasts for stories
 */
function ToastInitializer({ feedbacks }: { feedbacks: FeedbackMessage[] }) {
  const { addFeedback } = useFeedbackContext();

  useEffect(() => {
    feedbacks.forEach((feedback) => {
      addFeedback(feedback);
    });
  }, [feedbacks, addFeedback]);

  return <ToastContainer />;
}

/**
 * Component with buttons to trigger different toast types
 */
function ToastTriggerButtons() {
  const { success, error, warning, info } = useFeedback();

  return (
    <div className="flex gap-2 flex-wrap">
      <Button variant="primary" size="sm" onClick={() => success('Operation completed successfully', 0)}>
        <Button.Text>Success</Button.Text>
      </Button>
      <Button variant="danger" size="sm" onClick={() => error('An error occurred', 0)}>
        <Button.Text>Error</Button.Text>
      </Button>
      <Button variant="warning" size="sm" onClick={() => warning('Warning message', 0)}>
        <Button.Text>Warning</Button.Text>
      </Button>
      <Button variant="secondary" size="sm" onClick={() => info('Information message', 0)}>
        <Button.Text>Info</Button.Text>
      </Button>
    </div>
  );
}

/**
 * Toast component with cognitive accessibility support.
 * Automatically adapts to user preferences (contrast, spacing, font size, animations).
 */

// Success toast
export const Success: Story = {
  render: () => (
    <ToastInitializer
      feedbacks={[
        {
          id: '1',
          type: 'success',
          message: 'Task created successfully',
          duration: 0, // Don't auto-dismiss in stories
        },
      ]}
    />
  ),
};

// Error toast
export const Error: Story = {
  render: () => (
    <ToastInitializer
      feedbacks={[
        {
          id: '1',
          type: 'error',
          message: 'Failed to save changes. Please try again.',
          duration: 0,
        },
      ]}
    />
  ),
};

// Warning toast
export const Warning: Story = {
  render: () => (
    <ToastInitializer
      feedbacks={[
        {
          id: '1',
          type: 'warning',
          message: 'Your session will expire in 5 minutes',
          duration: 0,
        },
      ]}
    />
  ),
};

// Info toast
export const Info: Story = {
  render: () => (
    <ToastInitializer
      feedbacks={[
        {
          id: '1',
          type: 'info',
          message: 'New features are available. Check them out!',
          duration: 0,
        },
      ]}
    />
  ),
};

// Multiple toasts
export const Multiple: Story = {
  render: () => (
    <ToastInitializer
      feedbacks={[
        {
          id: '1',
          type: 'success',
          message: 'Profile updated successfully',
          duration: 0,
        },
        {
          id: '2',
          type: 'info',
          message: 'You have 3 new notifications',
          duration: 0,
        },
        {
          id: '3',
          type: 'warning',
          message: 'Please verify your email address',
          duration: 0,
        },
      ]}
    />
  ),
};

// All types showcase
export const AllTypes: Story = {
  render: () => (
    <ToastInitializer
      feedbacks={[
        {
          id: '1',
          type: 'success',
          message: 'Operation completed successfully',
          duration: 0,
        },
        {
          id: '2',
          type: 'error',
          message: 'An error occurred while processing your request',
          duration: 0,
        },
        {
          id: '3',
          type: 'warning',
          message: 'This action cannot be undone',
          duration: 0,
        },
        {
          id: '4',
          type: 'info',
          message: 'Your changes have been saved automatically',
          duration: 0,
        },
      ]}
    />
  ),
};

// Long message
export const LongMessage: Story = {
  render: () => (
    <ToastInitializer
      feedbacks={[
        {
          id: '1',
          type: 'info',
          message:
            'This is a very long message that demonstrates how the toast component handles extended text content. It should wrap properly and remain readable.',
          duration: 0,
        },
      ]}
    />
  ),
};

// Short message
export const ShortMessage: Story = {
  render: () => (
    <ToastInitializer
      feedbacks={[
        {
          id: '1',
          type: 'success',
          message: 'Done!',
          duration: 0,
        },
      ]}
    />
  ),
};

// Showcase different accessibility settings
export const AccessibilityShowcase: Story = {
  render: () => (
    <div className="flex gap-8 flex-col">
      <div>
        <h3 className="mb-4 text-sm font-medium text-text-secondary">Normal</h3>
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
          <FeedbackProvider>
            <div className="mb-4">
              <ToastTriggerButtons />
            </div>
            <ToastContainer />
          </FeedbackProvider>
        </CognitiveSettingsProvider>
      </div>
      <div>
        <h3 className="mb-4 text-sm font-medium text-text-secondary">High Contrast</h3>
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
          <FeedbackProvider>
            <div className="mb-4">
              <ToastTriggerButtons />
            </div>
            <ToastContainer />
          </FeedbackProvider>
        </CognitiveSettingsProvider>
      </div>
      <div>
        <h3 className="mb-4 text-sm font-medium text-text-secondary">Compact Spacing</h3>
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
          <FeedbackProvider>
            <div className="mb-4">
              <ToastTriggerButtons />
            </div>
            <ToastContainer />
          </FeedbackProvider>
        </CognitiveSettingsProvider>
      </div>
      <div>
        <h3 className="mb-4 text-sm font-medium text-text-secondary">Relaxed Spacing</h3>
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
          <FeedbackProvider>
            <div className="mb-4">
              <ToastTriggerButtons />
            </div>
            <ToastContainer />
          </FeedbackProvider>
        </CognitiveSettingsProvider>
      </div>
      <div>
        <h3 className="mb-4 text-sm font-medium text-text-secondary">Small Font</h3>
        <CognitiveSettingsProvider
          isolated={true}
          initialSettings={{
            contrast: 'normal',
            spacing: 'normal',
            fontSize: 'small',
            animations: true,
            focusMode: false,
            textDetail: 'detailed',
          }}
        >
          <FeedbackProvider>
            <div className="mb-4">
              <ToastTriggerButtons />
            </div>
            <ToastContainer />
          </FeedbackProvider>
        </CognitiveSettingsProvider>
      </div>
      <div>
        <h3 className="mb-4 text-sm font-medium text-text-secondary">Large Font</h3>
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
          <FeedbackProvider>
            <div className="mb-4">
              <ToastTriggerButtons />
            </div>
            <ToastContainer />
          </FeedbackProvider>
        </CognitiveSettingsProvider>
      </div>
      <div>
        <h3 className="mb-4 text-sm font-medium text-text-secondary">No Animations</h3>
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
          <FeedbackProvider>
            <div className="mb-4">
              <ToastTriggerButtons />
            </div>
            <ToastContainer />
          </FeedbackProvider>
        </CognitiveSettingsProvider>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

// Showcase text detail modes
export const TextDetailModes: Story = {
  render: () => (
    <div className="flex gap-8 flex-col">
      <div>
        <h3 className="mb-4 text-sm font-medium text-text-secondary">Detailed Mode (Default)</h3>
        <p className="mb-4 text-xs text-text-muted">
          Shows full messages with complete information. Click the buttons below to see detailed toast messages.
        </p>
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
          <FeedbackProvider>
            <div className="mb-4">
              <ToastTriggerButtons />
            </div>
            <ToastContainer />
          </FeedbackProvider>
        </CognitiveSettingsProvider>
      </div>
      <div>
        <h3 className="mb-4 text-sm font-medium text-text-secondary">Summary Mode</h3>
        <p className="mb-4 text-xs text-text-muted">
          Shows concise messages for reduced cognitive load. In summary mode, developers would use the useTextDetail hook to render shorter messages. Click the buttons below to see summary toast messages.
        </p>
        <CognitiveSettingsProvider
          isolated={true}
          initialSettings={{
            contrast: 'normal',
            spacing: 'normal',
            fontSize: 'normal',
            animations: true,
            focusMode: false,
            textDetail: 'summary',
          }}
        >
          <FeedbackProvider>
            <div className="mb-4">
              <ToastTriggerButtons />
            </div>
            <ToastContainer />
          </FeedbackProvider>
        </CognitiveSettingsProvider>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

