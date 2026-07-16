import type { Metadata } from "next";
import { headers } from "next/headers";
import {
  Bricolage_Grotesque,
  Geist,
  Geist_Mono,
} from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ||
    requestHeaders.get("host") ||
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ||
    (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(protocol + "://" + host);

  return {
    metadataBase,
    title: {
      default: "Miller Santos — Produtos digitais com IA",
      template: "%s — Miller Santos",
    },
    description:
      "Portfólio de Miller Santos: desenvolvedor de produtos digitais que transforma problemas reais em experiências úteis com web, cloud e inteligência artificial.",
    keywords: [
      "Miller Santos",
      "desenvolvedor",
      "inteligência artificial",
      "Next.js",
      "TypeScript",
      "React",
      "Firebase",
      "Alagoas",
    ],
    authors: [{ name: "Miller Santos", url: "https://github.com/millersantosbr" }],
    creator: "Miller Santos",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: "/",
      siteName: "Miller Santos",
      title: "Miller Santos — Produtos digitais com IA",
      description:
        "Problemas reais transformados em produtos digitais simples, úteis e humanos.",
      images: [
        {
          url: "/og.png",
          width: 1732,
          height: 909,
          alt: "Miller Santos — Produtos digitais com IA",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Miller Santos — Produtos digitais com IA",
      description:
        "Problemas reais transformados em produtos digitais simples, úteis e humanos.",
      images: ["/og.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={
          bricolage.variable +
          " " +
          geistSans.variable +
          " " +
          geistMono.variable
        }
      >
        {children}
      </body>
    </html>
  );
}
