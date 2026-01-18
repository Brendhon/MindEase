import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests - MindEase
 *
 * Tests the authentication flow and route protection.
 * Simple tests focusing on basic authentication scenarios.
 */
test.describe('Authentication', () => {
  test('should redirect unauthenticated users to login page', async ({
    page,
  }) => {
    // Try to access protected route
    await page.goto('/dashboard');

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-page-container')).toBeVisible();
  });

  test('should redirect from root to login when not authenticated', async ({
    page,
  }) => {
    // Access root page
    await page.goto('/');

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByTestId('login-page-container')).toBeVisible();
  });

  test('should display login page elements', async ({ page }) => {
    await page.goto('/login');

    // Check login page elements are visible
    await expect(page.getByTestId('login-page-container')).toBeVisible();
    await expect(page.getByTestId('login-card')).toBeVisible();
    await expect(page.getByTestId('login-title')).toBeVisible();
    await expect(page.getByTestId('login-description')).toBeVisible();
    await expect(page.getByTestId('login-button-signin')).toBeVisible();
  });

  test('should protect tasks route', async ({ page }) => {
    // Try to access tasks page without authentication
    await page.goto('/tasks');

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should protect profile route', async ({ page }) => {
    // Try to access profile page without authentication
    await page.goto('/profile');

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });
});
