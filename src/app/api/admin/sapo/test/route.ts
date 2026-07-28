// src/app/api/admin/sapo/test/route.ts
// Kiểm tra env vars có được load đúng không (KHÔNG lộ giá trị thật)

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const store = process.env.SAPO_STORE
  const key = process.env.SAPO_API_KEY
  const secret = process.env.SAPO_API_SECRET

  return NextResponse.json({
    SAPO_STORE: store ? `"${store}" (${store.length} ký tự)` : "❌ TRỐNG",
    SAPO_API_KEY: key ? `"${key.slice(0, 4)}...${key.slice(-4)}" (${key.length} ký tự)` : "❌ TRỐNG",
    SAPO_API_SECRET: secret ? `"${secret.slice(0, 4)}...${secret.slice(-4)}" (${secret.length} ký tự)` : "❌ TRỐNG",
    hint: "Nếu có mục nào TRỐNG, kiểm tra lại file .env.local rồi restart dev server",
  })
}
