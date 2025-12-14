import { AboutSection } from "@/components/sections/AboutSection";
import { MainLayout } from "@/components/layout/MainLayout";

export default function AboutPage() {
    return (
        <MainLayout>
            <div className="pt-20">
                <AboutSection />
            </div>
        </MainLayout>
    );
}
