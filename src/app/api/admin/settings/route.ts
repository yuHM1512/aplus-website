import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const settings = await prisma.siteSetting.findMany()
  const result: Record<string, string> = {}
  settings.forEach((s) => { result[s.key] = s.value })
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { siteSettings, aiSettings } = body

  const entries = [
    ...Object.entries(siteSettings || {}).map(([k, v]) => ({ key: `site.${k}`, value: String(v) })),
    ...Object.entries(aiSettings || {}).map(([k, v]) => ({ key: `ai.${k}`, value: String(v) })),
  ]

  for (const entry of entries) {
    await prisma.siteSetting.upsert({
      where: { key: entry.key },
      update: { value: entry.value },
      create: entry,
    })
  }

  return NextResponse.json({ success: true })
}
