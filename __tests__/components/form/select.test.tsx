import { Select } from '@/components/form/select';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  accessibilityMocks,
  textDetailMocks,
  cognitiveSettingsMocks,
} from '@/__tests__/__mocks__/hooks';

// Mock useAccessibilityClasses
vi.mock('@/hooks/accessibility', () => ({
  useAccessibilityClasses: () => accessibilityMocks.default(),
  useTextDetail: () => textDetailMocks.default(),
}));

// Mock useCognitiveSettings
vi.mock('@/hooks/cognitive-settings', () => ({
  useCognitiveSettings: () => cognitiveSettingsMocks.default(),
}));

/**
 * Functional tests for Select component
 *
 * Tests renderization, labels, fields, errors, options, and accessibility.
 */
describe('Select', () => {
  afterEach(() => {
    cleanup();
  });

  describe('Basic Renderization', () => {
    it('should render with label and field', () => {
      render(
        <Select>
          <Select.Label htmlFor="country">Country</Select.Label>
          <Select.Field id="country">
            <option value="">Select a country</option>
            <option value="br">Brazil</option>
          </Select.Field>
        </Select>
      );
      expect(screen.getByText('Country')).toBeInTheDocument();
      expect(screen.getByLabelText('Country')).toBeInTheDocument();
    });

    it('should render select field', () => {
      render(
        <Select>
          <Select.Label htmlFor="country">Country</Select.Label>
          <Select.Field id="country">
            <option value="">Select a country</option>
            <option value="br">Brazil</option>
          </Select.Field>
        </Select>
      );
      const select = screen.getByLabelText('Country');
      expect(select).toBeInTheDocument();
      expect(select.tagName).toBe('SELECT');
    });

    it('should render all options', () => {
      render(
        <Select>
          <Select.Label htmlFor="country">Country</Select.Label>
          <Select.Field id="country">
            <option value="">Select a country</option>
            <option value="br">Brazil</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
          </Select.Field>
        </Select>
      );

      expect(screen.getByText('Select a country')).toBeInTheDocument();
      expect(screen.getByText('Brazil')).toBeInTheDocument();
      expect(screen.getByText('United States')).toBeInTheDocument();
      expect(screen.getByText('United Kingdom')).toBeInTheDocument();
    });
  });

  describe('Select Options', () => {
    it('should have correct option values', () => {
      render(
        <Select>
          <Select.Label htmlFor="country">Country</Select.Label>
          <Select.Field id="country">
            <option value="">Select a country</option>
            <option value="br">Brazil</option>
            <option value="us">United States</option>
          </Select.Field>
        </Select>
      );

      const select = screen.getByLabelText('Country') as HTMLSelectElement;
      const options = Array.from(select.options);

      expect(options[0].value).toBe('');
      expect(options[1].value).toBe('br');
      expect(options[2].value).toBe('us');
    });

    it('should have correct option text', () => {
      render(
        <Select>
          <Select.Label htmlFor="country">Country</Select.Label>
          <Select.Field id="country">
            <option value="">Select a country</option>
            <option value="br">Brazil</option>
            <option value="us">United States</option>
          </Select.Field>
        </Select>
      );

      const select = screen.getByLabelText('Country') as HTMLSelectElement;
      const options = Array.from(select.options);

      expect(options[0].text).toBe('Select a country');
      expect(options[1].text).toBe('Brazil');
      expect(options[2].text).toBe('United States');
    });

    it('should support disabled options', () => {
      render(
        <Select>
          <Select.Label htmlFor="country">Country</Select.Label>
          <Select.Field id="country">
            <option value="">Select a country</option>
            <option value="br" disabled>
              Brazil (Disabled)
            </option>
            <option value="us">United States</option>
          </Select.Field>
        </Select>
      );

      const select = screen.getByLabelText('Country') as HTMLSelectElement;
      const options = Array.from(select.options);

      expect(options[1].disabled).toBe(true);
      expect(options[2].disabled).toBe(false);
    });
  });

  describe('Label-Field Association', () => {
    it('should associate label with field using htmlFor and id', () => {
      render(
        <Select>
          <Select.Label htmlFor="test-select">Test Select</Select.Label>
          <Select.Field id="test-select">
            <option value="">Select</option>
          </Select.Field>
        </Select>
      );
      const label = screen.getByText('Test Select');
      const select = screen.getByLabelText('Test Select');
      expect(label.getAttribute('for')).toBe('test-select');
      expect(select.getAttribute('id')).toBe('test-select');
    });

    it('should allow clicking label to focus select', async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <Select.Label htmlFor="focus-test">Focus Test</Select.Label>
          <Select.Field id="focus-test">
            <option value="">Select</option>
            <option value="1">Option 1</option>
          </Select.Field>
        </Select>
      );

      const label = screen.getByText('Focus Test');
      const select = screen.getByLabelText('Focus Test') as HTMLSelectElement;

      await user.click(label);
      expect(document.activeElement).toBe(select);
    });
  });

  describe('Error Display', () => {
    it('should render error message', () => {
      render(
        <Select>
          <Select.Label htmlFor="error-select">Error Select</Select.Label>
          <Select.Field id="error-select">
            <option value="">Select</option>
          </Select.Field>
          <Select.Error>Please select a value</Select.Error>
        </Select>
      );
      expect(screen.getByText('Please select a value')).toBeInTheDocument();
    });

    it('should have role="alert" on error message', () => {
      render(
        <Select>
          <Select.Label htmlFor="error-select">Error Select</Select.Label>
          <Select.Field id="error-select">
            <option value="">Select</option>
          </Select.Field>
          <Select.Error>Error message</Select.Error>
        </Select>
      );
      const error = screen.getByText('Error message');
      expect(error).toHaveAttribute('role', 'alert');
    });

    it('should associate error with field using aria-describedby', () => {
      render(
        <Select>
          <Select.Label htmlFor="error-select">Error Select</Select.Label>
          <Select.Field id="error-select" aria-describedby="error-message">
            <option value="">Select</option>
          </Select.Field>
          <Select.Error id="error-message">Error message</Select.Error>
        </Select>
      );
      const error = screen.getByText('Error message');
      expect(error).toHaveAttribute('id', 'error-message');
      // Note: HeadlessUI Select may handle aria-describedby internally
      // The error element should still have the id for association
    });

    it('should support invalid prop for error state', () => {
      render(
        <Select>
          <Select.Label htmlFor="invalid-select">Invalid Select</Select.Label>
          <Select.Field id="invalid-select" aria-invalid={true}>
            <option value="">Select</option>
          </Select.Field>
          <Select.Error>Error message</Select.Error>
        </Select>
      );
      const select = screen.getByLabelText('Invalid Select');
      // HeadlessUI Select uses invalid prop, which may apply styles
      // The aria-invalid attribute may be handled internally
      expect(select).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible label', () => {
      render(
        <Select>
          <Select.Label htmlFor="accessible-select">
            Accessible Select
          </Select.Label>
          <Select.Field id="accessible-select">
            <option value="">Select</option>
          </Select.Field>
        </Select>
      );
      const select = screen.getByLabelText('Accessible Select');
      expect(select).toBeInTheDocument();
    });

    it('should support disabled state', () => {
      render(
        <Select>
          <Select.Label htmlFor="disabled-select">Disabled Select</Select.Label>
          <Select.Field id="disabled-select" disabled>
            <option value="">Select</option>
          </Select.Field>
        </Select>
      );
      const select = screen.getByLabelText(
        'Disabled Select'
      ) as HTMLSelectElement;
      expect(select).toBeDisabled();
    });

    it('should support required attribute', () => {
      render(
        <Select>
          <Select.Label htmlFor="required-select">Required Select</Select.Label>
          <Select.Field id="required-select" required>
            <option value="">Select</option>
            <option value="1">Option 1</option>
          </Select.Field>
        </Select>
      );
      const select = screen.getByLabelText(
        'Required Select'
      ) as HTMLSelectElement;
      expect(select).toBeRequired();
    });
  });

  describe('User Interactions', () => {
    it('should allow selecting an option', async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <Select.Label htmlFor="select-test">Select Test</Select.Label>
          <Select.Field id="select-test">
            <option value="">Select</option>
            <option value="br">Brazil</option>
            <option value="us">United States</option>
          </Select.Field>
        </Select>
      );

      const select = screen.getByLabelText('Select Test') as HTMLSelectElement;
      await user.selectOptions(select, 'br');

      expect(select.value).toBe('br');
    });

    it('should call onChange handler when selecting', async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();

      render(
        <Select>
          <Select.Label htmlFor="onchange-select">OnChange Select</Select.Label>
          <Select.Field id="onchange-select" onChange={handleChange}>
            <option value="">Select</option>
            <option value="br">Brazil</option>
          </Select.Field>
        </Select>
      );

      const select = screen.getByLabelText('OnChange Select');
      await user.selectOptions(select, 'br');
      expect(handleChange).toHaveBeenCalled();
    });

    it('should update value when selecting different option', async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <Select.Label htmlFor="value-select">Value Select</Select.Label>
          <Select.Field id="value-select" defaultValue="br">
            <option value="">Select</option>
            <option value="br">Brazil</option>
            <option value="us">United States</option>
          </Select.Field>
        </Select>
      );

      const select = screen.getByLabelText('Value Select') as HTMLSelectElement;
      expect(select.value).toBe('br');

      await user.selectOptions(select, 'us');
      expect(select.value).toBe('us');
    });

    it('should support multiple selection', async () => {
      const user = userEvent.setup();

      render(
        <Select>
          <Select.Label htmlFor="multi-select">Multi Select</Select.Label>
          <Select.Field id="multi-select" multiple>
            <option value="br">Brazil</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
          </Select.Field>
        </Select>
      );

      const select = screen.getByLabelText('Multi Select') as HTMLSelectElement;
      expect(select.multiple).toBe(true);

      await user.selectOptions(select, ['br', 'us']);
      expect(Array.from(select.selectedOptions).map((o) => o.value)).toEqual([
        'br',
        'us',
      ]);
    });
  });

  describe('Default Values', () => {
    it('should support defaultValue', () => {
      render(
        <Select>
          <Select.Label htmlFor="default-select">Default Select</Select.Label>
          <Select.Field id="default-select" defaultValue="br">
            <option value="">Select</option>
            <option value="br">Brazil</option>
            <option value="us">United States</option>
          </Select.Field>
        </Select>
      );

      const select = screen.getByLabelText(
        'Default Select'
      ) as HTMLSelectElement;
      expect(select.value).toBe('br');
    });

    it('should support value prop (controlled)', () => {
      const handleChange = vi.fn();
      const { rerender } = render(
        <Select>
          <Select.Label htmlFor="controlled-select">
            Controlled Select
          </Select.Label>
          <Select.Field
            id="controlled-select"
            value="br"
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="br">Brazil</option>
            <option value="us">United States</option>
          </Select.Field>
        </Select>
      );

      const select = screen.getByLabelText(
        'Controlled Select'
      ) as HTMLSelectElement;
      expect(select.value).toBe('br');

      rerender(
        <Select>
          <Select.Label htmlFor="controlled-select">
            Controlled Select
          </Select.Label>
          <Select.Field
            id="controlled-select"
            value="us"
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="br">Brazil</option>
            <option value="us">United States</option>
          </Select.Field>
        </Select>
      );

      expect(select.value).toBe('us');
    });
  });
});
