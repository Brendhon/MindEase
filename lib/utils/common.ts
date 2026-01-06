import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge class names
 * @param {ClassValue[]} inputs - Class names to be merged
 * @returns {string} - Merged class names
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

/**
 * Removes empty fields from an object
 * @param {T} obj - The object to clean
 * @returns {Partial<T>} - The cleaned object
 */
export const removeEmptyFields = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => value !== '' && value !== undefined && value !== null)
  ) as Partial<T>;
};

// ============================================================================
// Toast Utilities
// ============================================================================

/**
 * Generate a unique ID for the toast
 * Uses crypto.randomUUID() if available, otherwise falls back to a timestamp-based ID
 * @returns {string} A unique identifier
 */
export const generateToastId = (): string => {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};