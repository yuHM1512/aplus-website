// ─── Blog ────────────────────────────────────────────────
export interface Post {
  id: string
  slug: string
  title: string
  excerpt?: string
  content: string
  coverImage?: string
  published: boolean
  publishedAt?: Date
  createdAt: Date
  category?: Category
  tags?: Tag[]
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface Tag {
  id: string
  name: string
  slug: string
}

// ─── Contact Form ─────────────────────────────────────────
export interface ContactFormData {
  fullName: string
  email: string
  phone?: string
  needType: string
  description?: string
}

// ─── Product ─────────────────────────────────────────────
export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  category?: string
  featured: boolean
}

// ─── Site config ─────────────────────────────────────────
export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}
