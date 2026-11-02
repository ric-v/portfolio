import Image from "next/image";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import { portfolioConfig, yearsOfExperience } from "@/config/portfolio";
import { revealDelay, socialIcons } from "@/components/ui";

export function Hero() {
  const { personal, metrics } = portfolioConfig;
  const intro = personal.intro.replace("{years}", String(yearsOfExperience()));

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div aria-hidden className="hero-glow pointer-events-none absolute inset-0" />
      <div aria-hidden className="grid-texture pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-5xl px-5 sm:px-8">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_auto]">
          <div>
            <div
              className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted"
              data-reveal
            >
              <span className="font-medium text-fg">{personal.name}</span>
              <span aria-hidden className="hidden h-1 w-1 rounded-full bg-line-strong sm:inline-block" />
              <span>{personal.title}</span>
              <span aria-hidden className="hidden h-1 w-1 rounded-full bg-line-strong sm:inline-block" />
              <span className="inline-flex items-center gap-1.5">
                <FiMapPin className="h-3.5 w-3.5" aria-hidden />
                {personal.location}
              </span>
            </div>

            <h1
              className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-fg sm:text-5xl lg:text-6xl"
              data-reveal
              style={revealDelay(1)}
            >
              {personal.headline}
            </h1>

            <p
              className="mt-6 max-w-2xl text-lg leading-relaxed text-muted"
              data-reveal
              style={revealDelay(2)}
            >
              {intro}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3" data-reveal style={revealDelay(3)}>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
              >
                Get in touch
                <FiArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </a>
              <a
                href="#experience"
                className="inline-flex items-center rounded-full border border-line px-5 py-2.5 text-sm font-medium text-fg transition-colors hover:border-line-strong hover:bg-subtle"
              >
                See my work
              </a>
              <ul className="ml-1 flex items-center gap-1">
                {personal.socials.map(({ label, url, icon }) => {
                  const Icon = socialIcons[icon];
                  return (
                    <li key={label}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        title={label}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-subtle hover:text-fg"
                      >
                        <Icon className="h-[18px] w-[18px]" aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="order-first md:order-none" data-reveal style={revealDelay(2)}>
            <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-line shadow-2xl shadow-black/20 sm:h-36 sm:w-36 md:h-56 md:w-56">
              <Image
                src={personal.portrait.src}
                alt={personal.portrait.alt}
                fill
                priority
                sizes="(min-width: 768px) 224px, 144px"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:mt-20 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <div key={m.value} className="bg-bg p-5 sm:p-6" data-reveal style={revealDelay(i + 3)}>
              <dt className="sr-only">{m.label}</dt>
              <dd>
                <span className="block font-mono text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                  {m.value}
                </span>
                <span className="mt-2 block text-sm leading-snug text-muted">{m.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
