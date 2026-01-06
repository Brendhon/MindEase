/**
 * Profile Page - MindEase
 * User profile and preferences settings
 */
export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6" data-testid="profile-page-container">
      <h1 className="text-3xl font-semibold text-text-primary" data-testid="profile-title">
        Hello from Profile
      </h1>
      <p className="text-lg text-text-secondary" data-testid="profile-description">
        Perfil e preferências
      </p>
    </div>
  );
}

