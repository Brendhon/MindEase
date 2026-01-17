"use client";

import { PageContainer } from "@/components/layout";
import { Button } from "@/components/ui";
import { useAccessibilityClasses } from "@/hooks/accessibility";
import { useTextDetail } from "@/hooks/accessibility";
import { PAGE_ROUTES } from "@/utils/routes";
import { cn } from "@/utils/ui";
import Link from "next/link";
import { useMemo } from "react";

/**
 * 404 Page - MindEase
 * Error page for not found routes with cognitive accessibility features
 * 
 * This page is displayed when users navigate to a route that doesn't exist.
 * It provides clear navigation options and follows cognitive accessibility principles.
 */
export default function NotFound404Page() {
  // Use cognitive settings hook for automatic accessibility class generation
  // Uses default settings when user is not authenticated
  const { spacingClasses, fontSizeClasses, animationClasses } = useAccessibilityClasses();
  const { getText } = useTextDetail();

  // Generate content classes with spacing preference
  const contentClasses = useMemo(
    () => cn(styles.content, spacingClasses.gap),
    [spacingClasses.gap]
  );

  // Generate header classes with spacing preference
  const headerClasses = useMemo(
    () => cn(styles.header, spacingClasses.gap),
    [spacingClasses.gap]
  );

  // Generate title classes with fontSize preference
  const titleClasses = useMemo(
    () => cn(styles.title, fontSizeClasses["3xl"]),
    [fontSizeClasses["3xl"]]
  );

  // Generate subtitle classes with fontSize preference
  const subtitleClasses = useMemo(
    () => cn(styles.subtitle, fontSizeClasses.xl),
    [fontSizeClasses.xl]
  );

  // Generate description classes with fontSize preference
  const descriptionClasses = useMemo(
    () => cn(styles.description, fontSizeClasses.base),
    [fontSizeClasses.base]
  );

  // Generate actions classes with spacing preference
  const actionsClasses = useMemo(
    () => cn(styles.actions, spacingClasses.gap, "mt-4"),
    [spacingClasses.gap]
  );

  return (
    <div className={styles.container}>
      <main className={cn(styles.main, animationClasses)} role="main">
        <PageContainer>
          <div className={contentClasses}>
            <div className={headerClasses}>
              <h1 className={titleClasses}>404</h1>
              <h2 className={subtitleClasses}>
                {getText("page_404_subtitle")}
              </h2>
              <p className={descriptionClasses}>
                {getText("page_404_description")}
              </p>
            </div>

            <div className={actionsClasses}>
              <Link href={PAGE_ROUTES.HOME}>
                <Button variant="primary" size="lg" className={styles.primaryButton}>
                  <Button.Text>{getText("page_404_button_home")}</Button.Text>
                </Button>
              </Link>
              <Link href={PAGE_ROUTES.LOGIN}>
                <Button variant="ghost" size="md" className={styles.secondaryButton}>
                  <Button.Text>{getText("page_404_button_login")}</Button.Text>
                </Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}

/**
 * 404 Page Styles - MindEase
 * Centralized styles for 404 error page
 */

export const styles = {
  container: "flex min-h-screen items-center justify-center bg-bg-secondary font-sans",
  main: "flex flex-col items-center justify-center w-full",
  content: "flex flex-col items-center justify-center text-center",
  header: "flex flex-col",
  title: "font-bold text-text-primary",
  subtitle: "font-semibold text-text-primary",
  description: "max-w-md leading-relaxed text-text-secondary",
  actions: "flex flex-col mt-4",
  primaryButton: "w-full",
  secondaryButton: "w-full",
} as const;
