import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/page-container";
import { PAGE_ROUTES } from "@/utils/routes";

/**
 * 404 Page - MindEase
 * Error page for not found routes with cognitive accessibility features
 * 
 * This page is displayed when users navigate to a route that doesn't exist.
 * It provides clear navigation options and follows cognitive accessibility principles.
 */
export default function NotFound404Page() {
  return (
    <div className={styles.container}>
      <main className={styles.main} role="main">
        <PageContainer>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 className={styles.title}>404</h1>
              <h2 className={styles.subtitle}>
                Página não encontrada
              </h2>
              <p className={styles.description}>
                A página que você está procurando não existe ou foi movida.
              </p>
            </div>

            <div className={styles.actions}>
              <Link href={PAGE_ROUTES.HOME}>
                <Button variant="primary" size="lg" className={styles.primaryButton}>
                  Voltar para a página inicial
                </Button>
              </Link>
              <Link href={PAGE_ROUTES.LOGIN}>
                <Button variant="ghost" size="md" className={styles.secondaryButton}>
                  Ir para o login
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}

const styles = {
  container: "flex min-h-screen items-center justify-center bg-bg-secondary font-sans",
  main: "flex flex-col items-center justify-center w-full",
  content: "flex flex-col items-center justify-center gap-6 text-center",
  header: "flex flex-col gap-4",
  title: "text-6xl font-bold text-text-primary",
  subtitle: "text-2xl font-semibold text-text-primary",
  description: "max-w-md text-lg leading-relaxed text-text-secondary",
  actions: "flex flex-col gap-3 mt-4",
  primaryButton: "w-full",
  secondaryButton: "w-full",
} as const;

