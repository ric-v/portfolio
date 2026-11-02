import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { portfolioConfig } from "@/config/portfolio";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const { site, personal } = portfolioConfig;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  authors: [{ name: personal.name, url: site.url }],
  keywords: [
    personal.name,
    "Tech Lead",
    "Principal Engineer",
    "Backend Engineer",
    "Distributed Systems",
    "Go",
    "Golang",
    "Rust",
    "PostgreSQL",
    "Bengaluru",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: personal.name,
    type: "profile",
    images: [{ url: personal.portrait.src, width: 2048, height: 2048, alt: personal.portrait.alt }],
  },
  twitter: {
    card: "summary",
    title: site.title,
    description: site.description,
    images: [personal.portrait.src],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0b0e",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personal.name,
  jobTitle: personal.title,
  url: site.url,
  image: new URL(personal.portrait.src, site.url).toString(),
  address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
  sameAs: personal.socials.filter((s) => s.icon !== "resume").map((s) => s.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
