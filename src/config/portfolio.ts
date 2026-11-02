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
}

export interface Experience {
  company: string;
  companyNote?: string;
  url?: string;
  location: string;
  period: string;
  domain: string;
  /** Role progression, newest first. */
  roles: Role[];
  highlights: string[];
  technologies: string[];
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
  liveLabel?: string;
  /** Short label shown on the card, e.g. "VS Code extension". */
  kind?: string;
  /** Projects in a group are shown together in a featured block. */
  group?: "nexql";
  /** Set to true to hide a project until its details are ready. */
  draft?: boolean;
}

export interface ProjectGroup {
  name: string;
  tagline: string;
  description: string;
  github: string;
  live?: string;
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
    portrait: { src: string; alt: string };
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
  projectGroups: Record<NonNullable<Project["group"]>, ProjectGroup>;
  projects: Project[];
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
    title: "Richie Varghese — Tech Lead & Backend Engineer",
    description:
      "Tech Lead and backend engineer in Bengaluru building fast, reliable distributed systems in Go, Rust and PostgreSQL.",
  },

  personal: {
    name: "Richie Varghese",
    shortName: "Richie",
    title: "Tech Lead · Principal Engineer",
    location: "Bengaluru, India",
    headline: "I build backend systems that stay fast under real-world load.",
    /** `{years}` is replaced with years since careerStartYear. */
    intro:
      "Tech Lead with {years}+ years of experience designing distributed microservices, tuning databases, and leading small teams that ship production-grade software — currently for a U.S. pharmacy-benefits platform processing insurance claims in real time.",
    careerStartYear: 2018,
    portrait: {
      src: "/dp-dark.png",
      alt: "Portrait of Richie Varghese",
    },
    email: "support@astrx.dev",
    resumeUrl: RESUME_URL,
    socials: [
      { label: "GitHub", url: "https://github.com/ric-v", icon: "github" },
      { label: "LinkedIn", url: "https://linkedin.com/in/ric-v", icon: "linkedin" },
      { label: "Resume", url: RESUME_URL, icon: "resume" },
    ],
  },

  metrics: [
    { value: "<100ms", label: "response time on real-time insurance claim processing" },
    { value: "10×", label: "faster high-volume Cassandra inserts via a custom Java ASM writer" },
    { value: "10K+", label: "metrics per second through Go telemetry collectors" },
    { value: "60%", label: "efficiency gain from containerisation, telemetry and testing on Azure" },
  ],

  about: {
    paragraphs: [
      "I'm a backend-focused engineer who likes working close to the fundamentals — concurrency, data flow, query plans and the critical path of a request. Most of my career has been spent on systems where latency and correctness both matter.",
      "Today I lead a small team at Worklife Tech building the claims-processing platform behind VisoryHealth, a U.S. pharmacy benefit management program. Before that, I was one of the first engineers at Algomox, building the data-collection backbone for its AIOps and MLOps platforms.",
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
          "Owning architecture end-to-end, reviewing critical code and mentoring engineers.",
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
      roles: [
        { title: "Tech Lead — Software Development", period: "Apr 2024 — Present" },
        { title: "Principal Engineer", period: "Apr 2023 — Mar 2024" },
        { title: "Senior Engineer", period: "Oct 2021 — Mar 2023" },
        { title: "Engineer", period: "Jun 2021 — Sep 2021" },
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
      company: "Algomox",
      location: "Bengaluru, India",
      period: "Jun 2018 — May 2021",
      domain: "AIOps & MLOps platforms",
      roles: [
        { title: "Software Engineer L2", period: "Jun 2019 — May 2021" },
        { title: "Software Engineer L1", period: "Jun 2018 — May 2019" },
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

  projectGroups: {
    nexql: {
      name: "NexQL",
      tagline: "Open-source PostgreSQL tooling for developers and AI agents",
      description:
        "An open-source toolkit for working with Postgres: an editor extension for building, exploring and querying databases faster, an MCP server that lets AI assistants understand your data models safely, and a matching set of editor themes. (Formerly PgStudio.)",
      github: "https://github.com/NexQL-OSS",
      live: "https://nexql.astrx.dev",
    },
  },

  projects: [
    {
      title: "NexQL for VS Code",
      kind: "VS Code extension",
      group: "nexql",
      description:
        "Intelligent PostgreSQL tooling inside the editor — build, explore and query Postgres faster, with AI-assisted help. Formerly PgStudio.",
      tags: ["TypeScript", "PostgreSQL", "VS Code", "AI agents"],
      github: "https://github.com/NexQL-OSS/core",
      live: "https://nexql.astrx.dev",
      liveLabel: "nexql.astrx.dev",
    },
    {
      title: "NexQL MCP",
      kind: "MCP server",
      group: "nexql",
      description:
        "A Model Context Protocol server that lets AI assistants and agents — Claude, Cursor and others — safely read and understand your Postgres data models.",
      tags: ["Rust", "MCP", "PostgreSQL", "LLMs"],
      github: "https://github.com/NexQL-OSS/mcp",
      live: "https://nexql-mcp.astrx.dev",
      liveLabel: "nexql-mcp.astrx.dev",
    },
    {
      title: "NexQL Themes",
      kind: "Editor themes",
      group: "nexql",
      description: "Colour schemes from NexQL for VS Code and its open-source forks.",
      tags: ["VS Code", "Themes"],
      github: "https://github.com/NexQL-OSS/vsc-themes",
      live: "https://nexql-themes.astrx.dev",
      liveLabel: "nexql-themes.astrx.dev",
    },
    {
      title: "Pacpad",
      kind: "Terminal app",
      description:
        "A terminal app manager for Arch Linux: browse, search and manage packages, web apps and TUI launchers from one place.",
      tags: ["Rust", "TUI", "Arch Linux"],
      github: "https://github.com/ric-v/pacpad",
    },
    {
      title: "And the time is…",
      kind: "Web app",
      description:
        "Find the current time across time zones at a glance, and compare any zone against your own — past or future.",
      tags: ["Next.js", "Redux", "Tailwind CSS"],
      github: "https://github.com/dev-asterix/and-the-time-is",
      live: "https://timeis.astrx.dev",
      liveLabel: "timeis.astrx.dev",
    },
    {
      title: "Drawdown",
      kind: "Web app",
      description: "A daily portfolio tracker and trading journal.",
      tags: ["Next.js", "React", "Tailwind CSS"],
      github: "https://github.com/dev-asterix/drawdown",
      live: "https://drawdown.astrx.dev",
      liveLabel: "drawdown.astrx.dev",
    },
    {
      // TODO: add a link and a one-line description, then remove `draft`.
      title: "Asterix OS",
      kind: "OS",
      description: "",
      tags: [],
      draft: true,
    },
    {
      title: "Glog",
      kind: "Go library",
      description:
        "A concurrent, file-based logger for Go. Channel-based streaming keeps logging thread-safe and low-overhead, with zero external dependencies.",
      tags: ["Go", "Concurrency", "Logging"],
      github: "https://github.com/ric-v/glog",
      live: "https://pkg.go.dev/github.com/ric-v/glog",
      liveLabel: "pkg.go.dev",
    },
    {
      title: "Go Func Collections",
      kind: "Go library",
      description: "Commonly used helper functions for everyday Go — the small things you'd otherwise rewrite in every project.",
      tags: ["Go", "Generics", "Library"],
      github: "https://github.com/ric-v/go-func-collections",
      live: "https://pkg.go.dev/github.com/ric-v/go-func-collections/array",
      liveLabel: "pkg.go.dev",
    },
    {
      title: "Task Master",
      kind: "Go library",
      description: "A customisable task-execution system and scheduler library for Go, written with no dependencies.",
      tags: ["Go", "Scheduling", "Zero deps"],
      github: "https://github.com/dev-asterix/task-master.go",
    },
    {
      title: "Divulge",
      kind: "Web app",
      description:
        "A web UI for managing embedded key-value databases like BoltDB and BuntDB — a Go backend with a React front end.",
      tags: ["Go", "React", "BoltDB"],
      github: "https://github.com/ric-v/divulge-keyvalue-db-ui",
      live: "https://ric-v.github.io/divulge-keyvalue-db-ui/",
      liveLabel: "Demo",
    },
  ],

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
