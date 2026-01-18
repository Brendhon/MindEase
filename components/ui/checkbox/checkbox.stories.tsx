import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { CognitiveSettingsProvider } from '@/providers/cognitive-settings';
import { SessionProvider } from 'next-auth/react';
import { Checkbox } from './checkbox';
import { useState } from 'react';

const meta = {
  title: 'Components/UI/Checkbox',
  component: Checkbox,
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
      description: 'Disable the checkbox',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Checkbox component with composition pattern.
 * Uses Checkbox.Label and Checkbox.Description subcomponents.
 */

// Basic states
export const Unchecked: Story = {
  args: {
    checked: false,
    disabled: false,
    children: <Checkbox.Label>Unchecked checkbox</Checkbox.Label>,
  },
};

export const Checked: Story = {
  args: {
    checked: true,
    disabled: false,
    children: <Checkbox.Label>Checked checkbox</Checkbox.Label>,
  },
};

// With label
export const WithLabel: Story = {
  args: {
    checked: false,
    disabled: false,
    children: <Checkbox.Label>Accept terms and conditions</Checkbox.Label>,
  },
};

export const WithLabelChecked: Story = {
  args: {
    checked: true,
    disabled: false,
    children: <Checkbox.Label>Task completed</Checkbox.Label>,
  },
};

// With label and description
export const WithDescription: Story = {
  args: {
    checked: false,
    disabled: false,
    children: (
      <>
        <Checkbox.Label>Enable notifications</Checkbox.Label>
        <Checkbox.Description>
          Receive email and push notifications
        </Checkbox.Description>
      </>
    ),
  },
};

export const WithDescriptionChecked: Story = {
  args: {
    checked: true,
    disabled: false,
    children: (
      <>
        <Checkbox.Label>Enable dark mode</Checkbox.Label>
        <Checkbox.Description>
          Switch to dark theme for better visibility
        </Checkbox.Description>
      </>
    ),
  },
};

// Disabled states
export const DisabledUnchecked: Story = {
  args: {
    checked: false,
    disabled: true,
    children: <Checkbox.Label>Disabled unchecked</Checkbox.Label>,
  },
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
    children: <Checkbox.Label>Disabled checked</Checkbox.Label>,
  },
};

export const DisabledWithDescription: Story = {
  args: {
    checked: false,
    disabled: true,
    children: (
      <>
        <Checkbox.Label>Premium feature</Checkbox.Label>
        <Checkbox.Description>
          This feature requires a premium subscription
        </Checkbox.Description>
      </>
    ),
  },
};

// Interactive examples
export const Interactive: Story = {
  args: {
    checked: false,
    onChange: fn(),
  },
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox checked={checked} onChange={setChecked}>
        <Checkbox.Label>Click me to toggle</Checkbox.Label>
        <Checkbox.Description>
          Current state: {checked ? 'checked' : 'unchecked'}
        </Checkbox.Description>
      </Checkbox>
    );
  },
};

export const InteractiveWithLabel: Story = {
  args: {
    checked: false,
    onChange: fn(),
  },
  render: () => {
    const [completed, setCompleted] = useState(false);
    return (
      <Checkbox checked={completed} onChange={setCompleted}>
        <Checkbox.Label checked={completed}>Complete this task</Checkbox.Label>
      </Checkbox>
    );
  },
};

// All states showcase
export const AllStates: Story = {
  args: {
    checked: false,
    onChange: fn(),
  },
  render: () => {
    const [state1, setState1] = useState(false);
    const [state2, setState2] = useState(true);
    const [state3, setState3] = useState(false);
    const [state4, setState4] = useState(true);

    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <Checkbox checked={state1} onChange={setState1}>
            <Checkbox.Label>Unchecked</Checkbox.Label>
          </Checkbox>
          <Checkbox checked={state2} onChange={setState2}>
            <Checkbox.Label>Checked</Checkbox.Label>
          </Checkbox>
          <Checkbox checked={state3} onChange={setState3} disabled>
            <Checkbox.Label>Disabled unchecked</Checkbox.Label>
          </Checkbox>
          <Checkbox checked={state4} onChange={setState4} disabled>
            <Checkbox.Label>Disabled checked</Checkbox.Label>
          </Checkbox>
        </div>
        <div className="flex flex-col gap-3">
          <Checkbox checked={state1} onChange={setState1}>
            <Checkbox.Label>With description</Checkbox.Label>
            <Checkbox.Description>
              This is a description text
            </Checkbox.Description>
          </Checkbox>
          <Checkbox checked={state2} onChange={setState2}>
            <Checkbox.Label>Checked with description</Checkbox.Label>
            <Checkbox.Description>
              This checkbox is checked
            </Checkbox.Description>
          </Checkbox>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

// Showcase different accessibility settings
export const AccessibilityShowcase: Story = {
  args: {
    checked: false,
    onChange: fn(),
  },
  render: () => {
    const [state1, setState1] = useState(false);
    const [state2, setState2] = useState(true);

    return (
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
            <div className="flex flex-col gap-3">
              <Checkbox checked={state1} onChange={setState1}>
                <Checkbox.Label>Normal checkbox</Checkbox.Label>
                <Checkbox.Description>
                  With normal spacing and font size
                </Checkbox.Description>
              </Checkbox>
              <Checkbox checked={state2} onChange={setState2}>
                <Checkbox.Label>Checked state</Checkbox.Label>
              </Checkbox>
            </div>
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
            <div className="flex flex-col gap-3">
              <Checkbox checked={state1} onChange={setState1}>
                <Checkbox.Label>High contrast checkbox</Checkbox.Label>
                <Checkbox.Description>
                  Better visibility with high contrast
                </Checkbox.Description>
              </Checkbox>
              <Checkbox checked={state2} onChange={setState2}>
                <Checkbox.Label>Checked in high contrast</Checkbox.Label>
              </Checkbox>
            </div>
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
            <div className="flex flex-col gap-3">
              <Checkbox checked={state1} onChange={setState1}>
                <Checkbox.Label>Compact spacing</Checkbox.Label>
                <Checkbox.Description>
                  Less space between elements
                </Checkbox.Description>
              </Checkbox>
              <Checkbox checked={state2} onChange={setState2}>
                <Checkbox.Label>Another checkbox</Checkbox.Label>
              </Checkbox>
            </div>
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
            <div className="flex flex-col gap-3">
              <Checkbox checked={state1} onChange={setState1}>
                <Checkbox.Label>Relaxed spacing</Checkbox.Label>
                <Checkbox.Description>
                  More space between elements for better readability
                </Checkbox.Description>
              </Checkbox>
              <Checkbox checked={state2} onChange={setState2}>
                <Checkbox.Label>Another checkbox</Checkbox.Label>
              </Checkbox>
            </div>
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
            <div className="flex flex-col gap-3">
              <Checkbox checked={state1} onChange={setState1}>
                <Checkbox.Label>Small font size</Checkbox.Label>
                <Checkbox.Description>
                  Text rendered with smaller font
                </Checkbox.Description>
              </Checkbox>
              <Checkbox checked={state2} onChange={setState2}>
                <Checkbox.Label>Checked with small font</Checkbox.Label>
              </Checkbox>
            </div>
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
            <div className="flex flex-col gap-3">
              <Checkbox checked={state1} onChange={setState1}>
                <Checkbox.Label>Large font size</Checkbox.Label>
                <Checkbox.Description>
                  Text rendered with larger font for better readability
                </Checkbox.Description>
              </Checkbox>
              <Checkbox checked={state2} onChange={setState2}>
                <Checkbox.Label>Checked with large font</Checkbox.Label>
              </Checkbox>
            </div>
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
            <div className="flex flex-col gap-3">
              <Checkbox checked={state1} onChange={setState1}>
                <Checkbox.Label>No animations</Checkbox.Label>
                <Checkbox.Description>
                  Animations are disabled for reduced motion
                </Checkbox.Description>
              </Checkbox>
              <Checkbox checked={state2} onChange={setState2}>
                <Checkbox.Label>Checked without animations</Checkbox.Label>
              </Checkbox>
            </div>
          </CognitiveSettingsProvider>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-medium text-text-secondary">
            All States with High Contrast
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
            <div className="flex flex-col gap-3">
              <Checkbox checked={false} onChange={fn()}>
                <Checkbox.Label>Unchecked</Checkbox.Label>
              </Checkbox>
              <Checkbox checked={true} onChange={fn()}>
                <Checkbox.Label>Checked</Checkbox.Label>
              </Checkbox>
              <Checkbox checked={false} onChange={fn()} disabled>
                <Checkbox.Label>Disabled unchecked</Checkbox.Label>
              </Checkbox>
              <Checkbox checked={true} onChange={fn()} disabled>
                <Checkbox.Label>Disabled checked</Checkbox.Label>
              </Checkbox>
              <Checkbox checked={false} onChange={fn()}>
                <Checkbox.Label>With description</Checkbox.Label>
                <Checkbox.Description>
                  This is a description
                </Checkbox.Description>
              </Checkbox>
            </div>
          </CognitiveSettingsProvider>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};
