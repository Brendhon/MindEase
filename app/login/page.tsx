/**
 * Login Page - MindEase
 * Authentication page with Google sign-in
 * 
 * Features:
 * - Simple, low cognitive load interface
 * - Accessible design (WCAG compliant)
 * - Keyboard navigation support
 * - Clear visual hierarchy
 */
"use client";

import { Button } from "@/components/ui/button";
import { useAccessibilityClasses } from "@/hooks/accessibility";
import { useAuth } from "@/hooks/auth";
import { useTextDetail } from "@/hooks/accessibility";
import { cn } from "@/utils/ui";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

export default function LoginPage() {
  const { signIn, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Use cognitive settings hook for automatic accessibility class generation
  // Uses default settings when user is not authenticated
  const { spacingClasses, fontSizeClasses, animationClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error("Error signing in:", error);
      // Error handling could be improved with toast notifications
      // For now, NextAuth will handle redirects to error page if needed
    }
  };

  // Generate main classes with spacing preference
  const mainClasses = useMemo(
    () => cn(styles.main, spacingClasses.padding, spacingClasses.gap),
    [spacingClasses.padding, spacingClasses.gap]
  );

  // Generate card classes with spacing preference
  const cardClasses = useMemo(
    () => cn(styles.card, spacingClasses.padding),
    [spacingClasses.padding]
  );

  // Generate title classes with fontSize preference
  const titleClasses = useMemo(
    () => cn(styles.title, fontSizeClasses["3xl"], "mb-4"),
    [fontSizeClasses["3xl"]]
  );

  // Generate description classes with fontSize preference
  const descriptionClasses = useMemo(
    () => cn(styles.description, fontSizeClasses.base, "mb-8"),
    [fontSizeClasses.base]
  );

  // Generate button container classes with spacing preference
  const buttonContainerClasses = useMemo(
    () => cn(styles.buttonContainer, spacingClasses.gap),
    [spacingClasses.gap]
  );

  // Generate disclaimer classes with fontSize preference
  const disclaimerClasses = useMemo(
    () => cn(styles.disclaimer, fontSizeClasses.sm, "mt-6"),
    [fontSizeClasses.sm]
  );

  return (
    <div className={styles.container} data-testid="login-page-container">
      <main className={mainClasses} role="main">
        <section
          className={cn(cardClasses, animationClasses)} // Dynamically updates based on settings.animations
          aria-labelledby="login-title"
          data-testid="login-card"
        >
          <h1 id="login-title" className={titleClasses} data-testid="login-title">
            {getText("login_title")}
          </h1>
          <p className={descriptionClasses} data-testid="login-description">
            {getText("login_description")}
          </p>

          <div className={buttonContainerClasses}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSignIn}
              disabled={isLoading}
              isLoading={isLoading}
              className={styles.button}
              aria-label={getText("login_button_aria")}
              data-testid="login-button-signin"
            >
              <Button.Icon icon={LogIn} position="left" size="lg" />
              <Button.Text>{getText("login_button")}</Button.Text>
            </Button>
          </div>

          <p className={disclaimerClasses} data-testid="login-disclaimer">
            {getText("login_disclaimer")}
          </p>
        </section>
      </main>
    </div>
  );
}

/**
 * Login Page Styles - MindEase
 * Centralized styles for login page
 */

export const styles = {
  container: "flex min-h-screen items-center justify-center bg-bg-secondary font-sans",
  logo: "absolute top-8 left-8",
  main: "flex flex-col items-center justify-center max-w-md w-full",
  card: "w-full bg-surface-primary border border-border-subtle rounded-lg shadow-soft",
  title: "font-semibold text-text-primary leading-tight text-center",
  description: "text-text-secondary leading-relaxed text-center",
  buttonContainer: "w-full flex flex-col",
  button: "w-full",
  disclaimer: "text-text-muted text-center",
} as const;

