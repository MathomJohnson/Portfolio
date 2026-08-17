/**
 * All site copy and data. Values marked [DRAFT] are placeholder content that
 * must be reviewed and finalized before ship.
 *
 * Icons are referenced by name rather than by component so this module stays
 * plain serializable data; the UI layer maps names to lucide-react components.
 */

export type SocialIconName = "linkedin" | "github" | "mail";

export type InterestIconName =
  | "sigma"
  | "microscope"
  | "code"
  | "cpu"
  | "activity";

export interface SocialLink {
  id: string;
  /** Visible only to assistive technology; icons carry no visible text. */
  label: string;
  href: string;
  icon: SocialIconName;
  external: boolean;
}

export interface InterestItem {
  id: string;
  label: string;
  icon: InterestIconName;
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: string[];
}

export interface ExperienceEntry {
  id: string;
  organization: string;
  role: string;
  dateRange: string;
  /** Rendered as a small mono badge next to the date range. */
  status?: "upcoming" | "present";
  bullets: string[];
  tags: string[];
}

export interface HeroContent {
  name: string;
  subtitle: string;
  resume: { href: string; label: string };
}

export interface AboutContent {
  eyebrow: string;
  heading: string;
  photo: { src: string; alt: string; width: number; height: number };
  paragraphs: string[];
  interests: InterestItem[];
}

export interface SkillsContent {
  eyebrow: string;
  heading: string;
  categories: SkillCategory[];
}

export interface ExperienceContent {
  eyebrow: string;
  heading: string;
  entries: ExperienceEntry[];
}

export interface ContactContent {
  eyebrow: string;
  closingLine: string;
  cta: { href: string; label: string };
  linkedIn: { href: string; label: string };
}

/** [DRAFT] Confirm the exact address before ship. */
export const emailAddress = "hello@example.com";

/** [DRAFT] Confirm the LinkedIn profile URL before ship. */
export const linkedInUrl = "https://www.linkedin.com/in/example";

export const githubUrl = "https://github.com/MathomJohnson";

/**
 * [DRAFT] Hero and Contact share this row so Contact reads as a deliberate
 * bookend to Hero.
 */
export const socialLinks: SocialLink[] = [
  {
    id: "linkedin",
    label: "LinkedIn profile",
    href: linkedInUrl,
    icon: "linkedin",
    external: true,
  },
  {
    id: "github",
    label: "GitHub profile",
    href: githubUrl,
    icon: "github",
    external: true,
  },
  {
    id: "email",
    label: "Email me",
    href: `mailto:${emailAddress}`,
    icon: "mail",
    external: false,
  },
];

export const heroContent: HeroContent = {
  // [DRAFT] Confirm full display name.
  name: "Mathom Johnson",
  subtitle: "CS + Data Science @ UW–Madison",
  resume: { href: "/resume.pdf", label: "Resume" },
};

export const heroPhoto = {
  src: "/headshot-hero.jpg",
  // [DRAFT] Confirm alt text.
  alt: "Mathom Johnson, headshot",
  width: 640,
  height: 640,
};

export const aboutContent: AboutContent = {
  eyebrow: "01 / About",
  heading: "About",
  photo: {
    src: "/headshot-about.jpg",
    // [DRAFT] Confirm alt text once the final photo is chosen.
    alt: "Mathom Johnson working at a desk",
    width: 900,
    height: 1200,
  },
  paragraphs: [
    "I am a co-founder and founding engineer at Praxora Education, an AI-powered OSCE practice platform for medical students, where I am currently building out production infrastructure.",
    "I recently completed a software engineering internship at U.S. Bank on the Power BI / BI Tools team, and I am heading into an embedded systems co-op at Plexus this fall. Alongside that, I am involved in behavioral neuroscience ML research at the Ehrlich Lab.",
    "Outside of engineering: endurance sports — marathon and Ironman training — and hardware projects.",
  ],
  interests: [
    { id: "math-data", label: "Math / Data", icon: "sigma" },
    { id: "science", label: "Science / Research", icon: "microscope" },
    { id: "software", label: "Software Engineering", icon: "code" },
    { id: "hardware", label: "Hardware / Embedded", icon: "cpu" },
    { id: "endurance", label: "Endurance Sports", icon: "activity" },
  ],
};

export const skillsContent: SkillsContent = {
  eyebrow: "02 / Skills",
  heading: "Skills",
  categories: [
    {
      id: "languages",
      label: "Languages",
      skills: ["Python", "TypeScript", "SQL", "C/C++"],
    },
    {
      id: "frameworks",
      label: "Frameworks & Web",
      skills: ["FastAPI", "Next.js / React", "Node.js"],
    },
    {
      id: "infra",
      label: "Infra & Data",
      skills: [
        "Supabase",
        "PostgreSQL",
        "Redis",
        "Docker",
        "Railway",
        "Vercel",
      ],
    },
    {
      id: "data-engineering",
      label: "Data Engineering",
      skills: ["Kafka", "Spark", "Cassandra", "gRPC"],
    },
    {
      id: "embedded",
      label: "Embedded",
      skills: ["ESP32", "Embedded C", "Sensor Integration (IMU)"],
    },
  ],
};

/**
 * [DRAFT] Order follows the source spec. Confirm ordering and exact dates —
 * Praxora is an ongoing role listed after two later-dated entries.
 */
export const experienceContent: ExperienceContent = {
  eyebrow: "03 / Experience",
  heading: "Experience",
  entries: [
    {
      id: "plexus",
      organization: "Plexus",
      role: "Embedded Systems Co-op",
      dateRange: "Fall 2026",
      status: "upcoming",
      bullets: [
        "Joining the embedded systems team to work on firmware and hardware-adjacent development.",
      ],
      // [DRAFT] Confirm stack.
      tags: ["Embedded C"],
    },
    {
      id: "us-bank",
      organization: "U.S. Bank",
      role: "Software Engineer Intern, Power BI Data Management / BI Tools",
      dateRange: "Summer 2026",
      bullets: [
        "Researched Microsoft Fabric AI capabilities, including Fabric Data Agents and Copilot in Power BI.",
        "Built a capacity monitoring tool spanning 1,000+ Fabric workspaces.",
        "Placed 1st of 28 teams in the company-wide intern pitch competition.",
      ],
      tags: ["Power BI", "Microsoft Fabric", "Tableau", "Alteryx"],
    },
    {
      id: "praxora",
      organization: "Praxora Education, Inc.",
      role: "Co-Founder & Founding Engineer",
      // No status badge: the date range already reads as ongoing, and showing
      // both renders as "Present (Present)".
      dateRange: "Present",
      bullets: [
        "Building the OSCE practice platform for medical students end to end.",
        "Running production infrastructure on FastAPI, Supabase, Redis, and Railway.",
        "Board member.",
      ],
      tags: ["FastAPI", "Supabase", "Redis", "Railway"],
    },
    {
      id: "ehrlich-lab",
      organization: "Ehrlich Lab, UW–Madison",
      role: "Research",
      // [DRAFT] Dates to confirm.
      dateRange: "Dates to confirm",
      bullets: [
        "Built an ML pipeline for zebrafish behavioral data.",
      ],
      tags: ["Python", "ML Pipeline"],
    },
    {
      id: "personaxr",
      organization: "PersonaXR (UW Tech Exploration Lab)",
      role: "Technical Contributor",
      // [DRAFT] Dates to confirm.
      dateRange: "Dates to confirm",
      bullets: [
        "Designed backend AI architecture for a personality scoring and matching system.",
      ],
      tags: ["Claude API", "Backend Architecture"],
    },
  ],
};

export const contactContent: ContactContent = {
  eyebrow: "04 / Contact",
  // [DRAFT] Confirm which closing line ships.
  closingLine: "Building things that work, and understanding why they do.",
  cta: { href: `mailto:${emailAddress}`, label: "Say hello" },
  linkedIn: { href: linkedInUrl, label: "LinkedIn" },
};

/** Section ids, in page order. Used for scroll cue targets and skip links. */
export const sectionIds = {
  hero: "hero",
  about: "about",
  skills: "skills",
  experience: "experience",
  contact: "contact",
} as const;
