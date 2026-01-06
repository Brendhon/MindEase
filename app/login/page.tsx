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
import Image from "next/image";

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

  return (
    <div className={styles.container} data-testid="login-page-container">
      <Image 
        className={styles.logo} 
        src="/logo.png" 
        alt="MindEase Logo" 
        width={80} 
        height={80}
        priority
        data-testid="login-page-logo"
      />
      <main className={styles.main} role="main">
        <section className={styles.card} aria-labelledby="login-title" data-testid="login-card">
          <h1 id="login-title" className={styles.title} data-testid="login-title">
            Bem-vindo ao MindEase
          </h1>
          <p className={styles.description} data-testid="login-description">
            Plataforma de acessibilidade cognitiva para reduzir a carga mental e melhorar seu foco.
          </p>

          <div className={styles.buttonContainer}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleSignIn}
              disabled={isLoading}
              isLoading={isLoading}
              className={styles.button}
              aria-label="Entrar com sua conta do Google"
              data-testid="login-button-signin"
            >
              <Button.Icon icon={LogIn} position="left" size="lg" />
              <Button.Text>Entrar com Google</Button.Text>
            </Button>
          </div>

          <p className={styles.disclaimer} data-testid="login-disclaimer">
            Ao entrar, você concorda com nossos termos de uso e política de privacidade.
          </p>
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: `flex min-h-screen items-center justify-center bg-bg-secondary font-sans`,
  logo: `absolute top-8 left-8`,
  main: `flex flex-col items-center justify-center gap-8 p-8 max-w-md w-full`,
  card: `w-full bg-surface-primary border border-border-subtle rounded-lg shadow-soft p-8`,
  title: `text-3xl font-semibold text-text-primary leading-tight text-center mb-4`,
  description: `text-md text-text-secondary leading-relaxed text-center mb-8`,
  buttonContainer: `w-full flex flex-col gap-4`,
  button: `w-full`,
  disclaimer: `text-sm text-text-muted text-center mt-6`,
} as const;
