import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { portfolioConfig } from "@/config/portfolio";
import { Ambient } from "@/components/ui/Ambient";

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0d" },
  ],
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

// Runs before first paint: picks the saved theme (or the OS preference) so there's no flash,
// and flags that JS is available so scroll-reveal styles can opt in.
const themeInitScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}d.dataset.theme=t;}catch(e){d.dataset.theme='light';}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <Ambient />
      </body>
    </html>
  );
}
