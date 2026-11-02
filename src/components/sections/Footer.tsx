import { portfolioConfig } from "@/config/portfolio";

export function Footer() {
  const { personal } = portfolioConfig;

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-8 text-sm text-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {personal.name} · {personal.location}
        </p>
        <a href="#top" className="transition-colors hover:text-fg">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
