import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Sidebar } from './index';
import { LayoutDashboard, CheckSquare, User, Settings, Home, Calendar } from 'lucide-react';
import { CognitiveSettingsProvider } from '@/providers/cognitive-settings-provider';

const meta = {
  title: 'Components/Layout/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
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
      { href: '/dashboard', label: { detailed: 'Dashboard Overview', summary: 'Dashboard' }, icon: LayoutDashboard },
      { href: '/tasks', label: { detailed: 'Task Management', summary: 'Tasks' }, icon: CheckSquare },
      { href: '/profile', label: { detailed: 'User Profile Settings', summary: 'Profile' }, icon: User },
    ],
  },
};

// Sidebar with custom items
export const CustomItems: Story = {
  args: {
    items: [
      { href: '/home', label: { detailed: 'Home Page', summary: 'Home' }, icon: Home },
      { href: '/calendar', label: { detailed: 'Calendar View', summary: 'Calendar' }, icon: Calendar },
      { href: '/settings', label: { detailed: 'Application Settings', summary: 'Settings' }, icon: Settings },
    ],
  },
};

// Sidebar with many items
export const ManyItems: Story = {
  args: {
    items: [
      { href: '/dashboard', label: { detailed: 'Dashboard Overview', summary: 'Dashboard' }, icon: LayoutDashboard },
      { href: '/tasks', label: { detailed: 'Task Management', summary: 'Tasks' }, icon: CheckSquare },
      { href: '/profile', label: { detailed: 'User Profile Settings', summary: 'Profile' }, icon: User },
      { href: '/settings', label: { detailed: 'Application Settings', summary: 'Settings' }, icon: Settings },
      { href: '/home', label: { detailed: 'Home Page', summary: 'Home' }, icon: Home },
      { href: '/calendar', label: { detailed: 'Calendar View', summary: 'Calendar' }, icon: Calendar },
    ],
  },
};

// Sidebar with single item
export const SingleItem: Story = {
  args: {
    items: [
      { href: '/dashboard', label: { detailed: 'Dashboard Overview', summary: 'Dashboard' }, icon: LayoutDashboard },
    ],
  },
};

// Sidebar without icons
export const WithoutIcons: Story = {
  args: {
    items: [
      { href: '/dashboard', label: { detailed: 'Dashboard Overview', summary: 'Dashboard' } },
      { href: '/tasks', label: { detailed: 'Task Management', summary: 'Tasks' } },
      { href: '/profile', label: { detailed: 'User Profile Settings', summary: 'Profile' } },
    ],
  },
};

// Sidebar with mixed items (some with icons, some without)
export const MixedItems: Story = {
  args: {
    items: [
      { href: '/dashboard', label: { detailed: 'Dashboard Overview', summary: 'Dashboard' }, icon: LayoutDashboard },
      { href: '/tasks', label: { detailed: 'Task Management', summary: 'Tasks' } }, // without icon
      { href: '/profile', label: { detailed: 'User Profile Settings', summary: 'Profile' }, icon: User },
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
              { href: '/dashboard', label: { detailed: 'Dashboard Overview', summary: 'Dashboard' }, icon: LayoutDashboard },
              { href: '/tasks', label: { detailed: 'Task Management', summary: 'Tasks' }, icon: CheckSquare },
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
              { href: '/dashboard', label: { detailed: 'Dashboard Overview', summary: 'Dashboard' }, icon: LayoutDashboard },
              { href: '/tasks', label: { detailed: 'Task Management', summary: 'Tasks' }, icon: CheckSquare },
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
              { href: '/dashboard', label: { detailed: 'Dashboard Overview', summary: 'Dashboard' }, icon: LayoutDashboard },
              { href: '/tasks', label: { detailed: 'Task Management', summary: 'Tasks' }, icon: CheckSquare },
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
              { href: '/dashboard', label: { detailed: 'Dashboard Overview', summary: 'Dashboard' }, icon: LayoutDashboard },
              { href: '/tasks', label: { detailed: 'Task Management', summary: 'Tasks' }, icon: CheckSquare },
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
              { href: '/dashboard', label: { detailed: 'Dashboard Overview', summary: 'Dashboard' }, icon: LayoutDashboard },
              { href: '/tasks', label: { detailed: 'Task Management', summary: 'Tasks' }, icon: CheckSquare },
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

// Showcase text detail modes
export const TextSummaryModes: Story = {
  render: () => (
    <>
        <h3 className="mb-2 text-sm font-medium text-text-secondary">Summary Mode</h3>
        <p className="mb-2 text-xs text-text-muted">
          Shows shortened labels for reduced cognitive load. In summary mode, developers would use the useTextDetail hook to render shorter labels.
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
          <Sidebar
            items={[
              { href: '/dashboard', label: { detailed: 'Dashboard Overview', summary: 'Dashboard' }, icon: LayoutDashboard },
              { href: '/tasks', label: { detailed: 'Task Management', summary: 'Tasks' }, icon: CheckSquare },
              { href: '/profile', label: { detailed: 'User Profile Settings', summary: 'Profile' }, icon: User },
            ]}
          />
        </CognitiveSettingsProvider>
      </>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

