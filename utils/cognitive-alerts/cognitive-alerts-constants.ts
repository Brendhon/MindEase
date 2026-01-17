/**
 * Cognitive Alerts Constants - MindEase
 * Shared constants for cognitive alerts thresholds and configuration
 */

/**
 * Excessive time alert threshold
 * Alert shown when user has been focusing on the same task for this duration
 * Default: 60 minutes (2 standard Pomodoro sessions)
 * Advanced users: 90 minutes (3 standard Pomodoro sessions)
 */
const DEFAULT_EXCESSIVE_TIME_THRESHOLD = 60; // 60 minutes in milliseconds
export const EXCESSIVE_TIME_THRESHOLD_MS = DEFAULT_EXCESSIVE_TIME_THRESHOLD * 60 * 1000; // 60 minutes in milliseconds

/**
 * Missing break alert threshold
 * Alert shown when user completes this many consecutive focus sessions without taking a break
 */
export const MISSING_BREAK_SESSIONS_THRESHOLD = 3;

/**
 * Missing break alert dismiss expiry
 * Time after which a dismissed alert can be shown again
 * Default: 2 hours
 */
const DEFAULT_COGNITIVE_ALERT_DISMISS_EXPIRY = 2; // 2 hours in milliseconds
export const COGNITIVE_ALERT_DISMISS_EXPIRY_MS = DEFAULT_COGNITIVE_ALERT_DISMISS_EXPIRY * 60 * 60 * 1000; // 2 hours in milliseconds

/**
 * Prolonged navigation alert threshold
 * Alert shown when user has been navigating the app without actions for this duration
 */
const DEFAULT_PROLONGED_NAVIGATION_THRESHOLD = 10; // 10 minutes in milliseconds
export const PROLONGED_NAVIGATION_THRESHOLD_MS = DEFAULT_PROLONGED_NAVIGATION_THRESHOLD * 60 * 1000; // 10 minutes in milliseconds

/**
 * Minimum time between alerts
 * Prevents showing alerts too frequently (one alert every 20-30 minutes)
 * Default: 20 minutes
 */
const DEFAULT_MIN_ALERT_INTERVAL = 20; // 20 minutes in milliseconds
export const MIN_ALERT_INTERVAL_MS = DEFAULT_MIN_ALERT_INTERVAL * 60 * 1000; // 20 minutes in milliseconds
