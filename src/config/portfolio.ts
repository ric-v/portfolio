
import { type IconType } from "react-icons";
import { FaGithub, FaLinkedin, FaFileAlt } from "react-icons/fa";

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
}

export interface SocialLink {
    platform: string;
    url: string;
    icon?: IconType; // Optional icon component
}

export interface PortfolioConfig {
    personalInfo: {
        name: string;
        role: string;
        description: string; // Used for SEO
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
        role: "I Engineer Scalable Systems", // Used in typewriter
        description: "Building digital experiences that feel alive.",
        bio: [
            "I'm a Tech Lead and Principal Engineer focused on building scalable, high-performance systems that operate reliably under real-world load.",
            "My work spans distributed backends, data-intensive platforms, and cloud-native architectures, with a strong emphasis on latency, reliability, and observability. I design systems that remain predictable as traffic grows—and debuggable when things go wrong.",
            "I work close to the fundamentals: system design, concurrency, data flow, and performance tuning. Whether it’s optimizing critical paths, simplifying complex architectures, or mentoring engineers, I care about building software that earns trust over time.",
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
                // icon: FaGithub, // Dynamic imports of icons might be tricky if not careful, sticking to names or simple passing for now.
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
    projects: [
        {
            id: 1,
            title: "Nebula Dashboard",
            description:
                "A real-time analytics dashboard with stunning data visualizations and fluid animations.",
            tags: ["React", "D3.js", "WebSocket"],
            image: "/projects/nebula.jpg",
            link: "#",
        },
        {
            id: 2,
            title: "Aurora Commerce",
            description:
                "Next-generation e-commerce platform with immersive 3D product previews.",
            tags: ["Next.js", "Three.js", "Stripe"],
            image: "/projects/aurora.jpg",
            link: "#",
        },
    ],
    contact: {
        email: "support@astrx.dev",
    },
    footer: {
        tagline: "Creative Developer",
        subTagline: "Crafting digital experiences",
    },
};
