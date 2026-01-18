import { AuthProvider } from '@/providers/auth';
import { CognitiveSettingsProvider } from '@/providers/cognitive-settings';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SessionProvider } from 'next-auth/react';
import { Card } from './index';

const meta = {
  title: 'Components/UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
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
    as: {
      control: 'select',
      options: ['div', 'section', 'article'],
      description: 'HTML element to render',
    },
    className: {
      control: 'text',
      description: 'Custom className to extend base styles',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Card component with composition pattern.
 * Uses Card.Header, Card.Title, Card.Description, and Card.Content subcomponents.
 */

// Basic card
export const Basic: Story = {
  args: {
    children: (
      <>
        <Card.Header>
          <Card.Title>Card Title</Card.Title>
        </Card.Header>
        <Card.Content>
          <p>This is a basic card with header and content.</p>
        </Card.Content>
      </>
    ),
  },
};

// Card with all subcomponents
export const Complete: Story = {
  args: {
    children: (
      <>
        <Card.Header>
          <Card.Title>Complete Card</Card.Title>
          <Card.Description>
            This card includes all subcomponents: Header, Title, Description,
            and Content.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <p>
            This is the main content area of the card. You can put any content
            here.
          </p>
          <p>
            Multiple paragraphs are supported and will be properly spaced
            according to accessibility settings.
          </p>
        </Card.Content>
      </>
    ),
  },
};

// Card with only content
export const ContentOnly: Story = {
  args: {
    children: (
      <Card.Content>
        <p>This card only has content, without a header section.</p>
        <p>Useful for simple content displays.</p>
      </Card.Content>
    ),
  },
};

// Card with only header
export const HeaderOnly: Story = {
  args: {
    children: (
      <Card.Header>
        <Card.Title>Header Only</Card.Title>
        <Card.Description>
          This card only has a header section with title and description.
        </Card.Description>
      </Card.Header>
    ),
  },
};

// Card as section element
export const AsSection: Story = {
  args: {
    as: 'section',
    children: (
      <>
        <Card.Header>
          <Card.Title>Section Card</Card.Title>
          <Card.Description>
            This card is rendered as a section element.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <p>Using semantic HTML elements improves accessibility and SEO.</p>
        </Card.Content>
      </>
    ),
  },
};

// Card as article element
export const AsArticle: Story = {
  args: {
    as: 'article',
    children: (
      <>
        <Card.Header>
          <Card.Title>Article Card</Card.Title>
          <Card.Description>
            This card is rendered as an article element.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <p>Article elements are useful for standalone content pieces.</p>
        </Card.Content>
      </>
    ),
  },
};

// Complex content example
export const ComplexContent: Story = {
  args: {
    children: (
      <>
        <Card.Header>
          <Card.Title>Task Management</Card.Title>
          <Card.Description>
            Manage your daily tasks and stay organized.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <div>
            <h3 className="font-semibold mb-2">Today &apos;s Tasks</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Review project proposal</li>
              <li>Team meeting at 2 PM</li>
              <li>Update documentation</li>
            </ul>
          </div>
        </Card.Content>
      </>
    ),
  },
};

// Multiple cards showcase
export const MultipleCards: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div className="flex flex-col gap-4 max-w-2xl">
      <Card>
        <Card.Header>
          <Card.Title>Card 1</Card.Title>
          <Card.Description>First card in the list.</Card.Description>
        </Card.Header>
        <Card.Content>
          <p>Content for the first card.</p>
        </Card.Content>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>Card 2</Card.Title>
          <Card.Description>Second card in the list.</Card.Description>
        </Card.Header>
        <Card.Content>
          <p>Content for the second card.</p>
        </Card.Content>
      </Card>
      <Card>
        <Card.Header>
          <Card.Title>Card 3</Card.Title>
          <Card.Description>Third card in the list.</Card.Description>
        </Card.Header>
        <Card.Content>
          <p>Content for the third card.</p>
        </Card.Content>
      </Card>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

// Showcase different accessibility settings
export const AccessibilityShowcase: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div className="flex gap-6 flex-col p-6">
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">
          Normal Settings
        </h3>
        <CognitiveSettingsProvider
          initialSettings={{
            contrast: 'normal',
            spacing: 'normal',
            fontSize: 'normal',
            animations: true,
            focusMode: false,
            textDetail: 'detailed',
          }}
        >
          <Card>
            <Card.Header>
              <Card.Title>Normal Settings</Card.Title>
              <Card.Description>
                Default accessibility settings with normal contrast, spacing,
                and font size.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <p>This card uses the default accessibility settings.</p>
            </Card.Content>
          </Card>
        </CognitiveSettingsProvider>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">
          High Contrast
        </h3>
        <CognitiveSettingsProvider
          initialSettings={{
            contrast: 'high',
            spacing: 'normal',
            fontSize: 'normal',
            animations: true,
            focusMode: false,
            textDetail: 'detailed',
          }}
        >
          <Card>
            <Card.Header>
              <Card.Title>High Contrast</Card.Title>
              <Card.Description>
                Card with high contrast settings for better visibility.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <p>Notice the enhanced border and text contrast.</p>
            </Card.Content>
          </Card>
        </CognitiveSettingsProvider>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">
          Compact Spacing
        </h3>
        <CognitiveSettingsProvider
          initialSettings={{
            contrast: 'normal',
            spacing: 'compact',
            fontSize: 'normal',
            animations: true,
            focusMode: false,
            textDetail: 'detailed',
          }}
        >
          <Card>
            <Card.Header>
              <Card.Title>Compact Spacing</Card.Title>
              <Card.Description>
                Card with compact spacing for users who prefer tighter layouts.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <p>Notice the reduced padding and gaps between elements.</p>
            </Card.Content>
          </Card>
        </CognitiveSettingsProvider>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">
          Relaxed Spacing
        </h3>
        <CognitiveSettingsProvider
          initialSettings={{
            contrast: 'normal',
            spacing: 'relaxed',
            fontSize: 'normal',
            animations: true,
            focusMode: false,
            textDetail: 'detailed',
          }}
        >
          <Card>
            <Card.Header>
              <Card.Title>Relaxed Spacing</Card.Title>
              <Card.Description>
                Card with relaxed spacing for users who prefer more breathing
                room.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <p>Notice the increased padding and gaps between elements.</p>
            </Card.Content>
          </Card>
        </CognitiveSettingsProvider>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">
          Small Font
        </h3>
        <CognitiveSettingsProvider
          initialSettings={{
            contrast: 'normal',
            spacing: 'normal',
            fontSize: 'small',
            animations: true,
            focusMode: false,
            textDetail: 'detailed',
          }}
        >
          <Card>
            <Card.Header>
              <Card.Title>Small Font</Card.Title>
              <Card.Description>
                Card with small font size setting.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <p>Text sizes are adjusted according to user preferences.</p>
            </Card.Content>
          </Card>
        </CognitiveSettingsProvider>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">
          Large Font
        </h3>
        <CognitiveSettingsProvider
          initialSettings={{
            contrast: 'normal',
            spacing: 'normal',
            fontSize: 'large',
            animations: true,
            focusMode: false,
            textDetail: 'detailed',
          }}
        >
          <Card>
            <Card.Header>
              <Card.Title>Large Font</Card.Title>
              <Card.Description>
                Card with large font size setting for better readability.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <p>Text sizes are adjusted according to user preferences.</p>
            </Card.Content>
          </Card>
        </CognitiveSettingsProvider>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">
          Animations Disabled
        </h3>
        <CognitiveSettingsProvider
          initialSettings={{
            contrast: 'normal',
            spacing: 'normal',
            fontSize: 'normal',
            animations: false,
            focusMode: false,
            textDetail: 'detailed',
          }}
        >
          <Card>
            <Card.Header>
              <Card.Title>No Animations</Card.Title>
              <Card.Description>
                Card with animations disabled for users sensitive to motion.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <p>
                Transitions and animations are removed when this setting is
                enabled.
              </p>
            </Card.Content>
          </Card>
        </CognitiveSettingsProvider>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">
          Focus Mode
        </h3>
        <CognitiveSettingsProvider
          initialSettings={{
            contrast: 'normal',
            spacing: 'normal',
            fontSize: 'normal',
            animations: true,
            focusMode: true,
            textDetail: 'detailed',
          }}
        >
          <Card>
            <Card.Header>
              <Card.Title>Focus Mode</Card.Title>
              <Card.Description>
                Card with focus mode enabled to reduce distractions.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <p>
                Focus mode applies additional styling to help maintain
                attention.
              </p>
            </Card.Content>
          </Card>
        </CognitiveSettingsProvider>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">
          All Settings Combined
        </h3>
        <CognitiveSettingsProvider
          initialSettings={{
            contrast: 'high',
            spacing: 'relaxed',
            fontSize: 'large',
            animations: false,
            focusMode: true,
            textDetail: 'detailed',
          }}
        >
          <Card>
            <Card.Header>
              <Card.Title>Maximum Accessibility</Card.Title>
              <Card.Description>
                Card with all accessibility enhancements enabled: high contrast,
                relaxed spacing, large font, no animations, and focus mode.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <p>
                This combination provides the maximum level of accessibility
                support.
              </p>
            </Card.Content>
          </Card>
        </CognitiveSettingsProvider>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
