import type { ReactNode } from "react";
import type { IconType } from "react-icons";
import { FiFileText, FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import type { SocialLink } from "@/config/portfolio";
import { cn } from "@/lib/utils";

export const socialIcons: Record<SocialLink["icon"], IconType> = {
  github: FiGithub,
  linkedin: FiLinkedin,
  resume: FiFileText,
  email: FiMail,
};

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("py-20 sm:py-28", className)}>
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <header className="mb-12 max-w-2xl" data-reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">{eyebrow}</p>
          <h2 id={`${id}-title`} className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            {title}
          </h2>
          {intro && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{intro}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-subtle px-2.5 py-0.5 font-mono text-[11px] text-muted">
      {children}
    </span>
  );
}

export function revealDelay(index: number, step = 70): React.CSSProperties {
  return { ["--reveal-delay" as string]: `${index * step}ms` };
}
