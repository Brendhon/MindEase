import { Button } from '@/components/ui/button';
import { useFeedbackContext } from '@/contexts/feedback-context';
import type { FeedbackMessage } from '@/hooks/useFeedback';
import { useFeedback } from '@/hooks/useFeedback';
import { useTextDetail } from '@/hooks/useTextDetail';
import { CognitiveSettingsProvider } from '@/providers/cognitive-settings-provider';
import { FeedbackProvider } from '@/providers/feedback-provider';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';
import { ToastContainer } from '.';
import { AuthProvider } from '@/providers/auth-provider';

const meta = {
  title: 'Components/Feedback/Toast',
  component: ToastContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SessionProvider>
        <AuthProvider>
          <CognitiveSettingsProvider>
            <FeedbackProvider>
              <div className="min-h-screen p-8">
                <Story />
              </div>
            </FeedbackProvider>
          </CognitiveSettingsProvider>
        </AuthProvider>
      </SessionProvider>
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
 * Uses accessibility text keys for button labels
 */
function ToastTriggerButtons() {
  const { success, error, warning, info } = useFeedback();
  const { getText } = useTextDetail();

  return (
    <div className="flex gap-2 flex-wrap">
      <Button variant="primary" size="sm" onClick={() => success('toast_success_task_completed', 0)}>
        <Button.Text>{getText('button_success')}</Button.Text>
      </Button>
      <Button variant="danger" size="sm" onClick={() => error('toast_error_processing', 0)}>
        <Button.Text>{getText('button_error')}</Button.Text>
      </Button>
      <Button variant="warning" size="sm" onClick={() => warning('toast_warning_cannot_undo', 0)}>
        <Button.Text>{getText('button_warning')}</Button.Text>
      </Button>
      <Button variant="secondary" size="sm" onClick={() => info('toast_info_new_features', 0)}>
        <Button.Text>{getText('button_info')}</Button.Text>
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
          messageKey: 'toast_success_task_created',
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
          messageKey: 'toast_error_save_failed',
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
          messageKey: 'toast_warning_session_expiring',
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
          messageKey: 'toast_info_new_features',
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
          messageKey: 'toast_success_profile_updated',
          duration: 0,
        },
        {
          id: '2',
          type: 'info',
          messageKey: 'toast_info_new_notifications',
          duration: 0,
        },
        {
          id: '3',
          type: 'warning',
          messageKey: 'toast_warning_verify_email',
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
          messageKey: 'toast_success_task_completed',
          duration: 0,
        },
        {
          id: '2',
          type: 'error',
          messageKey: 'toast_error_processing',
          duration: 0,
        },
        {
          id: '3',
          type: 'warning',
          messageKey: 'toast_warning_cannot_undo',
          duration: 0,
        },
        {
          id: '4',
          type: 'info',
          messageKey: 'toast_info_auto_saved',
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
          messageKey: 'toast_info_long_message',
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
          messageKey: 'toast_success_done',
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
          Shows concise messages for reduced cognitive load. In summary mode, developers can use <code className="text-xs bg-gray-100 px-1 rounded">useCognitiveSettings().textDetail</code> to render shorter messages or access text content from the JSON system. Click the buttons below to see summary toast messages.
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

