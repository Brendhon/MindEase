import Image from "next/image";

/**
 * Home Page - MindEase
 * Demonstrating cognitive accessibility design tokens using Tailwind classes
 */
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-secondary font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-16 px-8 bg-surface-primary sm:items-start">
        {/* Logo */}
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

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

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 px-5 text-md font-medium text-text-inverse bg-action-primary hover:bg-action-primary-hover rounded-full transition-colors duration-200 md:w-[158px]"
            href="https://vercel.com/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          
          <a
            className="flex h-12 w-full items-center justify-center px-5 text-md font-medium text-text-primary bg-surface-primary border border-border-strong hover:bg-bg-secondary hover:border-action-secondary rounded-full transition-all duration-200 md:w-[158px]"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentação
          </a>
        </div>
      </main>
    </div>
  );
}
