/**
 * Dashboard Cognitive Alerts Component - MindEase
 * Centralized exports for dashboard cognitive alerts component
 */

export { DashboardCognitiveAlerts } from "./dashboard-cognitive-alerts";
export type { DashboardCognitiveAlertsProps } from "./dashboard-cognitive-alerts";

export { CognitiveAlertBanner } from "./cognitive-alert-banner";
export type { CognitiveAlertBannerProps } from "./cognitive-alert-banner";

export { CognitiveAlertExcessiveTime } from "./cognitive-alert-excessive-time";
export type { CognitiveAlertExcessiveTimeProps } from "./cognitive-alert-excessive-time";

export { CognitiveAlertMissingBreak } from "./cognitive-alert-missing-break";
export type { CognitiveAlertMissingBreakProps } from "./cognitive-alert-missing-break";

export { CognitiveAlertProlongedNavigation } from "./cognitive-alert-prolonged-navigation";
export type { CognitiveAlertProlongedNavigationProps } from "./cognitive-alert-prolonged-navigation";

export { styles } from "./dashboard-cognitive-alerts-styles";
export { getContrastClassesForAlerts } from "./dashboard-cognitive-alerts-styles";

export {
  EXCESSIVE_TIME_THRESHOLD_MS,
  MISSING_BREAK_SESSIONS_THRESHOLD,
  PROLONGED_NAVIGATION_THRESHOLD_MS,
  MIN_ALERT_INTERVAL_MS,
} from "./cognitive-alerts-constants";
