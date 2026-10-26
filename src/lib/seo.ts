/**
 * Shared SEO helpers for SKILL AI India.
 *
 * Every route's head() should call pageHead() so titles, descriptions,
 * canonicals and social tags stay consistent. JSON-LD builders live here too.
 *
 * Canonical/og:url use relative paths — crawlers resolve them against the
 * live host, so they stay correct on any domain.
 */

export const SITE = {
  name: "Skill AI India",
  legalName: "SKILL AI School of Business",
  brandLine: "Skill AI India — Learn Skill, Get Job",
  city: "Mangalore",
  region: "Karnataka",
  country: "India",
  email: "Connect@skillaiindia.com",
  description:
    "Skill AI India in Mangalore offers job-focused AI, Multimedia, Management and UG/PG programs with live projects, internships and placement support.",
};

/** Organization + local education business JSON-LD (attach on the home route). */
export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE.name,
    alternateName: [SITE.legalName, "Skill AI", "SkillAI"],
    slogan: "Learn Skill, Get Job",
    description: SITE.description,
    email: SITE.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mangalore",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    areaServed: ["Mangalore", "Karnataka", "India"],
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

/** BreadcrumbList JSON-LD. items: [{ name, path }] from home to the page. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.path,
    })),
  };
}

/** Course JSON-LD for a single program page. */
export function courseJsonLd(opts: {
  name: string;
  description: string;
  path: string;
  programMode?: "Full-Time" | "Part-Time";
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: opts.name,
    description: opts.description,
    url: opts.path,
    inLanguage: "en",
    provider: {
      "@type": "EducationalOrganization",
      name: SITE.name,
      sameAs: "/",
    },
    offers: {
      "@type": "Offer",
      category: "Paid",
      availability: "https://schema.org/InStock",
      areaServed: "IN",
    },
    ...(opts.programMode ? { courseMode: opts.programMode } : {}),
  };
}

/** ItemList of Course entries for a program-category hub page. */
export function courseListJsonLd(courses: { name: string; path: string; description: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        name: c.name,
        description: c.description,
        url: c.path,
        provider: { "@type": "EducationalOrganization", name: SITE.name, sameAs: "/" },
      },
    })),
  };
}

export interface PageHeadOptions {
  title: string;
  description: string;
  /** Route path, e.g. "/ai/gen-ai". Used for canonical + og:url. */
  path: string;
  ogType?: string;
  /** Extra JSON-LD objects to emit on this page. */
  schemas?: unknown[];
  /** Extra meta entries appended after the defaults. */
  extraMeta?: Record<string, string>[];
}

export function pageHead(opts: PageHeadOptions) {
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:type", content: opts.ogType ?? "website" },
      { property: "og:url", content: opts.path },
      { name: "twitter:card", content: "summary_large_image" },
      ...(opts.extraMeta ?? []),
    ],
    links: [{ rel: "canonical", href: opts.path }],
    scripts: (opts.schemas ?? []).map((schema) => ({
      type: "application/ld+json",
      children: JSON.stringify(schema),
    })),
  };
}
