import { ContactSection } from "@/components/sections/ContactSection";
import { MainLayout } from "@/components/layout/MainLayout";

export default function ContactPage() {
    return (
        <MainLayout>
            <div className="pt-20">
                <ContactSection />
            </div>
        </MainLayout>
    );
}
