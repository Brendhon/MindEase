import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { fn } from 'storybook/test';
import { Button } from './index';
import { LogIn, Save, Trash2, Download, Upload, Settings } from 'lucide-react';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost'],
      description: 'Button variant style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
  },
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Button component with composition pattern.
 * Uses Button.Text, Button.Icon, and Button.Loading subcomponents.
 */

// Basic variants
export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: <Button.Text>Primary Button</Button.Text>,
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    children: <Button.Text>Secondary Button</Button.Text>,
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    children: <Button.Text>Ghost Button</Button.Text>,
  },
};

// Sizes
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: <Button.Text>Small Button</Button.Text>,
  },
};

export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: <Button.Text>Medium Button</Button.Text>,
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: <Button.Text>Large Button</Button.Text>,
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: (
      <>
        <Button.Icon icon={LogIn} position="left" />
        <Button.Text>Sign In</Button.Text>
      </>
    ),
  },
};

export const WithRightIcon: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: (
      <>
        <Button.Text>Download</Button.Text>
        <Button.Icon icon={Download} position="right" />
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    'aria-label': 'Settings',
    children: <Button.Icon icon={Settings} />,
  },
};

// Loading states
export const Loading: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    isLoading: true,
    children: <Button.Text>Saving...</Button.Text>,
  },
};

export const LoadingWithText: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    isLoading: true,
    children: (
      <>
        <Button.Loading />
        <Button.Text>Processing</Button.Text>
      </>
    ),
  },
};

// Disabled states
export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    disabled: true,
    children: <Button.Text>Disabled Button</Button.Text>,
  },
};

export const DisabledSecondary: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    disabled: true,
    children: <Button.Text>Disabled Secondary</Button.Text>,
  },
};

// Complex compositions
export const SaveWithIcon: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: (
      <>
        <Button.Icon icon={Save} position="left" />
        <Button.Text>Save Changes</Button.Text>
      </>
    ),
  },
};

export const DeleteWithIcon: Story = {
  args: {
    variant: 'secondary',
    size: 'md',
    children: (
      <>
        <Button.Icon icon={Trash2} position="left" />
        <Button.Text>Delete</Button.Text>
      </>
    ),
  },
};

export const UploadWithIcon: Story = {
  args: {
    variant: 'ghost',
    size: 'md',
    children: (
      <>
        <Button.Icon icon={Upload} position="left" />
        <Button.Text>Upload File</Button.Text>
      </>
    ),
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3 items-center">
        <Button variant="primary" size="md">
          <Button.Text>Primary</Button.Text>
        </Button>
        <Button variant="secondary" size="md">
          <Button.Text>Secondary</Button.Text>
        </Button>
        <Button variant="ghost" size="md">
          <Button.Text>Ghost</Button.Text>
        </Button>
      </div>
      <div className="flex gap-3 items-center">
        <Button variant="primary" size="sm">
          <Button.Text>Small</Button.Text>
        </Button>
        <Button variant="primary" size="md">
          <Button.Text>Medium</Button.Text>
        </Button>
        <Button variant="primary" size="lg">
          <Button.Text>Large</Button.Text>
        </Button>
      </div>
      <div className="flex gap-3 items-center">
        <Button variant="primary" size="md" isLoading>
          <Button.Text>Loading</Button.Text>
        </Button>
        <Button variant="primary" size="md" disabled>
          <Button.Text>Disabled</Button.Text>
        </Button>
      </div>
    </div>
  ),
};

