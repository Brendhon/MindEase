import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { CognitiveSettingsProvider } from '@/providers/cognitive-settings-provider';
import { SessionProvider } from 'next-auth/react';
import { Select } from './index';
import { useState } from 'react';

const meta = {
  title: 'Components/Form/Select',
  component: Select,
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
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Select component with composition pattern.
 * Uses Select.Label, Select.Field, and Select.Error subcomponents.
 * Built with Headless UI for accessibility.
 */

// Basic select
export const Basic: Story = {
  render: () => (
    <Select>
      <Select.Label htmlFor="basic-select">Country</Select.Label>
      <Select.Field id="basic-select">
        <option value="">Select a country</option>
        <option value="br">Brazil</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
        <option value="ca">Canada</option>
      </Select.Field>
    </Select>
  ),
};

// Select with value
export const WithValue: Story = {
  render: () => (
    <Select>
      <Select.Label htmlFor="value-select">Country</Select.Label>
      <Select.Field id="value-select" defaultValue="br">
        <option value="">Select a country</option>
        <option value="br">Brazil</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
        <option value="ca">Canada</option>
      </Select.Field>
    </Select>
  ),
};

// Select with error
export const WithError: Story = {
  render: () => (
    <Select>
      <Select.Label htmlFor="error-select">Country</Select.Label>
      <Select.Field
        id="error-select"
        aria-invalid="true"
        aria-describedby="error-select-error"
      >
        <option value="">Select a country</option>
        <option value="br">Brazil</option>
        <option value="us">United States</option>
      </Select.Field>
      <Select.Error id="error-select-error">Please select a country</Select.Error>
    </Select>
  ),
};

// Required select
export const Required: Story = {
  render: () => (
    <Select>
      <Select.Label htmlFor="required-select">
        Country <span className="text-feedback-error">*</span>
      </Select.Label>
      <Select.Field id="required-select" required>
        <option value="">Select a country</option>
        <option value="br">Brazil</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
        <option value="ca">Canada</option>
      </Select.Field>
    </Select>
  ),
};

// Disabled select
export const Disabled: Story = {
  render: () => (
    <Select>
      <Select.Label htmlFor="disabled-select">Country</Select.Label>
      <Select.Field id="disabled-select" disabled defaultValue="br">
        <option value="">Select a country</option>
        <option value="br">Brazil</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
        <option value="ca">Canada</option>
      </Select.Field>
    </Select>
  ),
};

// Multiple select
export const Multiple: Story = {
  render: () => (
    <Select>
      <Select.Label htmlFor="multiple-select">Select multiple countries</Select.Label>
      <Select.Field id="multiple-select" multiple className="h-32">
        <option value="br">Brazil</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
        <option value="ca">Canada</option>
        <option value="de">Germany</option>
        <option value="fr">France</option>
        <option value="it">Italy</option>
        <option value="es">Spain</option>
      </Select.Field>
    </Select>
  ),
};

// Form example
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      country: '',
      city: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};

      if (!formData.country) {
        newErrors.country = 'Country is required';
      }
      if (!formData.city) {
        newErrors.city = 'City is required';
      }

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
        alert('Form submitted successfully!');
      }
    };

    return (
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <Select>
          <Select.Label htmlFor="form-country">Country</Select.Label>
          <Select.Field
            id="form-country"
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            aria-invalid={errors.country ? 'true' : 'false'}
            aria-describedby={errors.country ? 'form-country-error' : undefined}
          >
            <option value="">Select a country</option>
            <option value="br">Brazil</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="ca">Canada</option>
          </Select.Field>
          {errors.country && (
            <Select.Error id="form-country-error">{errors.country}</Select.Error>
          )}
        </Select>

        <Select>
          <Select.Label htmlFor="form-city">City</Select.Label>
          <Select.Field
            id="form-city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            aria-invalid={errors.city ? 'true' : 'false'}
            aria-describedby={errors.city ? 'form-city-error' : undefined}
          >
            <option value="">Select a city</option>
            <option value="sp">São Paulo</option>
            <option value="rj">Rio de Janeiro</option>
            <option value="bh">Belo Horizonte</option>
            <option value="poa">Porto Alegre</option>
          </Select.Field>
          {errors.city && (
            <Select.Error id="form-city-error">{errors.city}</Select.Error>
          )}
        </Select>

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

// All select types showcase
export const AllTypes: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-6">
      <Select>
        <Select.Label htmlFor="showcase-basic">Basic Select</Select.Label>
        <Select.Field id="showcase-basic">
          <option value="">Choose an option</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </Select.Field>
      </Select>

      <Select>
        <Select.Label htmlFor="showcase-multiple">Multiple Select</Select.Label>
        <Select.Field id="showcase-multiple" multiple className="h-32">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
          <option value="4">Option 4</option>
          <option value="5">Option 5</option>
        </Select.Field>
      </Select>

      <Select>
        <Select.Label htmlFor="showcase-disabled">Disabled Select</Select.Label>
        <Select.Field id="showcase-disabled" disabled defaultValue="1">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </Select.Field>
      </Select>
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
          <Select>
            <Select.Label htmlFor="normal-select">Normal Select</Select.Label>
            <Select.Field id="normal-select">
              <option value="">Select an option</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
            </Select.Field>
          </Select>
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
          <Select>
            <Select.Label htmlFor="high-contrast-select">High Contrast Select</Select.Label>
            <Select.Field id="high-contrast-select">
              <option value="">Select an option</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
            </Select.Field>
          </Select>
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
          <Select>
            <Select.Label htmlFor="compact-select">Compact Spacing</Select.Label>
            <Select.Field id="compact-select">
              <option value="">Select an option</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
            </Select.Field>
          </Select>
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
          <Select>
            <Select.Label htmlFor="relaxed-select">Relaxed Spacing</Select.Label>
            <Select.Field id="relaxed-select">
              <option value="">Select an option</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
            </Select.Field>
          </Select>
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
          <Select>
            <Select.Label htmlFor="small-font-select">Small Font Select</Select.Label>
            <Select.Field id="small-font-select">
              <option value="">Select an option</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
            </Select.Field>
          </Select>
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
          <Select>
            <Select.Label htmlFor="large-font-select">Large Font Select</Select.Label>
            <Select.Field id="large-font-select">
              <option value="">Select an option</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
            </Select.Field>
          </Select>
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
          <Select>
            <Select.Label htmlFor="no-animations-select">No Animations</Select.Label>
            <Select.Field id="no-animations-select">
              <option value="">Select an option</option>
              <option value="1">Option 1</option>
              <option value="2">Option 2</option>
            </Select.Field>
          </Select>
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
          <Select>
            <Select.Label htmlFor="error-select">Country</Select.Label>
            <Select.Field
              id="error-select"
              aria-invalid="true"
              aria-describedby="error-select-error"
            >
              <option value="">Select a country</option>
              <option value="br">Brazil</option>
              <option value="us">United States</option>
            </Select.Field>
            <Select.Error id="error-select-error">Please select a country</Select.Error>
          </Select>
        </CognitiveSettingsProvider>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};
