/**
 * Root Page - MindEase
 * 
 * Redirects users based on authentication state.
 * 
 * The proxy (middleware) handles most redirects, but this serves as a fallback
 * to ensure the root route always redirects appropriately:
 * - Authenticated users → /dashboard (handled by proxy)
 * - Unauthenticated users → /login
 */
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/next-auth";
import { PAGE_ROUTES, PROTECTED_ROUTES } from "@/utils/routes";

export default async function RootPage() {
  const session = await getServerSession(authOptions);

  // Redirect authenticated users to dashboard
  if (session) {
    redirect(PROTECTED_ROUTES.DASHBOARD);
  }

  // Redirect unauthenticated users to login
  redirect(PAGE_ROUTES.LOGIN);
}