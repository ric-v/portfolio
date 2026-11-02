import { FiArrowUpRight, FiGithub } from "react-icons/fi";
import { portfolioConfig, type Project } from "@/config/portfolio";
import { Section, Tag, revealDelay } from "@/components/ui";
import { cn } from "@/lib/utils";

function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="relative z-10 flex flex-wrap items-center gap-4 text-sm">
      {project.github && (
        <a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-fg"
        >
          <FiGithub className="h-4 w-4" aria-hidden />
          Source
          <span className="sr-only"> code for {project.title}</span>
        </a>
      )}
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-muted transition-colors hover:text-fg"
        >
          {project.liveLabel ?? "Live"}
          <FiArrowUpRight className="h-4 w-4" aria-hidden />
          <span className="sr-only"> for {project.title}</span>
        </a>
      )}
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const primaryUrl = project.live ?? project.github;

  return (
    <li
      data-reveal
      style={revealDelay(index % 3)}
      className={cn(
        "group relative flex flex-col rounded-2xl border border-line bg-elevated p-6 transition-colors hover:border-line-strong",
        project.featured && "sm:col-span-2 lg:col-span-3 lg:flex-row lg:items-center lg:gap-10 lg:p-8",
      )}
    >
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className={cn("font-semibold tracking-tight text-fg", project.featured ? "text-2xl" : "text-lg")}>
            {primaryUrl ? (
              // Stretched link: whole card is clickable, inner links stay on top (z-10).
              <a
                href={primaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="after:absolute after:inset-0 after:rounded-2xl"
              >
                {project.title}
              </a>
            ) : (
              project.title
            )}
          </h3>
          {project.featured ? (
            <span className="shrink-0 rounded-full bg-accent-soft px-2.5 py-1 font-mono text-[11px] text-accent">
              Featured
            </span>
          ) : (
            <FiArrowUpRight
              aria-hidden
              className="h-5 w-5 shrink-0 text-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg"
            />
          )}
        </div>
        <p
          className={cn(
            "mt-3 leading-relaxed text-muted",
            project.featured ? "max-w-2xl text-base sm:text-[17px]" : "text-[15px]",
          )}
        >
          {project.description}
        </p>
      </div>

      <div className={cn("mt-6 flex flex-col gap-4", project.featured && "lg:mt-0 lg:w-64 lg:shrink-0")}>
        <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
          {project.tags.map((t) => (
            <li key={t}>
              <Tag>{t}</Tag>
            </li>
          ))}
        </ul>
        <ProjectLinks project={project} />
      </div>
    </li>
  );
}

export function Projects() {
  const { projects, personal } = portfolioConfig;
  const github = personal.socials.find((s) => s.icon === "github")?.url;

  return (
    <Section
      id="projects"
      eyebrow="Projects"
      title="Things I've built on my own time"
      intro="Open-source developer tools and libraries — mostly Go, mostly scratching my own itch."
      className="border-t border-line"
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <ProjectCard key={p.title} project={p} index={i} />
        ))}
      </ul>

      {github && (
        <p className="mt-10 text-sm text-muted" data-reveal>
          More on{" "}
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent"
          >
            GitHub
          </a>
          .
        </p>
      )}
    </Section>
  );
}
