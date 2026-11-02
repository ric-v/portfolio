import { FiArrowUpRight, FiMail } from "react-icons/fi";
import { portfolioConfig } from "@/config/portfolio";
import { CopyEmailButton } from "@/components/CopyEmailButton";
import { socialIcons } from "@/components/ui";

export function Contact() {
  const { contact, personal } = portfolioConfig;

  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-line py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div
          className="relative overflow-hidden rounded-3xl border border-line bg-elevated px-6 py-12 sm:px-12 sm:py-16"
          data-reveal
        >
          <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />
          <div className="relative max-w-2xl">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-accent">Contact</p>
            <h2 id="contact-title" className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              {contact.heading}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{contact.message}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${personal.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
              >
                <FiMail className="h-4 w-4" aria-hidden />
                {personal.email}
              </a>
              <CopyEmailButton email={personal.email} />
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              {personal.socials.map(({ label, url, icon }) => {
                const Icon = socialIcons[icon];
                return (
                  <li key={label}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                      {label}
                      <FiArrowUpRight
                        className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-hidden
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
