import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { CognitiveSettingsProvider } from '@/providers/cognitive-settings-provider';
import { SessionProvider } from 'next-auth/react';
import { Switch } from './index';

const meta = {
  title: 'Components/UI/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <SessionProvider>
        <CognitiveSettingsProvider>
          <Story />
        </CognitiveSettingsProvider>
      </SessionProvider>
    ),
  ],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Current checked state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the switch',
    },
    label: {
      control: 'text',
      description: 'Label text (prop-based API)',
    },
    description: {
      control: 'text',
      description: 'Description text (prop-based API)',
    },
    className: {
      control: 'text',
      description: 'Custom className for container',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Switch component supports both prop-based API and composition API.
 * Uses Switch.Toggle, Switch.Label, and Switch.Description subcomponents.
 */

// Basic switch (prop-based API)
export const Basic: Story = {
  args: {} as any,
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        checked={checked}
        onChange={setChecked}
        label="Enable notifications"
      />
    );
  },
};

// Switch with description (prop-based API)
export const WithDescription: Story = {
  args: {} as any,
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        checked={checked}
        onChange={setChecked}
        label="Enable notifications"
        description="Receive email notifications about important updates"
      />
    );
  },
};

// Switch checked state
export const Checked: Story = {
  args: {} as any,
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <Switch
        checked={checked}
        onChange={setChecked}
        label="Notifications enabled"
        description="You will receive notifications"
      />
    );
  },
};

// Disabled switch
export const Disabled: Story = {
  args: {} as any,
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Switch
        checked={checked}
        onChange={setChecked}
        label="Disabled switch"
        description="This switch is disabled and cannot be toggled"
        disabled
      />
    );
  },
};

// Disabled checked switch
export const DisabledChecked: Story = {
  args: {} as any,
  render: () => {
    const [checked, setChecked] = useState(true);
    return (
      <Switch
        checked={checked}
        onChange={setChecked}
        label="Disabled and checked"
        description="This switch is disabled and checked"
        disabled
      />
    );
  },
};

// Switch with composition API
export const CompositionAPI: Story = {
  args: {} as any,
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Switch checked={checked} onChange={setChecked}>
        <Switch.Toggle checked={checked} onChange={setChecked} />
        <Switch.Label onClick={() => setChecked(!checked)}>Enable dark mode</Switch.Label>
        <Switch.Description>Switch to dark theme for better viewing in low light</Switch.Description>
      </Switch>
    );
  },
};

// Multiple switches
export const MultipleSwitches: Story = {
  args: {} as any,
  render: () => {
    const [notifications, setNotifications] = useState(true);
    const [email, setEmail] = useState(false);
    const [sms, setSms] = useState(true);
    const [push, setPush] = useState(false);
    
    return (
      <div className="flex flex-col gap-4 max-w-md">
        <Switch
          checked={notifications}
          onChange={setNotifications}
          label="Enable notifications"
          description="Receive all types of notifications"
        />
        <Switch
          checked={email}
          onChange={setEmail}
          label="Email notifications"
          description="Receive notifications via email"
        />
        <Switch
          checked={sms}
          onChange={setSms}
          label="SMS notifications"
          description="Receive notifications via text message"
        />
        <Switch
          checked={push}
          onChange={setPush}
          label="Push notifications"
          description="Receive push notifications on your device"
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};