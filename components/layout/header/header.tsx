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
    <header className="h-16 bg-surface-primary border-b border-border-subtle flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="MindEase Logo"
          width={32}
          height={32}
          className="object-contain"
          priority
        />
        <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLogout}
        disabled={isLoading}
        aria-label="Sair da conta"
        className="flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" aria-hidden="true" />
        <span>Sair</span>
      </Button>
    </header>
  );
}

