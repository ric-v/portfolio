import type { Metadata } from "next";
import { Gantari, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeContext";
import { FluidBackground } from "@/components/ui/FluidBackground";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { CinematicIntro } from "@/components/ui/CinematicIntro";

import { BackgroundMusic } from "@/components/ui/BackgroundMusic";
import { PageNavigator } from "@/components/ui/PageNavigator";

const gantari = Gantari({
  variable: "--font-geist-sans", // Reuse existing variable to propagate change globally
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Richie Varghese | Portfolio",
  description: "Building digital experiences that feel alive. Crafting interfaces where every pixel has purpose and every interaction tells a story.",
  keywords: ["developer", "portfolio", "creative", "web development", "React", "Next.js", "Three.js"],
  authors: [{ name: "Creative Developer" }],
  openGraph: {
    title: "Richie Varghese | Portfolio",
    description: "Building digital experiences that feel alive.",
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
          <CinematicIntro />
          <FluidBackground />
          <CursorGlow />
          <BackgroundMusic />
          <PageNavigator />
          <main id="main-content" className="relative z-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
