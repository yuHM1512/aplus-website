import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/constants";
import { GoogleAnalytics } from "@/components/seo/google-analytics";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    // SEO: title mặc định chứa keyword chính + local + brand (58 ký tự)
    default: "Máy Lọc Nước Quy Nhơn, Bình Định — Aplus Technologies",
    template: `%s | Aplus Technologies`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    // Keyword chính — local intent
    "máy lọc nước Quy Nhơn", "máy lọc nước Bình Định", "lọc nước Quy Nhơn",
    "lọc nước Bình Định", "đại lý máy lọc nước Bình Định",
    // Keyword ngành — volume cao
    "máy lọc nước", "máy lọc nước RO", "máy lọc nước Nano",
    "lọc nước đầu nguồn", "hệ thống lọc nước", "cột lọc nước",
    // Keyword thương hiệu phân phối
    "máy lọc nước Karofi", "máy lọc nước Kangaroo", "máy lọc nước A.O. Smith",
    // Keyword dịch vụ
    "lắp đặt máy lọc nước", "thay lõi lọc nước", "bảo trì máy lọc nước",
    "lọc nước gia đình", "lọc nước công nghiệp",
    // Brand
    "aplus technologies", "lọc nước Phước Sang",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_CONFIG.url,
    siteName: "Aplus Technologies",
    title: "Máy Lọc Nước Chính Hãng Quy Nhơn, Bình Định — Aplus Technologies",
    description: SITE_CONFIG.description,
    images: [
      {
        url: "/images/logo/logo-horizontal.png",
        width: 1200,
        height: 630,
        alt: "Aplus Technologies — Giải pháp lọc nước toàn diện tại Quy Nhơn, Bình Định",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Máy Lọc Nước Chính Hãng — Aplus Technologies Quy Nhơn",
    description: SITE_CONFIG.description,
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
