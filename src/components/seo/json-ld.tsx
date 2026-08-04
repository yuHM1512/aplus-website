import { SITE_CONFIG, SOCIAL_LINKS } from "@/lib/constants"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://aplustech.vn"

// ── Generic script tag renderer ──
function JsonLdScript({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// ── LocalBusiness — inject once in marketing layout ──
export function LocalBusinessJsonLd() {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: SITE_CONFIG.name,
        alternateName: SITE_CONFIG.brandName,
        description: SITE_CONFIG.description,
        url: BASE_URL,
        telephone: SITE_CONFIG.hotline,
        email: SITE_CONFIG.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Quy Nhơn",
          addressRegion: "Bình Định",
          addressCountry: "VN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 13.776,
          longitude: 109.223,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          opens: "07:30",
          closes: "22:00",
        },
        sameAs: [
          SOCIAL_LINKS.facebook,
          SOCIAL_LINKS.instagram,
          SOCIAL_LINKS.tiktok,
          SOCIAL_LINKS.shopee,
        ],
        image: `${BASE_URL}/images/logo/logo-horizontal.png`,
        priceRange: "$$",
      }}
    />
  )
}

// ── Product — inject in product detail page ──
interface ProductJsonLdProps {
  name: string
  description: string | null
  image: string | null
  slug: string
  price: string | null
  priceNumeric: number | null
  brand: string | null
  category: string | null
  availability?: boolean
}

export function ProductJsonLd({
  name,
  description,
  image,
  slug,
  price,
  priceNumeric,
  brand,
  category,
  availability = true,
}: ProductJsonLdProps) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description: description || `${name} - ${SITE_CONFIG.name}`,
        image: image ? (image.startsWith("http") ? image : `${BASE_URL}${image}`) : undefined,
        url: `${BASE_URL}/products/${slug}`,
        brand: {
          "@type": "Brand",
          name: brand || SITE_CONFIG.name,
        },
        category: category || undefined,
        offers: {
          "@type": "Offer",
          url: `${BASE_URL}/products/${slug}`,
          priceCurrency: "VND",
          price: priceNumeric || 0,
          priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          availability: availability
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
          seller: {
            "@type": "Organization",
            name: SITE_CONFIG.name,
          },
        },
      }}
    />
  )
}

// ── Article — inject in blog detail page ──
interface ArticleJsonLdProps {
  title: string
  description: string | null
  coverImage: string | null
  slug: string
  publishedAt: string | null
  updatedAt: string
}

export function ArticleJsonLd({
  title,
  description,
  coverImage,
  slug,
  publishedAt,
  updatedAt,
}: ArticleJsonLdProps) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description: description || title,
        image: coverImage
          ? coverImage.startsWith("http")
            ? coverImage
            : `${BASE_URL}${coverImage}`
          : undefined,
        url: `${BASE_URL}/blog/${slug}`,
        datePublished: publishedAt || updatedAt,
        dateModified: updatedAt,
        author: {
          "@type": "Organization",
          name: SITE_CONFIG.name,
          url: BASE_URL,
        },
        publisher: {
          "@type": "Organization",
          name: SITE_CONFIG.name,
          logo: {
            "@type": "ImageObject",
            url: `${BASE_URL}/images/logo/logo-horizontal.png`,
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${BASE_URL}/blog/${slug}`,
        },
      }}
    />
  )
}

// ── BreadcrumbList — reusable breadcrumb schema ──
interface BreadcrumbItem {
  name: string
  href: string
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return (
    <JsonLdScript
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${BASE_URL}${item.href}`,
        })),
      }}
    />
  )
}
