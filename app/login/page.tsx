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
import { useAuth } from "@/hooks/useAuth";
import { LogIn } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { signIn, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

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

  // Style constants (following project guidelines - no inline classes in JSX)
  const containerStyles = "flex min-h-screen items-center justify-center bg-bg-secondary font-sans";
  const mainStyles = "flex flex-col items-center justify-center gap-8 p-8 max-w-md w-full";
  const cardStyles = "w-full bg-surface-primary border border-border-subtle rounded-lg shadow-soft p-8";
  const titleStyles = "text-3xl font-semibold text-text-primary leading-tight text-center mb-2";
  const descriptionStyles = "text-md text-text-secondary leading-relaxed text-center mb-8";
  const buttonContainerStyles = "w-full flex flex-col gap-4";
  const buttonStyles = "w-full flex items-center justify-center gap-3";
  const disclaimerStyles = "text-sm text-text-muted text-center mt-6";

  return (
    <div className={containerStyles}>
      <main className={mainStyles} role="main">
        <div className={cardStyles}>
          <h1 className={titleStyles}>
            Bem-vindo ao MindEase
          </h1>
          <p className={descriptionStyles}>
            Plataforma de acessibilidade cognitiva para reduzir a carga mental e melhorar seu foco.
          </p>
          
          <div className={buttonContainerStyles}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSignIn}
              disabled={isLoading}
              isLoading={isLoading}
              className={buttonStyles}
              aria-label="Entrar com Google"
            >
              {isLoading ? (
                <>
                  <Button.Loading size="lg" />
                  <Button.Text>Carregando...</Button.Text>
                </>
              ) : (
                <>
                  <Button.Icon icon={LogIn} position="left" size="lg" />
                  <Button.Text>Entrar com Google</Button.Text>
                </>
              )}
            </Button>
          </div>

          <p className={disclaimerStyles}>
            Ao entrar, você concorda com nossos termos de uso e política de privacidade.
          </p>
        </div>
      </main>
    </div>
  );
}

