import { Button } from '@/components/ui/button';
import { useSidebar } from '@/hooks/useSidebar';
import { CognitiveSettingsProvider } from '@/providers/cognitive-settings-provider';
import { SidebarProvider } from '@/providers/sidebar-provider';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Calendar, CheckSquare, Home, LayoutDashboard, Menu, Settings, User } from 'lucide-react';
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
          <SidebarProvider>
            <div className="flex min-h-screen">
              <Story />
              <main className="flex-1 p-8">
                <h1 className="text-2xl font-semibold">Main Content</h1>
                <p className="mt-4 text-text-secondary">
                  This is the main content area. The sidebar is on the left.
                </p>
              </main>
            </div>
          </SidebarProvider>
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
          <SidebarProvider>
            <Sidebar
              items={[
                { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard },
                { href: '/tasks', labelKey: 'sidebar_tasks', icon: CheckSquare },
              ]}
            />
          </SidebarProvider>
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
          <SidebarProvider>
            <Sidebar
              items={[
                { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard },
                { href: '/tasks', labelKey: 'sidebar_tasks', icon: CheckSquare },
              ]}
            />
          </SidebarProvider>
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
          <SidebarProvider>
            <Sidebar
              items={[
                { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard },
                { href: '/tasks', labelKey: 'sidebar_tasks', icon: CheckSquare },
              ]}
            />
          </SidebarProvider>
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
          <SidebarProvider>
            <Sidebar
              items={[
                { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard },
                { href: '/tasks', labelKey: 'sidebar_tasks', icon: CheckSquare },
              ]}
            />
          </SidebarProvider>
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
          <SidebarProvider>
            <Sidebar
              items={[
                { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard },
                { href: '/tasks', labelKey: 'sidebar_tasks', icon: CheckSquare },
              ]}
            />
          </SidebarProvider>
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
          <SidebarProvider>
            <Sidebar
              items={[
                { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard },
                { href: '/tasks', labelKey: 'sidebar_tasks', icon: CheckSquare },
              ]}
            />
          </SidebarProvider>
        </CognitiveSettingsProvider>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

// Mobile behavior showcase - demonstrates drawer functionality
export const MobileDrawer: Story = {
  render: () => {
    // This story needs to be wrapped in providers
    return (
      <SessionProvider>
        <CognitiveSettingsProvider>
          <SidebarProvider>
            <div className="flex min-h-screen bg-bg-secondary">
              <Sidebar
                items={[
                  { href: '/dashboard', labelKey: 'sidebar_dashboard', icon: LayoutDashboard },
                  { href: '/tasks', labelKey: 'sidebar_tasks', icon: CheckSquare },
                  { href: '/profile', labelKey: 'sidebar_profile', icon: User },
                ]}
              />
              <main className="flex-1 flex flex-col">
                <header className="h-16 bg-surface-primary border-b border-border-subtle flex items-center justify-between px-6">
                  <div className="flex items-center gap-3">
                    <MobileMenuButton />
                    <h1 className="text-lg font-semibold text-text-primary">MindEase</h1>
                  </div>
                </header>
                <div className="flex-1 p-8">
                  <h1 className="text-2xl font-semibold mb-4">Mobile Drawer Demo</h1>
                  <p className="text-text-secondary mb-4">
                    This story demonstrates the mobile drawer behavior. On mobile screens (below md breakpoint),
                    the sidebar is hidden by default and can be toggled with the menu button.
                  </p>
                  <p className="text-text-secondary mb-4">
                    On desktop (md and above), the sidebar is always visible.
                  </p>
                  <div className="mt-6 p-4 bg-surface-primary border border-border-subtle rounded-md">
                    <h2 className="text-lg font-semibold mb-2">Try it:</h2>
                    <ul className="list-disc list-inside text-text-secondary space-y-2">
                      <li>Resize your browser to mobile width (&lt; 768px)</li>
                      <li>Click the menu button to open the sidebar</li>
                      <li>Click outside or press Escape to close</li>
                      <li>Click a navigation item to navigate and auto-close</li>
                    </ul>
                  </div>
                </div>
              </main>
            </div>
          </SidebarProvider>
        </CognitiveSettingsProvider>
      </SessionProvider>
    );
  },
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Helper component for mobile menu button in story
function MobileMenuButton() {
  const { toggle } = useSidebar();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      className="md:hidden"
      aria-label="Abrir menu de navegação"
    >
      <Button.Icon icon={Menu} size="sm" />
    </Button>
  );
}
