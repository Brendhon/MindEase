import { ToastContainer } from "@/components/feedback/toast";
import { FeedbackProvider } from "@/contexts/feedback-context";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-family-base",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MindEase - Plataforma de Acessibilidade Cognitiva",
    template: "%s | MindEase",
  },
  description:
    "Plataforma web focada em acessibilidade cognitiva para pessoas com TDAH, TEA, dislexia, burnout e ansiedade. Interface previsível, controlável e de baixo estímulo visual.",
  keywords: [
    "acessibilidade cognitiva",
    "TDAH",
    "TEA",
    "autismo",
    "dislexia",
    "burnout",
    "ansiedade",
    "neurodivergência",
    "interface acessível",
    "baixo estímulo visual",
  ],
  authors: [{ name: "Brendhon Moreira" }],
  creator: "Brendhon Moreira",
  publisher: "MindEase",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "MindEase",
    title: "MindEase - Plataforma de Acessibilidade Cognitiva",
    description:
      "Interface previsível e controlável para reduzir carga cognitiva. Personalize contraste, espaçamento, fonte e animações conforme suas necessidades.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MindEase - Plataforma de Acessibilidade Cognitiva",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MindEase - Plataforma de Acessibilidade Cognitiva",
    description:
      "Interface previsível e controlável para reduzir carga cognitiva. Personalize contraste, espaçamento, fonte e animações.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F9FAFB" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} antialiased`}
      >
        <FeedbackProvider>
          {children}
          <ToastContainer />
        </FeedbackProvider>
      </body>
    </html>
  );
}
