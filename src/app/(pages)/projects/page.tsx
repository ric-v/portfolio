import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { MainLayout } from "@/components/layout/MainLayout";

export default function ProjectsPage() {
  return (
    <MainLayout>
      <div className="pt-20">
        <ProjectsSection />
      </div>
    </MainLayout>
  );
}
