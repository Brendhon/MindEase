/**
 * Header Component - MindEase
 * Main header for authenticated layout
 */
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";

export interface HeaderProps {
  title?: string;
}

export function Header({ title = "MindEase" }: HeaderProps) {
  const { signOut, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="h-16 bg-surface-primary border-b border-border-subtle flex items-center justify-between px-6" data-testid="header-container">
      <div className="flex items-center gap-3" data-testid="header-branding">
        <Image
          src="/logo.png"
          alt="MindEase Logo"
          width={32}
          height={32}
          className="object-contain"
          priority
          data-testid="header-logo"
        />
        <h1 className="text-lg font-semibold text-text-primary" data-testid="header-title">{title}</h1>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        disabled={isLoading}
        isLoading={isLoading}
        aria-label="Sair da conta"
        data-testid="header-button-logout"
      >
        {isLoading ? (
          <>
            <Button.Loading size="sm" />
            <Button.Text>Saindo...</Button.Text>
          </>
        ) : (
          <>
            <Button.Icon icon={LogOut} position="left" size="sm" />
            <Button.Text>Sair</Button.Text>
          </>
        )}
      </Button>
    </header>
  );
}

