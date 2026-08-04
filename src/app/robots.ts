import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://aplustech.vn"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/thanh-toan", "/gio-hang"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
