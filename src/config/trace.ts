/**
 * The career, modelled as a distributed trace.
 * Each span has a real start/end month; `end: null` means still running.
 * Text content is pulled from portfolio.ts so there's one source of truth.
 */
import { portfolioConfig } from "./portfolio";

export type ServiceId = "richie" | "education" | "algomox" | "worklife";

export interface Service {
  id: ServiceId;
  label: string;
  /** CSS colour for bars and dots. */
  color: string;
}

export interface SpanEvent {
  name: string;
  detail?: string;
}

export interface Span {
  id: string;
  parentId?: string;
  service: ServiceId;
  operation: string;
  /** "YYYY-MM" */
  start: string;
  /** "YYYY-MM" (inclusive) or null if in progress */
  end: string | null;
  attributes: Record<string, string>;
  /** Long-form text shown at the top of the detail panel. */
  summary?: string[];
  events?: SpanEvent[];
  tags?: string[];
}

export const services: Record<ServiceId, Service> = {
  richie: { id: "richie", label: "richie", color: "var(--svc-richie)" },
  education: { id: "education", label: "education", color: "var(--svc-education)" },
  algomox: { id: "algomox", label: "algomox", color: "var(--svc-algomox)" },
  worklife: { id: "worklife", label: "worklife-tech", color: "var(--svc-worklife)" },
};

const { personal, about, experience, education, certifications } = portfolioConfig;
const [worklife, algomox] = experience;
const [masters, btech] = education;

export const spans: Span[] = [
  {
    id: "root",
    service: "richie",
    operation: "GET /richie-varghese",
    start: "2014-08",
    end: null,
    attributes: {
      "person.name": personal.name,
      "person.title": personal.title,
      "person.location": personal.location,
      "http.status": "200 OK",
    },
    summary: about.paragraphs,
    events: certifications.map((c) => ({ name: "certification.earned", detail: c })),
  },
  {
    id: "btech",
    parentId: "root",
    service: "education",
    operation: "b.tech · info tech",
    start: "2014-08",
    end: "2018-05",
    attributes: {
      "edu.degree": btech.degree,
      "edu.school": btech.school,
    },
    events: btech.notes?.map((n) => ({ name: "log", detail: n })),
  },
  {
    id: "algomox",
    parentId: "root",
    service: "algomox",
    operation: "build aiops + mlops",
    start: "2018-06",
    end: "2021-05",
    attributes: {
      "org.name": algomox.company,
      "org.domain": algomox.domain,
      "org.location": algomox.location,
    },
    events: algomox.highlights.map((h) => ({ name: "log", detail: h })),
    tags: algomox.technologies,
  },
  {
    id: "algomox-l1",
    parentId: "algomox",
    service: "algomox",
    operation: "role: swe-l1",
    start: "2018-06",
    end: "2019-05",
    attributes: { "role.title": "Software Engineer L1", "org.name": algomox.company },
    summary: [
      "Joined the founding engineering team. Shipped the first Go services for telemetry collection and took on system administration and source-control duties alongside development.",
    ],
    tags: ["Go", "Linux", "Bash"],
  },
  {
    id: "algomox-l2",
    parentId: "algomox",
    service: "algomox",
    operation: "role: swe-l2",
    start: "2019-06",
    end: "2021-05",
    attributes: { "role.title": "Software Engineer L2", "org.name": algomox.company },
    summary: [
      "Owned performance-critical paths: telemetry collectors load-tested past 10K metrics/sec and a Java ASM-based Cassandra writer that made high-volume inserts 10× faster. Ran technical demos for clients including Cisco and Mindtree.",
    ],
    tags: ["Go", "Java", "Cassandra"],
  },
  {
    id: "worklife",
    parentId: "root",
    service: "worklife",
    operation: "real-time pbm claims",
    start: "2021-06",
    end: null,
    attributes: {
      "org.name": worklife.company,
      "org.note": worklife.companyNote ?? "",
      "org.domain": worklife.domain,
      "org.location": worklife.location,
    },
    events: worklife.highlights.map((h) => ({ name: "log", detail: h })),
    tags: worklife.technologies,
  },
  {
    id: "wl-eng",
    parentId: "worklife",
    service: "worklife",
    operation: "role: engineer",
    start: "2021-06",
    end: "2021-09",
    attributes: { "role.title": "Engineer — Software Development", "org.name": worklife.company },
    summary: ["Joined the PBM claims team and ramped up on the adjudication platform for VisoryHealth."],
    tags: ["Go", "PostgreSQL"],
  },
  {
    id: "wl-senior",
    parentId: "worklife",
    service: "worklife",
    operation: "role: senior",
    start: "2021-10",
    end: "2023-03",
    attributes: { "role.title": "Senior Engineer — Software Development", "org.name": worklife.company },
    summary: [
      "Built and maintained the real-time claims microservices; drove containerisation, telemetry and monitoring on Azure.",
    ],
    tags: ["Go", "Docker", "Azure", "Prometheus", "Grafana"],
  },
  {
    id: "wl-principal",
    parentId: "worklife",
    service: "worklife",
    operation: "role: principal",
    start: "2023-04",
    end: "2024-03",
    attributes: { "role.title": "Principal Engineer", "org.name": worklife.company },
    summary: [
      "Owned performance of the core claim path (<100ms responses) and re-engineered PostgreSQL functions for 50–500ms per-query savings. Designed a proof of concept for a new U.S. healthcare product.",
    ],
    tags: ["Go", "PostgreSQL", "PL/pgSQL"],
  },
  {
    id: "wl-lead",
    parentId: "worklife",
    service: "worklife",
    operation: "role: tech-lead",
    start: "2024-04",
    end: null,
    attributes: { "role.title": "Tech Lead — Software Development", "org.name": worklife.company },
    summary: [
      "Lead a team of three on a live, regulated healthcare system: planning, delegation, code review, architecture and release ownership.",
    ],
    tags: ["Go", "PostgreSQL", "Azure"],
  },
  {
    id: "masters",
    parentId: "root",
    service: "education",
    operation: "master's · comp sci",
    start: "2022-03",
    end: "2024-12",
    attributes: {
      "edu.degree": masters.degree,
      "edu.school": masters.school,
    },
    events: masters.notes?.map((n) => ({ name: "log", detail: n })),
    tags: ["System Design", "DSA", "Data Engineering"],
  },
];

/* ---------- time helpers ---------- */

export function monthIndex(ym: string): number {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

export function nowMonthIndex(): number {
  const d = new Date();
  return d.getFullYear() * 12 + d.getMonth();
}

/** Inclusive month count. */
export function spanMonths(span: Span, now = nowMonthIndex()): number {
  const end = span.end ? monthIndex(span.end) : now;
  return end - monthIndex(span.start) + 1;
}

export function formatDuration(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m}mo`;
  if (m === 0) return `${y}y`;
  return `${y}y ${m}mo`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatMonth(index: number): string {
  return `${MONTHS[((index % 12) + 12) % 12]} ${Math.floor(index / 12)}`;
}

export function depthOf(span: Span): number {
  let d = 0;
  let cur = span;
  while (cur.parentId) {
    const parent = spans.find((s) => s.id === cur.parentId);
    if (!parent) break;
    cur = parent;
    d++;
  }
  return d;
}

/** Spans in display order: depth-first, children sorted by start. */
export function orderedSpans(): Span[] {
  const out: Span[] = [];
  const visit = (id: string | undefined) => {
    spans
      .filter((s) => s.parentId === id)
      .sort((a, b) => monthIndex(a.start) - monthIndex(b.start))
      .forEach((s) => {
        out.push(s);
        visit(s.id);
      });
  };
  visit(undefined);
  return out;
}
