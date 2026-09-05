import { Helmet } from "react-helmet-async";
import { company } from "@/content/site";

const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://manpoweragancyeu.lovable.app";

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
};

const DEFAULT_OG_IMAGE = SITE_URL + "/logo.jpg";

export function Seo({ title, description, path = "/", image, type = "website", jsonLd, noindex }: SeoProps) {
  const url = SITE_URL + path;
  const ogImage = image ?? DEFAULT_OG_IMAGE;
  const fullTitle = title === company.name ? title : title + " | " + company.name;
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex ? <meta name="robots" content="noindex,nofollow" /> : null}

      <meta property="og:site_name" content={company.legalName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {blocks.map((block, i) => (
        <script type="application/ld+json" key={i}>
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.legalName,
  alternateName: company.name,
  url: SITE_URL,
  logo: SITE_URL + "/logo.jpg",
  image: SITE_URL + "/logo.jpg",
  slogan: company.tagline,
  email: company.email,
  telephone: company.phones,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address.street,
    addressLocality: company.address.city,
    postalCode: company.address.postcode,
    addressCountry: "RO",
  },
  sameAs: [company.facebook, company.linkedin],
};

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: SITE_URL + item.path,
    })),
  };
}

export { SITE_URL };
