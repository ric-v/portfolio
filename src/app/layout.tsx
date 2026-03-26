import type { Metadata } from "next";
import { Gantari, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeContext";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { BackgroundMusic } from "@/components/ui/BackgroundMusic";
import { portfolioConfig } from "@/config/portfolio";
import { PlanetaryLayoutWrapper } from "@/components/layout/PlanetaryLayoutWrapper";

const gantari = Gantari({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${portfolioConfig.personalInfo.name} | Portfolio`,
  description: portfolioConfig.personalInfo.description,
  keywords: ["developer", "portfolio", "creative", "web development", "React", "Next.js", "Three.js"],
  authors: [{ name: portfolioConfig.personalInfo.name }],
  openGraph: {
    title: `${portfolioConfig.personalInfo.name} | Portfolio`,
    description: portfolioConfig.personalInfo.description,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="sunset" suppressHydrationWarning>
      <body
        className={`${gantari.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="sunset">
          <CursorGlow />
          <BackgroundMusic />
          <PlanetaryLayoutWrapper>
            <main id="main-content" className="relative z-10">
              {children}
            </main>
          </PlanetaryLayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
