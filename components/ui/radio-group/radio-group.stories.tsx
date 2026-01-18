import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { CognitiveSettingsProvider } from '@/providers/cognitive-settings';
import { SessionProvider } from 'next-auth/react';
import { RadioGroup } from './index';
import { fn } from 'storybook/test';

const meta = {
  title: 'Components/UI/RadioGroup',
  component: RadioGroup,
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
    disabled: {
      control: 'boolean',
      description: 'Disable the radio group',
    },
    className: {
      control: 'text',
      description: 'Custom className for container',
    },
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * RadioGroup component with composition pattern.
 * Uses RadioGroup.Header, RadioGroup.Label, RadioGroup.Description, and RadioGroup.Option subcomponents.
 */

// Basic radio group
export const Basic: Story = {
  args: {
    children: null,
    value: 'option1',
    onChange: fn(),
  },
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <RadioGroup value={value} onChange={setValue}>
        <RadioGroup.Header>
          <RadioGroup.Label>Choose an option</RadioGroup.Label>
        </RadioGroup.Header>
        <RadioGroup.Option value="option1" label="Option 1" />
        <RadioGroup.Option value="option2" label="Option 2" />
        <RadioGroup.Option value="option3" label="Option 3" />
      </RadioGroup>
    );
  },
};

// Radio group with description
export const WithDescription: Story = {
  args: {
    children: null,
    value: 'option1',
    onChange: fn(),
  },
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <RadioGroup value={value} onChange={setValue}>
        <RadioGroup.Header>
          <RadioGroup.Label>Choose an option</RadioGroup.Label>
          <RadioGroup.Description>
            Select one of the available options below.
          </RadioGroup.Description>
        </RadioGroup.Header>
        <RadioGroup.Option value="option1" label="Option 1" />
        <RadioGroup.Option value="option2" label="Option 2" />
        <RadioGroup.Option value="option3" label="Option 3" />
      </RadioGroup>
    );
  },
};

// Radio group with option descriptions
export const WithOptionDescriptions: Story = {
  args: {
    children: null,
    value: 'email',
    onChange: fn(),
  },
  render: () => {
    const [value, setValue] = useState('email');
    return (
      <RadioGroup value={value} onChange={setValue}>
        <RadioGroup.Header>
          <RadioGroup.Label>Notification preferences</RadioGroup.Label>
          <RadioGroup.Description>
            Choose how you want to receive notifications.
          </RadioGroup.Description>
        </RadioGroup.Header>
        <RadioGroup.Option
          value="email"
          label="Email"
          description="Receive notifications via email"
        />
        <RadioGroup.Option
          value="sms"
          label="SMS"
          description="Receive notifications via text message"
        />
        <RadioGroup.Option
          value="push"
          label="Push notifications"
          description="Receive push notifications on your device"
        />
        <RadioGroup.Option
          value="none"
          label="None"
          description="Do not receive any notifications"
        />
      </RadioGroup>
    );
  },
};

// Disabled radio group
export const Disabled: Story = {
  args: {
    children: null,
    value: 'option1',
    onChange: fn(),
  },
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <RadioGroup value={value} onChange={setValue} disabled>
        <RadioGroup.Header>
          <RadioGroup.Label>Disabled radio group</RadioGroup.Label>
          <RadioGroup.Description>
            This radio group is disabled and cannot be changed.
          </RadioGroup.Description>
        </RadioGroup.Header>
        <RadioGroup.Option value="option1" label="Option 1" />
        <RadioGroup.Option value="option2" label="Option 2" />
        <RadioGroup.Option value="option3" label="Option 3" />
      </RadioGroup>
    );
  },
};

// Radio group without header
export const WithoutHeader: Story = {
  args: {
    children: null,
    value: 'option1',
    onChange: fn(),
  },
  render: () => {
    const [value, setValue] = useState('option1');
    return (
      <RadioGroup value={value} onChange={setValue}>
        <RadioGroup.Option value="option1" label="Option 1" />
        <RadioGroup.Option value="option2" label="Option 2" />
        <RadioGroup.Option value="option3" label="Option 3" />
      </RadioGroup>
    );
  },
};

// Multiple radio groups
export const MultipleGroups: Story = {
  args: {
    children: null,
    value: 'light',
    onChange: fn(),
  },
  render: () => {
    const [theme, setTheme] = useState('light');
    const [language, setLanguage] = useState('en');

    return (
      <div className="flex flex-col gap-6 max-w-md">
        <RadioGroup value={theme} onChange={setTheme}>
          <RadioGroup.Header>
            <RadioGroup.Label>Theme</RadioGroup.Label>
            <RadioGroup.Description>
              Choose your preferred theme.
            </RadioGroup.Description>
          </RadioGroup.Header>
          <RadioGroup.Option value="light" label="Light" />
          <RadioGroup.Option value="dark" label="Dark" />
          <RadioGroup.Option
            value="auto"
            label="Auto"
            description="Follow system preference"
          />
        </RadioGroup>

        <RadioGroup value={language} onChange={setLanguage}>
          <RadioGroup.Header>
            <RadioGroup.Label>Language</RadioGroup.Label>
            <RadioGroup.Description>
              Select your preferred language.
            </RadioGroup.Description>
          </RadioGroup.Header>
          <RadioGroup.Option value="en" label="English" />
          <RadioGroup.Option value="pt" label="Portuguese" />
          <RadioGroup.Option value="es" label="Spanish" />
        </RadioGroup>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};
