import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CognitiveSettingsProvider } from '@/providers/cognitive-settings-provider';
import { SessionProvider } from 'next-auth/react';
import { Input } from './index';
import { useState } from 'react';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
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
      description: 'Additional CSS classes',
    },
  },
  args: {
    children: null,
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Input component with composition pattern.
 * Uses Input.Label, Input.Field, and Input.Error subcomponents.
 * Built with Headless UI for accessibility.
 */

// Basic input
export const Basic: Story = {
  render: () => (
    <Input>
      <Input.Label htmlFor="basic-input">Name</Input.Label>
      <Input.Field id="basic-input" type="text" placeholder="Enter your name" />
    </Input>
  ),
};

// Input with value
export const WithValue: Story = {
  render: () => (
    <Input>
      <Input.Label htmlFor="value-input">Email</Input.Label>
      <Input.Field
        id="value-input"
        type="email"
        placeholder="Enter your email"
        defaultValue="user@example.com"
      />
    </Input>
  ),
};

// Input with error
export const WithError: Story = {
  render: () => (
    <Input>
      <Input.Label htmlFor="error-input">Email</Input.Label>
      <Input.Field
        id="error-input"
        type="email"
        placeholder="Enter your email"
        aria-invalid="true"
        aria-describedby="error-input-error"
      />
      <Input.Error id="error-input-error">Please enter a valid email address</Input.Error>
    </Input>
  ),
};

// Password input
export const Password: Story = {
  render: () => (
    <Input>
      <Input.Label htmlFor="password-input">Password</Input.Label>
      <Input.Field
        id="password-input"
        type="password"
        placeholder="Enter your password"
      />
    </Input>
  ),
};

// Number input
export const Number: Story = {
  render: () => (
    <Input>
      <Input.Label htmlFor="number-input">Age</Input.Label>
      <Input.Field
        id="number-input"
        type="number"
        placeholder="Enter your age"
        min={0}
        max={120}
      />
    </Input>
  ),
};

// Textarea
export const Textarea: Story = {
  render: () => (
    <Input>
      <Input.Label htmlFor="textarea-input">Description</Input.Label>
      <Input.Field
        id="textarea-input"
        as="textarea"
        placeholder="Enter a description"
        rows={4}
      />
    </Input>
  ),
};

// Textarea with error
export const TextareaWithError: Story = {
  render: () => (
    <Input>
      <Input.Label htmlFor="textarea-error-input">Description</Input.Label>
      <Input.Field
        id="textarea-error-input"
        as="textarea"
        placeholder="Enter a description"
        rows={4}
        aria-invalid="true"
        aria-describedby="textarea-error-input-error"
      />
      <Input.Error id="textarea-error-input-error">
        Description must be at least 10 characters
      </Input.Error>
    </Input>
  ),
};

// Required input
export const Required: Story = {
  render: () => (
    <Input>
      <Input.Label htmlFor="required-input">
        Email <span className="text-feedback-error">*</span>
      </Input.Label>
      <Input.Field
        id="required-input"
        type="email"
        placeholder="Enter your email"
        required
      />
    </Input>
  ),
};

// Disabled input
export const Disabled: Story = {
  render: () => (
    <Input>
      <Input.Label htmlFor="disabled-input">Disabled Input</Input.Label>
      <Input.Field
        id="disabled-input"
        type="text"
        placeholder="This input is disabled"
        disabled
        defaultValue="Disabled value"
      />
    </Input>
  ),
};

// Readonly input
export const Readonly: Story = {
  render: () => (
    <Input>
      <Input.Label htmlFor="readonly-input">Readonly Input</Input.Label>
      <Input.Field
        id="readonly-input"
        type="text"
        defaultValue="This value cannot be changed"
        readOnly
      />
    </Input>
  ),
};

// Form example
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};

      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!formData.message) {
        newErrors.message = 'Message is required';
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        alert('Form submitted successfully!');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <Input>
          <Input.Label htmlFor="form-name">Name</Input.Label>
          <Input.Field
            id="form-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            aria-invalid={errors.name ? 'true' : 'false'}
            aria-describedby={errors.name ? 'form-name-error' : undefined}
          />
          {errors.name && (
            <Input.Error id="form-name-error">{errors.name}</Input.Error>
          )}
        </Input>

        <Input>
          <Input.Label htmlFor="form-email">Email</Input.Label>
          <Input.Field
            id="form-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'form-email-error' : undefined}
          />
          {errors.email && (
            <Input.Error id="form-email-error">{errors.email}</Input.Error>
          )}
        </Input>

        <Input>
          <Input.Label htmlFor="form-message">Message</Input.Label>
          <Input.Field
            id="form-message"
            as="textarea"
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            aria-invalid={errors.message ? 'true' : 'false'}
            aria-describedby={errors.message ? 'form-message-error' : undefined}
          />
          {errors.message && (
            <Input.Error id="form-message-error">{errors.message}</Input.Error>
          )}
        </Input>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-action-primary text-text-inverse rounded-md hover:opacity-90"
        >
          Submit
        </button>
      </form>
    );
  },
};

// All input types showcase
export const AllTypes: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-6">
      <Input>
        <Input.Label htmlFor="showcase-text">Text Input</Input.Label>
        <Input.Field id="showcase-text" type="text" placeholder="Enter text" />
      </Input>

      <Input>
        <Input.Label htmlFor="showcase-email">Email Input</Input.Label>
        <Input.Field id="showcase-email" type="email" placeholder="Enter email" />
      </Input>

      <Input>
        <Input.Label htmlFor="showcase-password">Password Input</Input.Label>
        <Input.Field id="showcase-password" type="password" placeholder="Enter password" />
      </Input>

      <Input>
        <Input.Label htmlFor="showcase-number">Number Input</Input.Label>
        <Input.Field id="showcase-number" type="number" placeholder="Enter number" />
      </Input>

      <Input>
        <Input.Label htmlFor="showcase-textarea">Textarea</Input.Label>
        <Input.Field id="showcase-textarea" as="textarea" placeholder="Enter text" rows={3} />
      </Input>
    </div>
  ),
};

// Showcase different accessibility settings
export const AccessibilityShowcase: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div className="flex gap-6 flex-col p-6 w-full max-w-2xl">
      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">Normal Settings</h3>
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
          <Input>
            <Input.Label htmlFor="normal-input">Normal Input</Input.Label>
            <Input.Field id="normal-input" type="text" placeholder="Enter text" />
          </Input>
        </CognitiveSettingsProvider>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">High Contrast</h3>
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
          <Input>
            <Input.Label htmlFor="high-contrast-input">High Contrast Input</Input.Label>
            <Input.Field id="high-contrast-input" type="text" placeholder="Enter text" />
          </Input>
        </CognitiveSettingsProvider>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">Compact Spacing</h3>
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
          <Input>
            <Input.Label htmlFor="compact-input">Compact Spacing</Input.Label>
            <Input.Field id="compact-input" type="text" placeholder="Enter text" />
          </Input>
        </CognitiveSettingsProvider>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">Relaxed Spacing</h3>
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
          <Input>
            <Input.Label htmlFor="relaxed-input">Relaxed Spacing</Input.Label>
            <Input.Field id="relaxed-input" type="text" placeholder="Enter text" />
          </Input>
        </CognitiveSettingsProvider>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">Small Font</h3>
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
          <Input>
            <Input.Label htmlFor="small-font-input">Small Font Input</Input.Label>
            <Input.Field id="small-font-input" type="text" placeholder="Enter text" />
          </Input>
        </CognitiveSettingsProvider>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">Large Font</h3>
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
          <Input>
            <Input.Label htmlFor="large-font-input">Large Font Input</Input.Label>
            <Input.Field id="large-font-input" type="text" placeholder="Enter text" />
          </Input>
        </CognitiveSettingsProvider>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">Animations Disabled</h3>
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
          <Input>
            <Input.Label htmlFor="no-animations-input">No Animations</Input.Label>
            <Input.Field id="no-animations-input" type="text" placeholder="Enter text" />
          </Input>
        </CognitiveSettingsProvider>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-text-secondary">High Contrast with Error</h3>
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
          <Input>
            <Input.Label htmlFor="error-input">Email</Input.Label>
            <Input.Field
              id="error-input"
              type="email"
              placeholder="Enter email"
              aria-invalid="true"
              aria-describedby="error-input-error"
            />
            <Input.Error id="error-input-error">Please enter a valid email address</Input.Error>
          </Input>
        </CognitiveSettingsProvider>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

