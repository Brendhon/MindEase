"use client";

import { useFeedback } from "@/hooks/useFeedback";

/**
 * Home Page - MindEase
 * Demonstrating cognitive accessibility design tokens using Tailwind classes
 * Includes examples of useFeedback hook usage
 */
export default function Home() {
  const { success, error, warning, info } = useFeedback();

  const handleSuccessExample = () => {
    success("Operação realizada com sucesso!");
  };

  const handleErrorExample = () => {
    error("Erro ao processar a solicitação");
  };

  const handleWarningExample = () => {
    warning("Esta ação não pode ser desfeita");
  };

  const handleInfoExample = () => {
    info("Nova funcionalidade disponível");
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-secondary font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-16 px-8 bg-surface-primary sm:items-start">
        {/* Main Content */}
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold tracking-tight leading-tight text-text-primary">
            MindEase Design System
          </h1>
          
          <p className="max-w-md text-lg leading-relaxed text-text-secondary">
            Sistema de design com foco em acessibilidade cognitiva. Explore os{" "}
            <a
              href="https://vercel.com/templates?framework=next.js"
              className="font-medium text-action-primary hover:text-action-primary-hover transition-colors duration-150"
            >
              Templates
            </a>{" "}
            ou visite o{" "}
            <a
              href="https://nextjs.org/learn"
              className="font-medium text-action-primary hover:text-action-primary-hover transition-colors duration-150"
            >
              Centro de Aprendizado
            </a>
            .
          </p>

          {/* Token Demo Section */}
          <div className="w-full max-w-md p-4 mt-4 border border-border-subtle rounded-md bg-bg-primary shadow-soft">
            <h2 className="mb-3 text-lg font-semibold text-text-primary">
              Design Tokens em Ação
            </h2>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-sm bg-feedback-success" />
                <span className="text-sm text-text-secondary">
                  Baixo estímulo visual
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-sm bg-feedback-info" />
                <span className="text-sm text-text-secondary">
                  Hierarquia clara
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-sm bg-feedback-warning" />
                <span className="text-sm text-text-secondary">
                  Cores semânticas
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Examples Section */}
        <div className="w-full max-w-md p-6 mt-8 border border-border-subtle rounded-lg bg-bg-primary shadow-soft">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">
            Exemplos de Feedback (useFeedback)
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-text-secondary">
            Clique nos botões abaixo para ver diferentes tipos de notificações toast acessíveis:
          </p>
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleSuccessExample}
              className="flex h-10 w-full items-center justify-center px-4 text-sm font-medium text-text-inverse bg-feedback-success hover:opacity-90 rounded-md transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-feedback-success focus:ring-offset-2"
            >
              Exemplo Success
            </button>
            <button
              type="button"
              onClick={handleErrorExample}
              className="flex h-10 w-full items-center justify-center px-4 text-sm font-medium text-text-inverse bg-feedback-error hover:opacity-90 rounded-md transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-feedback-error focus:ring-offset-2"
            >
              Exemplo Error
            </button>
            <button
              type="button"
              onClick={handleWarningExample}
              className="flex h-10 w-full items-center justify-center px-4 text-sm font-medium text-text-inverse bg-feedback-warning hover:opacity-90 rounded-md transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-feedback-warning focus:ring-offset-2"
            >
              Exemplo Warning
            </button>
            <button
              type="button"
              onClick={handleInfoExample}
              className="flex h-10 w-full items-center justify-center px-4 text-sm font-medium text-text-inverse bg-feedback-info hover:opacity-90 rounded-md transition-opacity duration-150 focus:outline-none focus:ring-2 focus:ring-feedback-info focus:ring-offset-2"
            >
              Exemplo Info
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
