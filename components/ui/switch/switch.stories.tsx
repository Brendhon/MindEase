import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { CognitiveSettingsProvider } from '@/providers/cognitive-settings';
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
  args: {},
  render: () => {
    const [checked, _setChecked] = useState(false);
    return (
      <Switch>
        <Switch.Toggle checked={checked} onChange={_setChecked} />
        <Switch.Label>Enable notifications</Switch.Label>
      </Switch>
    );
  },
};

// Switch with description (prop-based API)
export const WithDescription: Story = {
  args: {},
  render: () => {
    const [checked, _setChecked] = useState(false);
    return (
      <Switch>
        <Switch.Toggle checked={checked} onChange={_setChecked} />
        <Switch.Label>Enable notifications</Switch.Label>
        <Switch.Description>
          Receive email notifications about important updates
        </Switch.Description>
      </Switch>
    );
  },
};

// Switch checked state
export const Checked: Story = {
  args: {},
  render: () => {
    const [checked, _setChecked] = useState(true);
    return (
      <Switch>
        <Switch.Toggle checked={checked} onChange={_setChecked} />
        <Switch.Label>Notifications enabled</Switch.Label>
        <Switch.Description>You will receive notifications</Switch.Description>
      </Switch>
    );
  },
};

// Disabled switch
export const Disabled: Story = {
  args: {},
  render: () => {
    const [checked, _setChecked] = useState(false);
    return (
      <Switch>
        <Switch.Toggle checked={checked} onChange={_setChecked} disabled />
        <Switch.Label>Disabled switch</Switch.Label>
        <Switch.Description>
          This switch is disabled and cannot be toggled
        </Switch.Description>
      </Switch>
    );
  },
};

// Disabled checked switch
export const DisabledChecked: Story = {
  args: {},
  render: () => {
    const [checked, _setChecked] = useState(true);
    return (
      <Switch>
        <Switch.Toggle checked={checked} onChange={_setChecked} disabled />
        <Switch.Label>Disabled and checked</Switch.Label>
        <Switch.Description>
          This switch is disabled and checked
        </Switch.Description>
      </Switch>
    );
  },
};

// Multiple switches
export const MultipleSwitches: Story = {
  args: {},
  render: () => {
    const [notifications, _setNotifications] = useState(true);
    const [push, setPush] = useState(false);

    return (
      <div className="flex flex-col gap-4 max-w-md">
        <Switch>
          <Switch.Toggle checked={notifications} onChange={_setNotifications} />
          <Switch.Label>Email notifications</Switch.Label>
          <Switch.Description>
            Receive notifications via email
          </Switch.Description>
        </Switch>
        <Switch>
          <Switch.Toggle checked={push} onChange={setPush} />
          <Switch.Label>Push notifications</Switch.Label>
          <Switch.Description>
            Receive push notifications on your device
          </Switch.Description>
        </Switch>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};
