/**
 * Timer Helpers - MindEase
 * Shared utility functions for timer management
 * 
 * Pure functions for timer calculations and formatting.
 * These functions are testable and reusable across different timer implementations.
 */

/**
 * Format time in seconds to MM:SS string
 * Pure function - easily testable
 * 
 * @param seconds - Time in seconds
 * @returns Formatted time string (MM:SS)
 * 
 * @example
 * formatTime(125) // "02:05"
 * formatTime(3661) // "61:01"
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

/**
 * Calculate remaining time based on start time and initial duration
 * Pure function - easily testable
 * 
 * @param startTime - When the timer started
 * @param initialDuration - Initial duration in seconds
 * @param currentTime - Current time (defaults to now)
 * @returns Remaining time in seconds (never negative)
 * 
 * @example
 * const start = new Date('2024-01-01T10:00:00');
 * const now = new Date('2024-01-01T10:05:00');
 * calculateRemainingTime(start, 600, now) // 300 (5 minutes remaining)
 */
export function calculateRemainingTime(
  startTime: Date,
  initialDuration: number,
  currentTime: Date = new Date()
): number {
  const elapsed = Math.floor((currentTime.getTime() - startTime.getTime()) / 1000);
  return Math.max(0, initialDuration - elapsed);
}

/**
 * Check if timer has completed based on remaining time
 * Pure function - easily testable
 * 
 * @param remainingTime - Remaining time in seconds
 * @returns True if timer has completed (remainingTime <= 0)
 * 
 * @example
 * isTimerCompleted(0) // true
 * isTimerCompleted(-1) // true
 * isTimerCompleted(1) // false
 */
export function isTimerCompleted(remainingTime: number): boolean {
  return remainingTime <= 0;
}
