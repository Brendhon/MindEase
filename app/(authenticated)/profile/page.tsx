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
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/next-auth";
import { ProfileContent } from "@/components/profile/profile-content";

export default async function ProfilePage() {
  // Get session on server side
  const session = await getServerSession(authOptions);

  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Prepare user data from session
  const user = {
    id: session.user.id,
    email: session.user.email || "",
    name: session.user.name || null,
    image: session.user.image || null,
  };

  return (
    <ProfileContent 
      user={user}
      data-testid="profile-page-container"
    />
  );
}
