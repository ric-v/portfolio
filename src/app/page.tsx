import { HeroSection } from "@/components/sections/HeroSection";
import { MainLayout } from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      {/* Main Content */}
      <div className="relative z-10 h-full">
        <HeroSection />
      </div>
    </MainLayout>
  );
}
