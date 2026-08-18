/**
 * All site copy and data. Values marked [DRAFT] are placeholder content that
 * must be reviewed and finalized before ship.
 *
 * Icons are referenced by name rather than by component so this module stays
 * plain serializable data; the UI layer maps names to lucide-react components.
 */

export type SocialIconName = "linkedin" | "github" | "youtube";

export type InterestIconName =
  | "sigma"
  | "microscope"
  | "code"
  | "landmark"
  | "tennis";

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
  /** Argument to `cat` in the printed prompt, e.g. "languages". */
  filename: string;
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
  /**
   * Organization mark. Swap the file in `public/experience-logos/` (or point
   * `src` at a JPEG) without touching the card markup.
   */
  logo: { src: string; alt: string };
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

export const emailAddress = "mathomgj@gmail.com";

export const linkedInUrl = "https://www.linkedin.com/in/mathomjohnson/";

export const githubUrl = "https://github.com/MathomJohnson";

export const youtubeUrl =
  "https://www.youtube.com/channel/UCPgHcSZgy6dNjFx23H2LWQg";

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
    id: "youtube",
    label: "YouTube channel",
    href: youtubeUrl,
    icon: "youtube",
    external: true,
  },
];

export const heroContent: HeroContent = {
  // [DRAFT] Confirm full display name.
  name: "Mathom Johnson",
  subtitle: "Computer Science & Data Science @ UW—Madison",
  resume: { href: "/mathom_resume.pdf", label: "Resume" },
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
    "My name is Mathom, and I'm a Senior at the University of Wisconsin–Madison.",
    "I'm a co-founder and founding engineer at Praxora, a pre-seed funded OSCE practice platform for medical students. This Summer I completed a software engineering internship at U.S. Bank on the Microsoft Fabric Tools team, and this Fall I'm doing an embedded systems engineering co-op at Plexus.",
    "Outside of engineering, I like exploring nature through hiking, swimming, and paddleboarding. I play soccer and tennis. And when I'm not doing that, I'm probably spending too much time watching Dave Ramsey and picking funds for my Roth IRA.",
  ],
  interests: [
    { id: "math-data", label: "Math / Data", icon: "sigma" },
    { id: "science", label: "Science / Research", icon: "microscope" },
    { id: "software", label: "Software Engineering", icon: "code" },
    { id: "finance", label: "Finance / Economics", icon: "landmark" },
    { id: "sports", label: "Sports", icon: "tennis" },
  ],
};

/**
 * Categories printed left to right by TERMINAL_PRINT. Column order is array
 * order, so reordering here reorders the print sequence.
 */
export const skillsContent: SkillsContent = {
  eyebrow: "02 / Skills",
  heading: "Skills",
  categories: [
    {
      id: "languages",
      label: "Languages",
      filename: "languages",
      skills: [
        "Python",
        "Java",
        "JavaScript",
        "TypeScript",
        "C",
        "SQL",
        "R",
        "MATLAB",
        "PowerShell",
      ],
    },
    {
      id: "frameworks",
      label: "Frameworks & Libraries",
      filename: "frameworks",
      skills: [
        "FastAPI",
        "Flask",
        "Django",
        ".NET",
        "Node.js",
        "Next.js",
        "React",
        "scikit-learn",
        "HTML/CSS",
      ],
    },
    {
      id: "databases",
      label: "Databases & Data Stores",
      filename: "databases",
      skills: ["PostgreSQL", "MongoDB", "SQLite", "Redis", "ChromaDB"],
    },
    {
      id: "infra",
      label: "Cloud, Infra & Hardware",
      filename: "infra",
      skills: [
        "Supabase",
        "Railway",
        "Vercel",
        "GCP",
        "ESP32",
        "Raspberry Pi",
        "Linux",
      ],
    },
    {
      id: "tools",
      label: "Dev & AI Tools",
      filename: "tools",
      skills: ["Git", "Cursor", "Claude Code", "Codex", "Ollama"],
    },
  ],
};

/**
 * Order is upcoming / most recent first. Praxora is an ongoing role listed
 * after later-dated internships.
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
      tags: ["Embedded C"],
      logo: { src: "/experience-logos/plexus.png", alt: "Plexus logo" },
    },
    {
      id: "us-bank",
      organization: "U.S. Bank",
      role: "Software Engineer Intern",
      dateRange: "Jun. 2026 – Aug. 2026",
      bullets: [
        "Investigated a PostgreSQL connection pooling incident caused by mismatched client/server configs, then built standardized pooling modules to prevent recurrence.",
        "Built a Python capacity monitoring tool across 1,000+ Fabric workspaces to flag inefficient workloads.",
        "Researched Microsoft Fabric AI capabilities and presented findings to 1,300+ employees.",
      ],
      tags: ["Python", "PostgreSQL", "Microsoft Fabric", "Power BI"],
      logo: { src: "/experience-logos/us-bank.png", alt: "U.S. Bank logo" },
    },
    {
      id: "praxora",
      organization: "Praxora Education, Inc.",
      role: "Co-Founder & Engineer",
      // No status badge: the date range already reads as ongoing, and showing
      // both renders as "Present (Present)".
      dateRange: "Oct. 2025 – Present",
      bullets: [
        "Co-founded an incorporated ed-tech startup that has secured $30,000 in funding; serve on the board of directors.",
        "Designed core software and backend architecture (FastAPI, Supabase, Railway, Vercel) and made foundational stack decisions.",
        "Shipped full-stack features including REST APIs, Redis rate limiting, edge functions, and transactional email.",
      ],
      tags: ["FastAPI", "Supabase", "Redis", "Railway", "Vercel"],
      logo: { src: "/experience-logos/praxora.jpeg", alt: "Praxora logo" },
    },
    {
      id: "morgridge",
      organization: "Morgridge Institute for Research",
      role: "Undergraduate Researcher, Embedded Systems",
      dateRange: "Sep. 2025 – May 2026",
      bullets: [
        "Designed control dashboard features to regulate cathode heaters and high-voltage components in a research-grade 3D metal printer.",
        "Developed hardware–software interface tests to validate reliability, enforce safety protocols, and ensure reproducible performance.",
      ],
      tags: ["Embedded Systems", "Hardware", "Testing"],
      logo: {
        src: "/experience-logos/MIR.jpeg",
        alt: "Morgridge Institute for Research logo",
      },
    },
    {
      id: "ehrlich-lab",
      organization: "Ehrlich Lab, UW–Madison",
      role: "Undergraduate Researcher, Data Analysis",
      dateRange: "Feb. 2025 – May 2026",
      bullets: [
        "Developed Python/MATLAB scripts and analysis pipelines to process behavioral data for a life sciences research initiative.",
        "Designed experimental hardware with Arduino and IoT components for a larval zebrafish behavioral assay.",
        "Engineered an ML-driven CLI that classified key behavioral movements and more than doubled processing speed.",
      ],
      tags: ["Python", "MATLAB", "Arduino", "Machine Learning"],
      logo: { src: "/experience-logos/uw-madison.png", alt: "University of Wisconsin–Madison logo" },
    },
    {
      id: "wec",
      organization: "WEC Energy Group",
      role: "Software Development Intern",
      dateRange: "May 2025 – Aug. 2025",
      bullets: [
        "Interpreted UML diagrams, database schemas, and interface classes for a data pipeline that stores over 2,200 objects daily.",
        "Designed unit and integration test suites that raised code coverage to 92%.",
        "Refactored and modularized core functions to improve reusability, testability, and adherence to design patterns.",
      ],
      tags: ["Data Pipeline", "Testing", "Agile"],
      logo: { src: "/experience-logos/wec.png", alt: "WEC Energy Group logo" },
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
