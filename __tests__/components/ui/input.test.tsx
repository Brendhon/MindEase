import { InputRoot as Input } from '@/components/form/input/input';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  accessibilityMocks,
  textDetailMocks,
  cognitiveSettingsContextMocks,
} from '@/__tests__/__mocks__/hooks';

// Mock useAccessibilityClasses
vi.mock('@/hooks/accessibility', () => ({
  useAccessibilityClasses: () => accessibilityMocks.default(),
  useTextDetail: () => textDetailMocks.default(),
}));

// Mock useCognitiveSettingsContext
vi.mock('@/contexts/cognitive-settings/cognitive-settings-context', () => ({
  useCognitiveSettingsContext: () => cognitiveSettingsContextMocks.default(),
}));

/**
 * Functional tests for Input component
 *
 * Tests renderization, labels, fields, errors, and accessibility.
 */
describe('Input', () => {
  afterEach(() => {
    cleanup();
  });
  describe('Basic Renderization', () => {
    it('should render with label and field', () => {
      render(
        <Input>
          <Input.Label htmlFor="email">Email</Input.Label>
          <Input.Field id="email" type="text" />
        </Input>
      );
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('should render input field', () => {
      render(
        <Input>
          <Input.Label htmlFor="name">Name</Input.Label>
          <Input.Field id="name" type="text" />
        </Input>
      );
      const input = screen.getByLabelText('Name');
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
    });
  });

  describe('Input Types', () => {
    it('should render text input', () => {
      render(
        <Input>
          <Input.Label htmlFor="text">Text Input</Input.Label>
          <Input.Field id="text" type="text" />
        </Input>
      );
      const input = screen.getByLabelText('Text Input') as HTMLInputElement;
      expect(input.type).toBe('text');
    });

    it('should render email input', () => {
      render(
        <Input>
          <Input.Label htmlFor="email">Email Input</Input.Label>
          <Input.Field id="email" type="email" />
        </Input>
      );
      const input = screen.getByLabelText('Email Input') as HTMLInputElement;
      expect(input.type).toBe('email');
    });

    it('should render password input', () => {
      render(
        <Input>
          <Input.Label htmlFor="password">Password</Input.Label>
          <Input.Field id="password" type="password" />
        </Input>
      );
      const input = screen.getByLabelText('Password') as HTMLInputElement;
      expect(input.type).toBe('password');
    });

    it('should render number input', () => {
      render(
        <Input>
          <Input.Label htmlFor="number">Number</Input.Label>
          <Input.Field id="number" type="number" />
        </Input>
      );
      const input = screen.getByLabelText('Number') as HTMLInputElement;
      expect(input.type).toBe('number');
    });
  });

  describe('Textarea', () => {
    it('should render textarea when as="textarea"', () => {
      render(
        <Input>
          <Input.Label htmlFor="description">Description</Input.Label>
          <Input.Field id="description" as="textarea" />
        </Input>
      );
      const textarea = screen.getByLabelText('Description');
      expect(textarea.tagName).toBe('TEXTAREA');
    });

    it('should render textarea when type="textarea"', () => {
      render(
        <Input>
          <Input.Label htmlFor="description">Description</Input.Label>
          <Input.Field id="description" type="textarea" />
        </Input>
      );
      const textarea = screen.getByLabelText('Description');
      expect(textarea.tagName).toBe('TEXTAREA');
    });
  });

  describe('Label-Field Association', () => {
    it('should associate label with field using htmlFor and id', () => {
      render(
        <Input>
          <Input.Label htmlFor="test-input">Test Input</Input.Label>
          <Input.Field id="test-input" type="text" />
        </Input>
      );
      const label = screen.getByText('Test Input');
      const input = screen.getByLabelText('Test Input');
      expect(label.getAttribute('for')).toBe('test-input');
      expect(input.getAttribute('id')).toBe('test-input');
    });

    it('should allow clicking label to focus input', async () => {
      const user = userEvent.setup();

      render(
        <Input>
          <Input.Label htmlFor="focus-test">Focus Test</Input.Label>
          <Input.Field id="focus-test" type="text" />
        </Input>
      );

      const label = screen.getByText('Focus Test');
      const input = screen.getByLabelText('Focus Test') as HTMLInputElement;

      await user.click(label);
      expect(document.activeElement).toBe(input);
    });
  });

  describe('Error Display', () => {
    it('should render error message', () => {
      render(
        <Input>
          <Input.Label htmlFor="error-input">Error Input</Input.Label>
          <Input.Field id="error-input" type="text" />
          <Input.Error>Please enter a valid value</Input.Error>
        </Input>
      );
      expect(
        screen.getByText('Please enter a valid value')
      ).toBeInTheDocument();
    });

    it('should have role="alert" on error message', () => {
      render(
        <Input>
          <Input.Label htmlFor="error-input">Error Input</Input.Label>
          <Input.Field id="error-input" type="text" />
          <Input.Error>Error message</Input.Error>
        </Input>
      );
      const error = screen.getByText('Error message');
      expect(error).toHaveAttribute('role', 'alert');
    });

    it('should associate error with field using aria-describedby', () => {
      render(
        <Input>
          <Input.Label htmlFor="error-input">Error Input</Input.Label>
          <Input.Field
            id="error-input"
            type="text"
            aria-describedby="error-message"
          />
          <Input.Error id="error-message">Error message</Input.Error>
        </Input>
      );
      const input = screen.getByLabelText('Error Input');
      const error = screen.getByText('Error message');
      expect(input).toHaveAttribute('aria-describedby', 'error-message');
      expect(error).toHaveAttribute('id', 'error-message');
    });
  });

  describe('Accessibility', () => {
    it('should have accessible label', () => {
      render(
        <Input>
          <Input.Label htmlFor="accessible-input">Accessible Input</Input.Label>
          <Input.Field id="accessible-input" type="text" />
        </Input>
      );
      const input = screen.getByLabelText('Accessible Input');
      expect(input).toBeInTheDocument();
    });

    it('should support disabled state', () => {
      render(
        <Input>
          <Input.Label htmlFor="disabled-input">Disabled Input</Input.Label>
          <Input.Field id="disabled-input" type="text" disabled />
        </Input>
      );
      const input = screen.getByLabelText('Disabled Input') as HTMLInputElement;
      expect(input).toBeDisabled();
    });

    it('should support required attribute', () => {
      render(
        <Input>
          <Input.Label htmlFor="required-input">Required Input</Input.Label>
          <Input.Field id="required-input" type="text" required />
        </Input>
      );
      const input = screen.getByLabelText('Required Input') as HTMLInputElement;
      expect(input).toBeRequired();
    });
  });

  describe('User Interactions', () => {
    it('should allow typing in input field', async () => {
      const user = userEvent.setup();

      render(
        <Input>
          <Input.Label htmlFor="typing-input">Typing Input</Input.Label>
          <Input.Field id="typing-input" type="text" />
        </Input>
      );

      const input = screen.getByLabelText('Typing Input') as HTMLInputElement;
      await user.type(input, 'Hello World');
      expect(input.value).toBe('Hello World');
    });

    it('should allow typing in textarea', async () => {
      const user = userEvent.setup();

      render(
        <Input>
          <Input.Label htmlFor="typing-textarea">Typing Textarea</Input.Label>
          <Input.Field id="typing-textarea" as="textarea" />
        </Input>
      );

      const textarea = screen.getByLabelText(
        'Typing Textarea'
      ) as HTMLTextAreaElement;
      await user.type(textarea, 'Multi-line text');
      expect(textarea.value).toBe('Multi-line text');
    });

    it('should call onChange handler when typing', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Input>
          <Input.Label htmlFor="onchange-input">OnChange Input</Input.Label>
          <Input.Field
            id="onchange-input"
            type="text"
            onChange={handleChange}
          />
        </Input>
      );

      const input = screen.getByLabelText('OnChange Input');
      await user.type(input, 'test');
      expect(handleChange).toHaveBeenCalled();
    });
  });
});
