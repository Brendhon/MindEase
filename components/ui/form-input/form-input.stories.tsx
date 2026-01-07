import type { Meta, StoryObj } from "@storybook/react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CognitiveSettingsProvider } from "@/providers/cognitive-settings-provider";
import { SessionProvider } from "next-auth/react";
import { FormInput } from "./form-input";

/**
 * FormInput Component - Integrated with react-hook-form and zod
 * 
 * This component automatically:
 * - Connects to react-hook-form context
 * - Displays validation errors from zod schema
 * - Handles accessibility (aria-invalid, aria-describedby)
 * - Generates unique IDs
 * 
 * ## Usage
 * 
 * Always use inside a FormProvider with a zod schema:
 * 
 * ```tsx
 * const schema = z.object({
 *   email: z.string().email("Invalid email"),
 *   password: z.string().min(8, "Min 8 characters"),
 * });
 * 
 * const methods = useForm({
 *   resolver: zodResolver(schema),
 * });
 * 
 * return (
 *   <FormProvider {...methods}>
 *     <form onSubmit={methods.handleSubmit(onSubmit)}>
 *       <FormInput name="email" label="Email" type="email" />
 *       <FormInput name="password" label="Password" type="password" />
 *       <button type="submit">Submit</button>
 *     </form>
 *   </FormProvider>
 * );
 * ```
 */
const meta = {
  title: "Components/FormInput",
  component: FormInput,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Integrated input component for forms with automatic validation and error handling.",
      },
    },
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
} satisfies Meta;

export default meta;
type Story = StoryObj;

// Demo form wrapper with validation
function FormWrapper({ 
  children, 
  schema, 
  defaultValues = {} 
}: { 
  children: React.ReactNode; 
  schema: z.ZodObject<any>; 
  defaultValues?: any;
}) {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    alert(JSON.stringify(data, null, 2));
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 w-80">
        {children}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Submit
        </button>
      </form>
    </FormProvider>
  );
}

/**
 * Basic text input with email validation
 */
export const BasicTextInput: Story = {
  render: () => {
    const schema = z.object({
      email: z.email("Please enter a valid email address"),
    });

    return (
      <FormWrapper schema={schema}>
        <FormInput
          name="email"
          label="Email"
          type="email"
          placeholder="your@email.com"
          required
        />
      </FormWrapper>
    );
  },
};

/**
 * Password input with validation rules
 */
export const PasswordInput: Story = {
  render: () => {
    const schema = z.object({
      password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number"),
    });

    return (
      <FormWrapper schema={schema}>
        <FormInput
          name="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
          helperText="Must be 8+ characters with uppercase and number"
        />
      </FormWrapper>
    );
  },
};

/**
 * Textarea with character limit
 */
export const TextareaInput: Story = {
  render: () => {
    const schema = z.object({
      description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(200, "Description must be less than 200 characters"),
    });

    return (
      <FormWrapper schema={schema}>
        <FormInput
          name="description"
          label="Description"
          as="textarea"
          placeholder="Tell us about yourself..."
          required
          helperText="Between 10 and 200 characters"
        />
      </FormWrapper>
    );
  },
};

/**
 * Multiple fields with different validation rules
 */
export const CompleteForm: Story = {
  render: () => {
    const schema = z.object({
      username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
      email: z.string().email("Invalid email address"),
      age: z.coerce
        .number()
        .min(18, "Must be 18 or older")
        .max(120, "Invalid age"),
      bio: z
        .string()
        .max(500, "Bio must be less than 500 characters")
        .optional(),
    });

    return (
      <FormWrapper 
        schema={schema}
        defaultValues={{
          username: "",
          email: "",
          age: "",
          bio: "",
        }}
      >
        <FormInput
          name="username"
          label="Username"
          type="text"
          placeholder="johndoe"
          required
          helperText="Alphanumeric and underscores only"
        />
        <FormInput
          name="email"
          label="Email"
          type="email"
          placeholder="john@example.com"
          required
        />
        <FormInput
          name="age"
          label="Age"
          type="number"
          placeholder="18"
          required
        />
        <FormInput
          name="bio"
          label="Bio"
          as="textarea"
          placeholder="Tell us about yourself... (optional)"
          helperText="Optional, max 500 characters"
        />
      </FormWrapper>
    );
  },
};

/**
 * Disabled input state
 */
export const DisabledInput: Story = {
  render: () => {
    const schema = z.object({
      email: z.email(),
    });

    return (
      <FormWrapper schema={schema} defaultValues={{ email: "locked@example.com" }}>
        <FormInput
          name="email"
          label="Email (Locked)"
          type="email"
          disabled
          helperText="This field cannot be edited"
        />
      </FormWrapper>
    );
  },
};

/**
 * Input with pre-filled error state (for testing)
 */
export const WithError: Story = {
  render: () => {
    const schema = z.object({
      email: z.email("Please enter a valid email address"),
    });

    return (
      <FormWrapper schema={schema} defaultValues={{ email: "invalid-email" }}>
        <FormInput
          name="email"
          label="Email"
          type="email"
          placeholder="your@email.com"
          required
        />
      </FormWrapper>
    );
  },
};

/**
 * Accessibility test - shows proper ARIA attributes
 */
export const AccessibilityDemo: Story = {
  render: () => {
    const schema = z.object({
      username: z.string().min(3, "Username must be at least 3 characters"),
    });

    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 rounded-md">
          <h3 className="font-bold mb-2">Accessibility Features:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>✅ Unique IDs for label association</li>
            <li>✅ aria-invalid when field has error</li>
            <li>✅ aria-describedby linking to error/helper text</li>
            <li>✅ role="alert" on error messages</li>
            <li>✅ Proper focus management</li>
            <li>✅ Adapts to user accessibility preferences (font size, spacing, contrast, animations)</li>
          </ul>
        </div>
        <FormWrapper schema={schema}>
          <FormInput
            name="username"
            label="Username"
            type="text"
            placeholder="Type at least 3 characters"
            required
            helperText="This is a helper text"
          />
        </FormWrapper>
      </div>
    );
  },
};

// Showcase different accessibility settings
export const AccessibilityShowcase: Story = {
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
          <FormWrapper
            schema={z.object({
              email: z.string().email("Please enter a valid email address"),
            })}
          >
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="your@email.com"
              required
              helperText="We'll never share your email"
            />
          </FormWrapper>
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
          <FormWrapper
            schema={z.object({
              email: z.string().email("Please enter a valid email address"),
            })}
          >
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </FormWrapper>
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
          <FormWrapper
            schema={z.object({
              username: z.string().min(3, "Username must be at least 3 characters"),
            })}
          >
            <FormInput
              name="username"
              label="Username"
              type="text"
              placeholder="johndoe"
              required
            />
          </FormWrapper>
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
          <FormWrapper
            schema={z.object({
              description: z.string().min(10, "Description must be at least 10 characters"),
            })}
          >
            <FormInput
              name="description"
              label="Description"
              as="textarea"
              placeholder="Tell us about yourself..."
              required
            />
          </FormWrapper>
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
          <FormWrapper
            schema={z.object({
              email: z.string().email("Please enter a valid email address"),
            })}
          >
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="your@email.com"
              required
              helperText="Large font for better readability"
            />
          </FormWrapper>
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
          <FormWrapper
            schema={z.object({
              email: z.string().email("Please enter a valid email address"),
            })}
            defaultValues={{ email: "invalid-email" }}
          >
            <FormInput
              name="email"
              label="Email"
              type="email"
              placeholder="your@email.com"
              required
            />
          </FormWrapper>
        </CognitiveSettingsProvider>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

