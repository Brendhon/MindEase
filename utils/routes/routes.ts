/**
 * Application route constants
 * 
 * Centralized route definitions to facilitate maintenance and avoid hardcoded routes.
 * Routes are organized by category (pages and API) for better organization and type safety.
 * 
 * @module utils/routes/routes
 */

/**
 * Public page routes (accessible without authentication)
 */
export const PAGE_ROUTES = {
  /** Home page - landing page for unauthenticated users */
  HOME: '/',
  /** Login page - authentication page with Google sign-in */
  LOGIN: '/login',
  /** 404 error page */
  NOT_FOUND: '/404',
} as const;

/**
 * Protected page routes (require authentication)
 */
export const PROTECTED_ROUTES = {
  /** Dashboard - cognitive panel with interface complexity adjustments */
  DASHBOARD: '/dashboard',
  /** Tasks - task organizer with simplified lists and focus timer */
  TASKS: '/tasks',
  /** Profile - user profile and preferences settings */
  PROFILE: '/profile',
} as const;

/**
 * API route endpoints
 */
export const API_ROUTES = {
  /** API base prefix */
  BASE: '/api',
  
  /** Authentication endpoints */
  AUTH: {
    /** Firebase authentication endpoint */
    FIREBASE: '/api/auth',
  },
  
  /** Task endpoints */
  TASKS: {
    /** Base tasks endpoint */
    BASE: '/api/tasks',
    /**
     * Creates a dynamic route URL for a task by ID.
     * 
     * @param {string} id - The task ID (must be a non-empty string)
     * @returns {string} The complete API route URL for the task
     * @throws {Error} If id is empty or invalid
     * 
     * @example
     * const route = API_ROUTES.TASKS.BY_ID('507f1f77bcf86cd799439011');
     * // Returns: '/api/tasks/507f1f77bcf86cd799439011'
     */
    BY_ID: (id: string): string => {
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error('Task ID must be a non-empty string');
      }
      return `/api/tasks/${id}`;
    },
  },
  
  /** User endpoints */
  USERS: {
    /** Base users endpoint */
    BASE: '/api/users',
    /**
     * Creates a dynamic route URL for a user by ID.
     * 
     * @param {string} id - The user ID (must be a non-empty string)
     * @returns {string} The complete API route URL for the user
     * @throws {Error} If id is empty or invalid
     * 
     * @example
     * const route = API_ROUTES.USERS.BY_ID('user123');
     * // Returns: '/api/users/user123'
     */
    BY_ID: (id: string): string => {
      if (!id || typeof id !== 'string' || id.trim() === '') {
        throw new Error('User ID must be a non-empty string');
      }
      return `/api/users/${id}`;
    },
    /** User preferences endpoint */
    PREFERENCES: '/api/users/preferences',
  },
} as const;

/**
 * All page routes combined (public + protected)
 */
export const ALL_PAGE_ROUTES = {
  ...PAGE_ROUTES,
  ...PROTECTED_ROUTES,
} as const;

/**
 * Type definitions for route values
 */
export type PageRoute = typeof PAGE_ROUTES[keyof typeof PAGE_ROUTES];
export type ProtectedRoute = typeof PROTECTED_ROUTES[keyof typeof PROTECTED_ROUTES];
export type AllPageRoute = typeof ALL_PAGE_ROUTES[keyof typeof ALL_PAGE_ROUTES];

