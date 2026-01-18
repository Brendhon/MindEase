/**
 * Profile Page - MindEase
 * User profile page with identity and session information
 *
 * Features:
 * - Display user information (email, name, image)
 * - Logout functionality
 * - Simple, focused interface
 * - Accessible design (WCAG compliant)
 *
 * This is a Server Component that fetches user data on the server side
 * following Next.js best practices.
 */
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/config/next-auth';
import { ProfileContent } from '@/components/profile';
import { convertSession } from '@/services/auth/auth';

export default async function ProfilePage() {
  // Get session on server side
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect('/login');
  }

  return (
    <ProfileContent
      user={convertSession(session)}
      data-testid="profile-page-container"
    />
  );
}
