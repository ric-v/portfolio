import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeContext";
import { FluidBackground } from "@/components/ui/FluidBackground";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { CinematicIntro } from "@/components/ui/CinematicIntro";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Creative Developer | Portfolio",
  description: "Building digital experiences that feel alive. Crafting interfaces where every pixel has purpose and every interaction tells a story.",
  keywords: ["developer", "portfolio", "creative", "web development", "React", "Next.js", "Three.js"],
  authors: [{ name: "Creative Developer" }],
  openGraph: {
    title: "Creative Developer | Portfolio",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="sunset">
          <CinematicIntro />
          <FluidBackground />
          <CursorGlow />
          <main id="main-content" className="relative z-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
