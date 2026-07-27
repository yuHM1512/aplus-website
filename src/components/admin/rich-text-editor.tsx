"use client"

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  ImagePlus,
  Undo2,
  Redo2,
  Minus,
  Unlink,
  Pilcrow,
  Megaphone,
  HelpCircle,
  CheckSquare,
  Scale,
} from "lucide-react"
import { useCallback, useRef, useState, useEffect } from "react"

/* ─── Types ─── */
interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

/* ─── Slash command items ─── */
const SLASH_ITEMS = [
  { title: "Heading 1", icon: Heading1, command: "heading1" },
  { title: "Heading 2", icon: Heading2, command: "heading2" },
  { title: "Heading 3", icon: Heading3, command: "heading3" },
  { title: "Paragraph", icon: Pilcrow, command: "paragraph" },
  { title: "Bullet List", icon: List, command: "bulletList" },
  { title: "Numbered List", icon: ListOrdered, command: "orderedList" },
  { title: "Blockquote", icon: Quote, command: "blockquote" },
  { title: "Divider", icon: Minus, command: "horizontalRule" },
  { title: "Code Block", icon: Code, command: "codeBlock" },
  { title: "Image", icon: ImagePlus, command: "image" },
  { title: "SEO Outline", icon: Heading2, command: "seoOutline" },
  { title: "FAQ Block", icon: HelpCircle, command: "faqBlock" },
  { title: "CTA Block", icon: Megaphone, command: "ctaBlock" },
  { title: "Benefit Checklist", icon: CheckSquare, command: "benefitChecklist" },
  { title: "Pros and Cons", icon: Scale, command: "prosCons" },
]

const MARKETING_BLOCKS: Record<string, string> = {
  seoOutline: `
    <h2>Vấn đề khách hàng đang gặp</h2>
    <p>Mô tả ngắn tình huống thực tế, nguồn nước, nhu cầu sử dụng hoặc nỗi lo phổ biến.</p>
    <h2>Nguyên nhân và rủi ro cần lưu ý</h2>
    <p>Giải thích bằng ngôn ngữ dễ hiểu, tránh thuật ngữ quá kỹ thuật nếu không cần thiết.</p>
    <h2>Giải pháp APLUS đề xuất</h2>
    <p>Nêu giải pháp, nhóm sản phẩm hoặc dịch vụ phù hợp.</p>
    <h2>Khi nào nên khảo sát trực tiếp?</h2>
    <ul><li>Nguồn nước có mùi, màu hoặc cặn bất thường.</li><li>Nhu cầu dùng nước cao cho gia đình, văn phòng hoặc cơ sở kinh doanh.</li><li>Cần tối ưu chi phí bảo trì định kỳ.</li></ul>
  `,
  faqBlock: `
    <h2>Câu hỏi thường gặp</h2>
    <h3>1. Bao lâu nên thay lõi lọc một lần?</h3>
    <p>Thời gian thay lõi phụ thuộc vào nguồn nước, lưu lượng sử dụng và loại lõi lọc.</p>
    <h3>2. Có cần khảo sát nước trước khi lắp đặt không?</h3>
    <p>Nên khảo sát để chọn đúng công suất, công nghệ lọc và vị trí lắp đặt.</p>
  `,
  ctaBlock: `
    <blockquote><p><strong>Cần tư vấn giải pháp lọc nước phù hợp?</strong><br>Liên hệ APLUS để được khảo sát nguồn nước và đề xuất cấu hình tối ưu.</p></blockquote>
  `,
  benefitChecklist: `
    <h2>Lợi ích nổi bật</h2>
    <ul><li>Nguồn nước ổn định hơn cho nhu cầu sử dụng hằng ngày.</li><li>Giảm rủi ro cặn bẩn, mùi lạ và tạp chất không mong muốn.</li><li>Dễ bảo trì, dễ thay lõi và kiểm soát chi phí vận hành.</li></ul>
  `,
  prosCons: `
    <h2>Ưu điểm</h2>
    <ul><li>Phù hợp với nhiều nhu cầu sử dụng.</li><li>Dễ mở rộng hoặc nâng cấp khi cần.</li></ul>
    <h2>Lưu ý</h2>
    <ul><li>Cần chọn đúng công suất theo lưu lượng dùng nước.</li><li>Nên bảo trì định kỳ để giữ hiệu quả lọc ổn định.</li></ul>
  `,
}

/* ─── Toolbar Button ─── */
function ToolbarBtn({
  onClick,
  active = false,
  disabled = false,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={[
        "p-1.5 rounded transition-colors",
        active
          ? "bg-ocean-blue/10 text-ocean-blue"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
        disabled ? "opacity-40 cursor-not-allowed" : "",
      ].join(" ")}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="w-px h-5 bg-gray-200 mx-0.5" />
}

/* ─── Main Component ─── */
export function RichTextEditor({
  content,
  onChange,
  placeholder = "Nhập nội dung bài viết... Gõ / để chèn nhanh",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showSlash, setShowSlash] = useState(false)
  const [slashPos, setSlashPos] = useState({ top: 0, left: 0 })
  const [slashFilter, setSlashFilter] = useState("")
  const [slashIndex, setSlashIndex] = useState(0)
  const editorContainerRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-ocean-blue underline" },
      }),
      Image.configure({
        HTMLAttributes: { class: "rounded-lg max-w-full mx-auto" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[320px] px-5 py-4",
      },
      handleKeyDown: (view, event) => {
        if (!showSlash) return false

        if (event.key === "ArrowDown") {
          event.preventDefault()
          setSlashIndex((i) => (i + 1) % filteredSlashItems.length)
          return true
        }
        if (event.key === "ArrowUp") {
          event.preventDefault()
          setSlashIndex(
            (i) => (i - 1 + filteredSlashItems.length) % filteredSlashItems.length
          )
          return true
        }
        if (event.key === "Enter") {
          event.preventDefault()
          executeSlashCommand(filteredSlashItems[slashIndex]?.command)
          return true
        }
        if (event.key === "Escape") {
          setShowSlash(false)
          return true
        }
        return false
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML())

      // Slash command detection
      const { state } = e
      const { from } = state.selection
      const textBefore = state.doc.textBetween(
        Math.max(0, from - 20),
        from,
        "\n"
      )
      const slashMatch = textBefore.match(/\/([a-zA-Z0-9]*)$/)

      if (slashMatch) {
        setSlashFilter(slashMatch[1].toLowerCase())
        setSlashIndex(0)

        // Get cursor position for menu placement
        const coords = e.view.coordsAtPos(from)
        const containerRect = editorContainerRef.current?.getBoundingClientRect()
        if (containerRect) {
          setSlashPos({
            top: coords.bottom - containerRect.top + 4,
            left: coords.left - containerRect.left,
          })
        }
        setShowSlash(true)
      } else {
        setShowSlash(false)
      }
    },
  })

  useEffect(() => {
    if (!editor) return
    if (content !== editor.getHTML()) {
      editor.commands.setContent(content || "", true)
    }
  }, [content, editor])

  // Filter slash items
  const filteredSlashItems = SLASH_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(slashFilter)
  )

  // Execute slash command
  const executeSlashCommand = useCallback(
    (command: string | undefined) => {
      if (!editor || !command) return

      // Delete the slash + filter text
      const { state } = editor
      const { from } = state.selection
      const textBefore = state.doc.textBetween(
        Math.max(0, from - 20),
        from,
        "\n"
      )
      const slashMatch = textBefore.match(/\/([a-zA-Z0-9]*)$/)
      if (slashMatch) {
        editor
          .chain()
          .focus()
          .deleteRange({
            from: from - slashMatch[0].length,
            to: from,
          })
          .run()
      }

      switch (command) {
        case "heading1":
          editor.chain().focus().toggleHeading({ level: 1 }).run()
          break
        case "heading2":
          editor.chain().focus().toggleHeading({ level: 2 }).run()
          break
        case "heading3":
          editor.chain().focus().toggleHeading({ level: 3 }).run()
          break
        case "paragraph":
          editor.chain().focus().setParagraph().run()
          break
        case "bulletList":
          editor.chain().focus().toggleBulletList().run()
          break
        case "orderedList":
          editor.chain().focus().toggleOrderedList().run()
          break
        case "blockquote":
          editor.chain().focus().toggleBlockquote().run()
          break
        case "horizontalRule":
          editor.chain().focus().setHorizontalRule().run()
          break
        case "codeBlock":
          editor.chain().focus().toggleCodeBlock().run()
          break
        case "image":
          fileInputRef.current?.click()
          break
        case "seoOutline":
        case "faqBlock":
        case "ctaBlock":
        case "benefitChecklist":
        case "prosCons":
          editor.chain().focus().insertContent(MARKETING_BLOCKS[command]).run()
          break
      }

      setShowSlash(false)
    },
    [editor]
  )

  // Close slash menu on click outside
  useEffect(() => {
    const handler = () => setShowSlash(false)
    if (showSlash) {
      document.addEventListener("click", handler)
      return () => document.removeEventListener("click", handler)
    }
  }, [showSlash])

  // Image upload
  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor) return

      const formData = new FormData()
      formData.append("file", file)

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        })

        if (!res.ok) throw new Error("Upload failed")

        const { url } = await res.json()
        editor.chain().focus().setImage({ src: url, alt: file.name }).run()
      } catch {
        alert("Không thể tải ảnh lên. Vui lòng thử lại.")
      }
    },
    [editor]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleImageUpload(file)
      e.target.value = ""
    }
  }

  // Link handler
  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("Nhập URL:", previousUrl || "https://")

    if (url === null) return
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  return (
    <div
      ref={editorContainerRef}
      className="relative border border-[#E2E8F0] rounded-lg overflow-hidden bg-white"
    >
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-[#E2E8F0] bg-gray-50/80">
        <ToolbarBtn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Hoàn tác"
        >
          <Undo2 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Làm lại"
        >
          <Redo2 className="w-4 h-4" />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="In đậm (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="In nghiêng (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Gạch chân (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Gạch ngang"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Danh sách"
        >
          <List className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Danh sách đánh số"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Trích dẫn"
        >
          <Quote className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code block"
        >
          <Code className="w-4 h-4" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Đường kẻ ngang"
        >
          <Minus className="w-4 h-4" />
        </ToolbarBtn>

        <Divider />

        <ToolbarBtn onClick={setLink} active={editor.isActive("link")} title="Chèn link">
          <LinkIcon className="w-4 h-4" />
        </ToolbarBtn>
        {editor.isActive("link") && (
          <ToolbarBtn
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Bỏ link"
          >
            <Unlink className="w-4 h-4" />
          </ToolbarBtn>
        )}
        <ToolbarBtn
          onClick={() => fileInputRef.current?.click()}
          title="Chèn ảnh"
        >
          <ImagePlus className="w-4 h-4" />
        </ToolbarBtn>
      </div>

      {/* ── Bubble menu (appears on text selection) ── */}
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 150 }}
        className="flex items-center gap-0.5 rounded-lg border border-gray-200 bg-white px-1.5 py-1 shadow-lg"
      >
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <UnderlineIcon className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={setLink} active={editor.isActive("link")} title="Link">
          <LinkIcon className="w-3.5 h-3.5" />
        </ToolbarBtn>
      </BubbleMenu>

      {/* ── Editor ── */}
      <EditorContent editor={editor} />

      {/* ── Slash command menu ── */}
      {showSlash && filteredSlashItems.length > 0 && (
        <div
          className="absolute z-50 w-56 rounded-lg border border-gray-200 bg-white py-1 shadow-xl"
          style={{ top: slashPos.top, left: slashPos.left }}
        >
          <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Chèn nhanh
          </div>
          {filteredSlashItems.map((item, i) => {
            const Icon = item.icon
            return (
              <button
                key={item.command}
                type="button"
                className={[
                  "flex w-full items-center gap-3 px-3 py-2 text-sm transition-colors",
                  i === slashIndex
                    ? "bg-ocean-blue/10 text-ocean-blue"
                    : "text-gray-700 hover:bg-gray-50",
                ].join(" ")}
                onMouseEnter={() => setSlashIndex(i)}
                onMouseDown={(e) => {
                  e.preventDefault()
                  executeSlashCommand(item.command)
                }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.title}
              </button>
            )
          })}
        </div>
      )}

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Character count / hint */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-[#E2E8F0] bg-gray-50/50 text-xs text-gray-400">
        <span>Gõ <kbd className="px-1.5 py-0.5 rounded bg-gray-200 text-gray-600 font-mono text-[10px]">/</kbd> để chèn nhanh</span>
        <span>{editor.storage.characterCount?.characters?.() ?? editor.getText().length} ký tự</span>
      </div>
    </div>
  )
}
