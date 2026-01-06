import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge class names
 * @param {ClassValue[]} inputs - Class names to be merged
 * @returns {string} - Merged class names
 */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

// ============================================================================
// Toast Utilities
// ============================================================================

/**
 * Generate a random UUID for the application
 * Uses crypto.randomUUID() if available, otherwise falls back to a timestamp-based ID
 * @returns {string} A unique identifier
 */
export const generateRandomUUID = (): string => {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};