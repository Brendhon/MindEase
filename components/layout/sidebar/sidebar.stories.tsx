import { CognitiveSettingsProvider } from '@/providers/cognitive-settings-provider';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Calendar, CheckSquare, Home, LayoutDashboard, Settings, User } from 'lucide-react';
import { SessionProvider } from 'next-auth/react';
import { Sidebar } from './index';

const meta = {
  title: 'Components/Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SessionProvider>
      <CognitiveSettingsProvider>
        <div className="flex min-h-screen">
          <Story />
          <main className="flex-1 p-8">
            <h1 className="text-2xl font-semibold">Main Content</h1>
            <p className="mt-4 text-text-secondary">
              This is the main content area. The sidebar is on the left.
            </p>
          </main>
        </div>
      </CognitiveSettingsProvider>
      </SessionProvider>
    ),
  ],
  argTypes: {
    items: {
      control: 'object',
      description: 'Array of navigation items',
    },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Sidebar component with cognitive accessibility support.
 * Automatically adapts to user preferences (contrast, spacing, font size, animations).
 */

// Default sidebar with standard navigation items
export const Default: Story = {
  args: {
    items: [
      { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard },
      { href: '/tasks', labelKey: 'sidebar_tasks', icon: CheckSquare },
      { href: '/profile', labelKey: 'sidebar_profile', icon: User },
    ],
  },
};

// Sidebar with custom items
export const CustomItems: Story = {
  args: {
    items: [
      { href: '/home', labelKey: 'sidebar_home', icon: Home },
      { href: '/calendar', labelKey: 'sidebar_calendar', icon: Calendar },
      { href: '/settings', labelKey: 'sidebar_settings', icon: Settings },
    ],
  },
};

// Sidebar with many items
export const ManyItems: Story = {
  args: {
    items: [
      { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard },
      { href: '/tasks', labelKey: 'sidebar_tasks', icon: CheckSquare },
      { href: '/profile', labelKey: 'sidebar_profile', icon: User },
      { href: '/settings', labelKey: 'sidebar_settings', icon: Settings },
      { href: '/home', labelKey: 'sidebar_home', icon: Home },
      { href: '/calendar', labelKey: 'sidebar_calendar', icon: Calendar },
    ],
  },
};

// Sidebar with single item
export const SingleItem: Story = {
  args: {
    items: [
      { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard },
    ],
  },
};

// Sidebar without icons
export const WithoutIcons: Story = {
  args: {
    items: [
      { href: '/dashboard', labelKey: 'sidebar_dashboard' },
      { href: '/tasks', labelKey: 'sidebar_tasks' },
      { href: '/profile', labelKey: 'sidebar_profile' },
    ],
  },
};

// Sidebar with mixed items (some with icons, some without)
export const MixedItems: Story = {
  args: {
    items: [
      { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard },
      { href: '/tasks', labelKey: 'sidebar_tasks' }, // without icon
      { href: '/profile', labelKey: 'sidebar_profile', icon: User },
    ],
  },
};

// Showcase different accessibility settings
export const AccessibilityShowcase: Story = {
  render: () => (
    <div className="flex gap-4 flex-col">
      <div>
        <h3 className="mb-2 text-sm font-medium text-text-secondary">Normal</h3>
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
          <Sidebar
            items={[
              { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard },
              { href: '/tasks', labelKey: 'sidebar_tasks', icon: CheckSquare },
            ]}
          />
        </CognitiveSettingsProvider>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-text-secondary">High Contrast</h3>
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
          <Sidebar
            items={[
              { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard },
              { href: '/tasks', labelKey: 'sidebar_tasks', icon: CheckSquare },
            ]}
          />
        </CognitiveSettingsProvider>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-text-secondary">Compact Spacing</h3>
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
          <Sidebar
            items={[
              { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard },
              { href: '/tasks', labelKey: 'sidebar_tasks', icon: CheckSquare },
            ]}
          />
        </CognitiveSettingsProvider>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-text-secondary">Relaxed Spacing</h3>
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
          <Sidebar
            items={[
              { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard },
              { href: '/tasks', labelKey: 'sidebar_tasks', icon: CheckSquare },
            ]}
          />
        </CognitiveSettingsProvider>
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium text-text-secondary">Large Font</h3>
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
          <Sidebar
            items={[
              { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard },
              { href: '/tasks', labelKey: 'sidebar_tasks', icon: CheckSquare },
            ]}
          />
        </CognitiveSettingsProvider>
      </div>

      {/* Summary mode */}
      <div>
        <h3 className="mb-2 text-sm font-medium text-text-secondary">Summary Mode</h3>
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
          <Sidebar
            items={[
              { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard },
              { href: '/tasks', labelKey: 'sidebar_tasks', icon: CheckSquare },
            ]}
          />
        </CognitiveSettingsProvider>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};
