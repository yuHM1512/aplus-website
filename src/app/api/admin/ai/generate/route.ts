import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const SYSTEM_PROMPT =
  "Bạn là chuyên gia content marketing cho APLUS Technologies - công ty lọc nước tại Quy Nhơn, Bình Định. Trả về JSON với title, excerpt, content. Content phải là HTML TipTap-safe, chỉ dùng p, h2, h3, ul, ol, li, blockquote, strong, em, a."

function buildGeminiPrompt(prompt: string) {
  return `${SYSTEM_PROMPT}

Viết một bài blog SEO-friendly dựa trên yêu cầu sau: ${prompt}

Trả về JSON với format:
{
  "title": "Tiêu đề bài viết hấp dẫn",
  "excerpt": "Tóm tắt ngắn 1-2 câu cho SEO",
  "content": "Nội dung đầy đủ bằng HTML TipTap-safe"
}

Chỉ trả về JSON, không thêm text nào khác.`
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { prompt } = await req.json()

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
  }

  const googleKey = process.env.GOOGLE_AI_KEY
  const openaiKey = process.env.OPENAI_API_KEY

  if (!googleKey && !openaiKey) {
    return NextResponse.json(
      { error: "Chưa cấu hình API key cho AI. Thêm GOOGLE_AI_KEY hoặc OPENAI_API_KEY vào .env" },
      { status: 500 }
    )
  }

  try {
    let title = ""
    let content = ""
    let excerpt = ""

    if (googleKey) {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: buildGeminiPrompt(prompt) }] }],
          }),
        }
      )

      if (res.ok) {
        const data = await res.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          title = parsed.title || ""
          content = parsed.content || ""
          excerpt = parsed.excerpt || ""
        }
      }
    } else if (openaiKey) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        }),
      })

      if (res.ok) {
        const data = await res.json()
        const parsed = JSON.parse(data.choices?.[0]?.message?.content || "{}")
        title = parsed.title || ""
        content = parsed.content || ""
        excerpt = parsed.excerpt || ""
      }
    }

    if (!content) {
      return NextResponse.json({ error: "AI không tạo được nội dung. Thử lại." }, { status: 500 })
    }

    return NextResponse.json({ title, content, excerpt })
  } catch (err) {
    console.error("AI generation error:", err)
    return NextResponse.json({ error: "Lỗi khi gọi AI service" }, { status: 500 })
  }
}
