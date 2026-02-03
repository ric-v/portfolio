import { type IconType } from "react-icons";

export interface CarouselItem {
  headline: string;
  subtext: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  github?: string;
  isOpenSource?: boolean;
  stars?: number;
}

export interface Skill {
  name: string;
  category: "languages" | "frameworks" | "cloud" | "databases" | "tools";
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  duration: string;
  location: string;
  description: string[];
  technologies: string[];
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: IconType;
}

export interface PortfolioConfig {
  personalInfo: {
    name: string;
    role: string;
    tagline: string;
    description: string;
    location: string;
    bio: string[];
    quote: string;
    profileImage: {
      light: string;
      dark: string;
    };
    socials: SocialLink[];
  };
  hero: {
    carouselItems: CarouselItem[];
  };
  skills: Skill[];
  experience: Experience[];
  projects: Project[];
  contact: {
    email: string;
  };
  footer: {
    tagline: string;
    subTagline: string;
  };
}

export const portfolioConfig: PortfolioConfig = {
  personalInfo: {
    name: "Richie Varghese",
    role: "I Engineer Scalable Systems",
    tagline: "Tech Lead & Principal Engineer",
    description: "Building high-performance distributed systems that scale.",
    location: "Bengaluru, India",
    bio: [
      "I'm a Tech Lead and Principal Engineer focused on building scalable, high-performance systems that operate reliably under real-world load.",
      "My work spans distributed backends, data-intensive platforms, and cloud-native architectures, with a strong emphasis on latency, reliability, and observability. I design systems that remain predictable as traffic grows—and debuggable when things go wrong.",
      "I work close to the fundamentals: system design, concurrency, data flow, and performance tuning. Whether it's optimizing critical paths, simplifying complex architectures, or mentoring engineers, I care about building software that earns trust over time.",
      "Outside core product work, I build developer tooling and internal utilities to improve visibility, productivity, and operational clarity.",
    ],
    quote: "If it aint broke, break it, make it better.",
    profileImage: {
      light: "/dp-light.png",
      dark: "/dp-dark.png",
    },
    socials: [
      {
        platform: "GitHub",
        url: "https://github.com/ric-v",
      },
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/ric-v",
      },
      {
        platform: "Resume",
        url: "https://drive.google.com/file/d/1-34NxUJF_Fj6-s4vUZVZIjIVO0VD-WX9/view?usp=sharing",
      },
    ],
  },
  hero: {
    carouselItems: [
      {
        headline: "Distributed systems at production scale",
        subtext:
          "Designing microservices that handle high-frequency traffic with predictable latency.",
      },
      {
        headline: "Performance is a feature",
        subtext:
          "Optimized low level systems to achieve sub 100ms response times under real-world load which is used by millions of users.",
      },
      {
        headline: "Data-intensive by design",
        subtext:
          "Database query optimization, planning, and schema decisions that reduce latency. When scaling, every microsecond counts.",
      },
      {
        headline: "Built to fail gracefully",
        subtext:
          "Systems designed with observability, timeouts, circuit breakers, and degradation in mind. Looking pretty under pressure.",
      },
      {
        headline: "Hands-on technical leadership",
        subtext:
          "Leading small teams, reviewing critical code, and owning architectural decisions end-to-end.",
      },
      {
        headline: "Builder beyond the day job",
        subtext:
          "Creating developer tools, internal utilities, and experiments to improve self, team, and product.",
      },
      {
        headline: "Break. Build. Repeat.",
        subtext:
          "Nothing is permanent. Iterate and improve. If it's not broken, break it, and make it better.",
      },
    ],
  },
  skills: [
    // Languages
    { name: "Go", category: "languages" },
    { name: "Python", category: "languages" },
    { name: "Java", category: "languages" },
    { name: "TypeScript", category: "languages" },
    { name: "Rust", category: "languages" },
    { name: "JavaScript", category: "languages" },
    // Frameworks
    { name: "React", category: "frameworks" },
    { name: "Next.js", category: "frameworks" },
    { name: "Spring Boot", category: "frameworks" },
    { name: "gRPC", category: "frameworks" },
    { name: "GraphQL", category: "frameworks" },
    // Cloud
    { name: "AWS", category: "cloud" },
    { name: "GCP", category: "cloud" },
    { name: "Kubernetes", category: "cloud" },
    { name: "Docker", category: "cloud" },
    { name: "Terraform", category: "cloud" },
    // Databases
    { name: "PostgreSQL", category: "databases" },
    { name: "Redis", category: "databases" },
    { name: "Kafka", category: "databases" },
    { name: "Elasticsearch", category: "databases" },
    { name: "MongoDB", category: "databases" },
    // Tools
    { name: "Git", category: "tools" },
    { name: "Linux", category: "tools" },
    { name: "Prometheus", category: "tools" },
    { name: "Grafana", category: "tools" },
    { name: "CI/CD", category: "tools" },
  ],
  experience: [
    {
      id: 1,
      company: "Worklife Tech",
      role: "Tech Lead / Principal Engineer",
      duration: "Present",
      location: "Bengaluru",
      description: [
        "Leading technical architecture for scalable backend systems",
        "Designing and implementing distributed microservices",
        "Mentoring engineers and driving technical excellence",
      ],
      technologies: ["Go", "Kubernetes", "PostgreSQL", "AWS"],
    },
    {
      id: 2,
      company: "Previous Company",
      role: "Senior Software Engineer",
      duration: "2020 - 2023",
      location: "Remote",
      description: [
        "Built high-performance backend services handling millions of requests",
        "Optimized database queries reducing latency by 60%",
        "Implemented observability and monitoring solutions",
      ],
      technologies: ["Python", "Java", "Redis", "Kafka"],
    },
    {
      id: 3,
      company: "Earlier Role",
      role: "Software Engineer",
      duration: "2017 - 2020",
      location: "India",
      description: [
        "Developed full-stack applications with modern frameworks",
        "Contributed to open-source projects",
        "Built internal developer tooling",
      ],
      technologies: ["JavaScript", "React", "Node.js", "MongoDB"],
    },
  ],
  projects: [
    {
      id: 1,
      title: "PgStudio",
      description:
        "Intelligent PostgreSQL tooling for VS Code. Build, explore, and query Postgres faster with AI-powered assistance.",
      tags: ["TypeScript", "PostgreSQL", "VS Code", "AI"],
      image: "/projects/pgstudio.jpg",
      link: "https://github.com/dev-asterix/PgStudio",
      github: "https://github.com/dev-asterix/PgStudio",
      isOpenSource: true,
      stars: 4,
    },
    {
      id: 2,
      title: "Divulge DB UI",
      description:
        "Simple DB CRUD operating service for Key-Value databases in Go with a React frontend.",
      tags: ["Go", "React", "BoltDB", "Material-UI"],
      image: "/projects/divulge.jpg",
      link: "https://github.com/ric-v/divulge-keyvalue-db-ui",
      github: "https://github.com/ric-v/divulge-keyvalue-db-ui",
      isOpenSource: true,
      stars: 2,
    },
    {
      id: 3,
      title: "Go Func Collections",
      description:
        "Commonly used Go functions to reduce code bulk. A utility library for everyday Go development.",
      tags: ["Go", "Utilities", "Library"],
      image: "/projects/gofunc.jpg",
      link: "https://github.com/ric-v/go-func-collections",
      github: "https://github.com/ric-v/go-func-collections",
      isOpenSource: true,
      stars: 3,
    },
    {
      id: 4,
      title: "And The Time Is",
      description:
        "Simple application to display current time in real-time for different time zones. Built with Next.js and Redux.",
      tags: ["Next.js", "Redux", "TypeScript"],
      image: "/projects/timeis.jpg",
      link: "https://github.com/dev-asterix/and-the-time-is",
      github: "https://github.com/dev-asterix/and-the-time-is",
      isOpenSource: true,
    },
    {
      id: 5,
      title: "Task Master Go",
      description:
        "Customizable task execution system and library written in Go with no dependencies.",
      tags: ["Go", "Task Runner", "Zero Dependencies"],
      image: "/projects/taskmaster.jpg",
      link: "https://github.com/dev-asterix/task-master.go",
      github: "https://github.com/dev-asterix/task-master.go",
      isOpenSource: true,
    },
    {
      id: 6,
      title: "DSA & System Design",
      description:
        "Comprehensive exercises from Scaler Academy covering DSA, Data Engineering, and System Design patterns.",
      tags: ["Python", "Go", "System Design", "DSA"],
      image: "/projects/scaler.jpg",
      link: "https://github.com/ric-v/scaler-academy-interviewbit",
      github: "https://github.com/ric-v/scaler-academy-interviewbit",
      isOpenSource: true,
      stars: 12,
    },
  ],
  contact: {
    email: "support@astrx.dev",
  },
  footer: {
    tagline: "Building Systems That Scale",
    subTagline: "Crafting reliable software, one microservice at a time",
  },
};
