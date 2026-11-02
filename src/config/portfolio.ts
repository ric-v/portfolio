/**
 * Single source of truth for all site content.
 * Edit this file to update the portfolio — no component changes needed.
 * See CUSTOMIZE.md for details.
 */

export interface SocialLink {
  label: string;
  url: string;
  icon: "github" | "linkedin" | "resume" | "email";
}

export interface Metric {
  value: string;
  label: string;
}

export interface FocusArea {
  title: string;
  description: string;
}

export interface Role {
  title: string;
  period: string;
  /** Short year label shown on the timeline, e.g. "2021". Defaults to the start year of `period`. */
  year?: string;
  /** What I owned and delivered in this role. */
  did?: string[];
  /** What I did that earned the next role. Leave out for the current role. */
  promotion?: string[];
}

export interface Experience {
  company: string;
  companyNote?: string;
  url?: string;
  location: string;
  period: string;
  domain: string;
  /** Short story of the whole stint, shown by default (with the newest role selected). */
  journey?: string;
  /** Role progression, newest first. */
  roles: Role[];
  highlights: string[];
  technologies: string[];
}

/** A product or open-source project, summarised in one line. The full showcase lives on astrx.dev. */
export interface Product {
  title: string;
  /** Short label, e.g. "VS Code extension". */
  kind: string;
  /** One line: what it is. */
  summary: string;
  tags: string[];
  /** Primary link — the product's own site, falling back to its source. */
  url: string;
  /** Link text shown for `url`, e.g. "nexql.astrx.dev". */
  urlLabel: string;
  github?: string;
}

export interface Products {
  heading: string;
  intro: string;
  /** Where the full product showcase lives. */
  showcase: { label: string; url: string };
  items: Product[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Education {
  school: string;
  degree: string;
  period: string;
  notes?: string[];
}

export interface PortfolioConfig {
  site: {
    url: string;
    title: string;
    description: string;
  };
  personal: {
    name: string;
    shortName: string;
    title: string;
    location: string;
    headline: string;
    intro: string;
    /** Used to compute "N+ years" automatically. */
    careerStartYear: number;
    portrait: { src: string; alt: string; lightSrc?: string; darkSrc?: string };
    email: string;
    resumeUrl: string;
    socials: SocialLink[];
  };
  metrics: Metric[];
  about: {
    paragraphs: string[];
    focusAreas: FocusArea[];
  };
  experience: Experience[];
  products: Products;
  skills: SkillGroup[];
  education: Education[];
  certifications: string[];
  contact: {
    heading: string;
    message: string;
  };
}

const RESUME_URL =
  "https://drive.google.com/file/d/1-34NxUJF_Fj6-s4vUZVZIjIVO0VD-WX9/view?usp=sharing";

export const portfolioConfig: PortfolioConfig = {
  site: {
    url: "https://me.astrx.dev",
    title: "Richie Varghese — Associate Manager & Backend Engineer",
    description:
      "Resume of Richie Varghese — Associate Manager and backend engineer in Bengaluru building fast, reliable distributed systems in Go, Rust and PostgreSQL.",
  },

  personal: {
    name: "Richie Varghese",
    shortName: "Richie",
    title: "Associate Manager · Software Development",
    location: "Bengaluru, India",
    headline: "I build backend systems that stay fast under real-world load.",
    /** `{years}` is replaced with years since careerStartYear. */
    intro:
      "Engineering leader with {years}+ years of experience designing distributed microservices, tuning databases, and leading teams that ship production-grade software — currently for a U.S. pharmacy-benefits platform processing insurance claims in real time.",
    careerStartYear: 2018,
    portrait: {
      lightSrc: "/dp-light.png",
      darkSrc: "/dp-dark.png",
      src: "/dp-dark.png",
      alt: "Portrait of Richie Varghese",
    },
    email: "ric-v@outlook.com",
    resumeUrl: RESUME_URL,
    socials: [
      { label: "GitHub", url: "https://github.com/ric-v", icon: "github" },
      { label: "LinkedIn", url: "https://linkedin.com/in/ric-v", icon: "linkedin" },
      { label: "Resume", url: RESUME_URL, icon: "resume" },
    ],
  },

  metrics: [
    { value: "20ms", label: "system latency on real-time claim processing, down from 60ms" },
    { value: "10×", label: "faster high-volume Cassandra inserts via a custom Java ASM writer" },
    { value: "10K+", label: "metrics per second through Go telemetry collectors" },
    { value: "60%", label: "efficiency gain from containerisation, telemetry and testing on Azure" },
  ],

  about: {
    paragraphs: [
      "I'm a backend-focused engineer who likes working close to the fundamentals — concurrency, data flow, query plans and the critical path of a request. Most of my career has been spent on systems where latency and correctness both matter.",
      "Today I lead teams at Worklife Tech as Associate Manager, building the claims-processing platform behind VisoryHealth, a U.S. pharmacy benefit management program. Before that, I was one of the first engineers at Algomox, building the data-collection backbone for its AIOps and MLOps platforms.",
      "Outside the day job I build developer tools — most recently NexQL, an open-source PostgreSQL toolkit for VS Code and AI agents — and I hold a Master's in Computer Science focused on system design and data engineering.",
    ],
    focusAreas: [
      {
        title: "Distributed systems",
        description:
          "Go microservices designed for high-frequency traffic with predictable latency.",
      },
      {
        title: "Database performance",
        description:
          "Query plans, schema design and PL/pgSQL rewrites — 50–500ms saved per query.",
      },
      {
        title: "Reliability & observability",
        description:
          "Telemetry, monitoring and graceful degradation so systems stay debuggable.",
      },
      {
        title: "Technical leadership",
        description:
          "Owning modules end-to-end, reviewing critical code, and mentoring graduates and junior developers.",
      },
    ],
  },

  experience: [
    {
      company: "Worklife Tech",
      companyNote: "formerly part of Gipfel & Schnell Consultings",
      location: "Bengaluru, India",
      period: "Jun 2021 — Present",
      domain: "Pharmacy Benefit Management · Client: VisoryHealth (XIL Health)",
      journey:
        "Joined in June 2021 as an Engineer and moved through five roles in under five years to Associate Manager. Along the way I took ownership of the claim-processing workflow behind VisoryHealth, brought system latency down from 60ms to 20ms, re-engineered Postgres functions for 50–500ms savings per query, raised delivery efficiency by 60% through containerisation, telemetry and testing on Azure, and introduced the coding standards, quality gates and internal tools the team still uses. Today I lead teams on the PBM platform and on a new product vertical.",
      roles: [
        {
          title: "Associate Manager — Software Development",
          period: "Apr 2026 — Present",
          did: [
            "Leading Super Switch, a new product vertical for VisoryHealth.",
            "Working with the team to enable new leadership on the core claim-processing PBM product.",
            "Helping teams improve process with AI and automation on other projects, such as Caremetrix for a different client.",
          ],
        },
        {
          title: "Tech Lead — Software Development",
          period: "Apr 2024 — Mar 2026",
          promotion: [
            "Took the lead on Super Switch, a new product vertical for VisoryHealth: a new step on top of claim processing, built to work with other clients and bring new products to market.",
            "Worked with the team to enable new leadership on the core claim-processing PBM product, so it keeps running well without me as the single point of ownership.",
            "Helped teams improve their process with AI and automation across other projects, such as Caremetrix for a different client.",
          ],
        },
        {
          title: "Principal Engineer",
          period: "Apr 2023 — Mar 2024",
          promotion: [
            "Managed a team of three developers: knowledge transfer, code reviews and delivery.",
            "Re-architected the product to take it to the next level, reducing redundancy and cutting latency further, from 30ms to 20ms.",
            "Worked on infrastructure optimisation, security and system stability.",
            "Introduced coding standards, quality gates and automated quality assessment, and kept building internal tools and improving process.",
          ],
        },
        {
          title: "Senior Engineer",
          period: "Oct 2021 — Mar 2023",
          promotion: [
            "Improved system reliability and took ownership of the claim-processing workflow and its architecture.",
            "Raised code quality and improved infrastructure and DevOps pipelines.",
            "Cut system latency from 60ms to 30ms.",
            "Introduced internal developer tools that speed up daily dev and QA tasks, automate maintenance and scheduled jobs, and enforce the quality-adherence process.",
          ],
        },
        {
          title: "Engineer",
          period: "Jun 2021 — Sep 2021",
          promotion: [
            "Learned a new domain quickly and started working on the claim-processing workflow.",
            "Improved code quality and maintainability.",
            "Introduced system design principles that the team still practises today.",
          ],
        },
      ],
      highlights: [
        "Lead a team of three delivering features to a live, regulated healthcare system — planning, delegation, code review and release ownership.",
        "Build and maintain microservices that adjudicate pharmacy insurance claims in real time for a U.S. PBM program.",
        "Optimised core claim-processing logic to respond in under 100ms despite high-frequency request volume.",
        "Re-engineered PostgreSQL functions, cutting 50–500ms off individual queries.",
        "Improved delivery efficiency by 60% through containerisation, telemetry, real-time monitoring and unit testing on Microsoft Azure.",
        "Designed a proof of concept for a new U.S. healthcare product aimed at improving health-plan provider ratings.",
      ],
      technologies: ["Go", "PostgreSQL", "PL/pgSQL", "Docker", "Azure", "Prometheus", "Grafana"],
    },
    {
      company: "NexQL",
      companyNote: "self-developed product · astrx.dev",
      url: "https://nexql.astrx.dev",
      location: "Open source",
      period: "Apr 2025 — Present",
      domain: "Developer tools · PostgreSQL & AI agents",
      roles: [{ title: "Creator & Maintainer", period: "Apr 2025 — Present" }],
      highlights: [
        "Designed, built and ship NexQL end to end as a production-grade, open-source PostgreSQL toolkit (formerly PgStudio) — product, architecture, implementation, release and docs.",
        "VS Code extension for building, exploring and querying Postgres with AI-assisted help, built in TypeScript.",
        "Rust MCP server that lets AI assistants and agents such as Claude and Cursor safely read and understand Postgres data models.",
        "Matching editor theme pack for VS Code and its open-source forks, plus the product site at nexql.astrx.dev.",
      ],
      technologies: ["TypeScript", "Rust", "PostgreSQL", "MCP", "VS Code API"],
    },
    {
      company: "Algomox",
      location: "Bengaluru, India",
      period: "Jun 2018 — May 2021",
      domain: "AIOps & MLOps platforms",
      journey:
        "Joined in June 2018 as part of the founding engineering team and spent three years helping build the AIOps and MLOps platforms. I built Go telemetry collectors load-tested past 10,000 metrics per second, a Java ASM Cassandra insert path that made writes 10× faster, and wore the senior Go developer, system admin and source-control hats while running client demos for Cisco and Mindtree.",
      roles: [
        { title: "Software Engineer L2", period: "Jun 2019 — May 2021" },
        {
          title: "Software Engineer L1",
          period: "Jun 2018 — May 2019",
          promotion: [
            "As an initial employee, worked as the main backend engineer alongside source-control management and infrastructure management.",
            "Worked with others to improve the product and introduced key architectural design changes.",
            "Researched and built new concepts in Go and Python to improve the core product, and worked with the team to design and co-lead products.",
            "Removed Cassandra bottlenecks on high-volume inserts using ASM-based dynamic Java classes that capture live KPIs from Prometheus into TimescaleDB.",
          ],
        },
      ],
      highlights: [
        "Joined as part of the founding engineering team and helped build two core products: the AIOps and MLOps platforms.",
        "Built and deployed Go microservices for telemetry data collection, load-tested at over 10,000 metrics per second.",
        "Contributed to the system design and optimisation of the telemetry collection engines.",
        "Wrote a high-volume Cassandra insert path using Java ASM — 10× faster writes and no more slow-query build-up under sustained load.",
        "Wore several hats — senior Go developer, system administrator and source-control manager — and ran technical demos for clients including Cisco and Mindtree.",
      ],
      technologies: ["Go", "Java", "Cassandra", "Python", "Linux", "Bash"],
    },
  ],

  products: {
    heading: "Products & open source",
    intro:
      "Outside the day job I design, build and maintain a small portfolio of developer tools, libraries and apps under the astrx.dev brand. This is the short version — screenshots, demos and write-ups live on astrx.dev.",
    showcase: { label: "Browse all products on astrx.dev", url: "https://astrx.dev" },
    items: [
      {
        title: "NexQL",
        kind: "VS Code extension · MCP server · themes",
        summary:
          "Open-source PostgreSQL toolkit (formerly PgStudio): an editor extension, a Rust MCP server for AI assistants, and a matching theme pack.",
        tags: ["TypeScript", "Rust", "PostgreSQL", "MCP"],
        url: "https://nexql.astrx.dev",
        urlLabel: "nexql.astrx.dev",
        github: "https://github.com/NexQL-OSS",
      },
      {
        title: "Pacpad",
        kind: "Terminal app",
        summary: "Terminal app manager for Arch Linux, written in Rust with Ratatui.",
        tags: ["Rust", "TUI"],
        url: "https://github.com/ric-v/pacpad",
        urlLabel: "github.com/ric-v/pacpad",
        github: "https://github.com/ric-v/pacpad",
      },
      {
        title: "And the time is…",
        kind: "Web app",
        summary: "Compare the current time across time zones, past or future.",
        tags: ["Next.js", "Redux", "Tailwind CSS"],
        url: "https://timeis.astrx.dev",
        urlLabel: "timeis.astrx.dev",
        github: "https://github.com/dev-asterix/and-the-time-is",
      },
      {
        title: "Drawdown",
        kind: "Web app",
        summary: "Daily portfolio tracker and trading journal.",
        tags: ["Next.js", "React", "Tailwind CSS"],
        url: "https://drawdown.astrx.dev",
        urlLabel: "drawdown.astrx.dev",
        github: "https://github.com/dev-asterix/drawdown",
      },
      {
        title: "Asterix OS",
        kind: "Browser desktop",
        summary: "The astrx.dev site itself — a browser desktop with windows, a terminal and a live GitHub file explorer.",
        tags: ["Next.js", "TypeScript", "Zustand"],
        url: "https://astrx.dev",
        urlLabel: "astrx.dev",
        github: "https://github.com/dev-asterix/portfolio",
      },
      {
        title: "Go libraries",
        kind: "Open source",
        summary:
          "Glog (zero-dependency concurrent logger), Go Func Collections (generic helpers) and Task Master (dependency-free scheduler).",
        tags: ["Go", "Concurrency", "Generics"],
        url: "https://pkg.go.dev/github.com/ric-v/glog",
        urlLabel: "pkg.go.dev",
        github: "https://github.com/ric-v/glog",
      },
      {
        title: "Divulge",
        kind: "Web app",
        summary: "Web UI for embedded key-value databases like BoltDB and BuntDB — Go backend, React front end.",
        tags: ["Go", "React", "BoltDB"],
        url: "https://ric-v.github.io/divulge-keyvalue-db-ui/",
        urlLabel: "Demo",
        github: "https://github.com/ric-v/divulge-keyvalue-db-ui",
      },
    ],
  },

  skills: [
    {
      label: "Languages",
      items: ["Go", "Rust", "Python", "TypeScript", "JavaScript", "Java", "SQL / PL/pgSQL", "Bash"],
    },
    {
      label: "Backend & APIs",
      items: ["Microservices", "gRPC", "REST", "GraphQL", "Gin", "GORM", "Flask", "Spring Boot"],
    },
    {
      label: "Data",
      items: ["PostgreSQL", "Cassandra", "Redis", "Kafka", "Elasticsearch", "MongoDB"],
    },
    {
      label: "Cloud & Ops",
      items: ["Docker", "Kubernetes", "Azure", "AWS", "GCP", "Terraform", "CI/CD", "Linux"],
    },
    {
      label: "Observability",
      items: ["Prometheus", "Grafana", "Telemetry pipelines"],
    },
    {
      label: "Frontend",
      items: ["React", "Next.js", "Redux", "Tailwind CSS", "Material UI"],
    },
  ],

  education: [
    {
      school: "Woolf University · Scaler Neovarsity",
      degree: "Master's in Computer Science",
      period: "2022 — 2024",
      notes: ["Advanced data structures & algorithms, high- and low-level system design, data engineering."],
    },
    {
      school: "College of Engineering, Kidangoor",
      degree: "B.Tech, Information Technology",
      period: "2014 — 2018",
      notes: [
        "President of SWIFT, the IT department's student association (2017–18).",
        "Organised Innovate '18, the department's first inter-college tech fest.",
        "Final-year project Hazel, a Linux chatbot, received a KSCSTE innovation grant.",
      ],
    },
  ],

  certifications: [
    "Applied Concurrency in Go",
    "The Complete Rust Programming Course",
    "Go (Basic)",
    "React Hooks",
    "Tailwind CSS Essential Training",
  ],

  contact: {
    heading: "Let's talk",
    message:
      "Open to conversations about backend and platform roles, technical leadership, or interesting systems problems. Email is the fastest way to reach me.",
  },
};

export function yearsOfExperience(startYear = portfolioConfig.personal.careerStartYear) {
  return new Date().getFullYear() - startYear;
}
