"use client"

import { useState } from "react"
import { Save, Globe, Bot, Shield } from "lucide-react"

export default function SettingsPage() {
  const [siteSettings, setSiteSettings] = useState({
    siteName: "APLUS Technologies",
    hotline: "0935 455 558",
    email: "contact@aplustechnologies.vn",
    address: "TP. Quy Nhơn, Tỉnh Bình Định, Việt Nam",
    facebook: "https://www.facebook.com/locnuocphuocsang",
    zalo: "https://zalo.me/0935455558",
    tiktok: "https://www.tiktok.com/@aqualife_plus",
  })

  const [aiSettings, setAiSettings] = useState({
    defaultModel: "gemini-2.5-flash",
    systemPrompt:
      "Bạn là chuyên gia content marketing cho APLUS Technologies - công ty lọc nước tại Quy Nhơn, Bình Định. Viết bài SEO-friendly, chuyên nghiệp, hướng đến khách hàng gia đình và doanh nghiệp cần giải pháp lọc nước.",
    rateLimit: 10,
  })

  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<"site" | "ai">("site")

  const handleSave = async () => {
    setSaving(true)
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteSettings, aiSettings }),
    })
    setSaving(false)
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-deep-blue">Cài đặt</h2>
          <p className="text-sm text-gray-500 mt-1">Quản lý cấu hình website và AI</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-deep-blue transition-colors shadow-sm disabled:opacity-70"
        >
          <Save className="w-4 h-4" />
          {saving ? "Đang lưu..." : "Lưu cài đặt"}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-[#E2E8F0]">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("site")}
            className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "site"
                ? "border-ocean-blue text-ocean-blue"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Globe className="w-4 h-4" />
            Thông tin website
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "ai"
                ? "border-ocean-blue text-ocean-blue"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <Bot className="w-4 h-4" />
            Cấu hình AI
          </button>
        </div>
      </div>

      {activeTab === "site" && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-5 max-w-2xl">
          <div>
            <label className="text-sm font-medium text-gray-900 mb-1.5 block">Tên website</label>
            <input
              type="text"
              value={siteSettings.siteName}
              onChange={(e) => setSiteSettings((s) => ({ ...s, siteName: e.target.value }))}
              className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1.5 block">Hotline</label>
              <input
                type="text"
                value={siteSettings.hotline}
                onChange={(e) => setSiteSettings((s) => ({ ...s, hotline: e.target.value }))}
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900 mb-1.5 block">Email</label>
              <input
                type="email"
                value={siteSettings.email}
                onChange={(e) => setSiteSettings((s) => ({ ...s, email: e.target.value }))}
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900 mb-1.5 block">Địa chỉ</label>
            <input
              type="text"
              value={siteSettings.address}
              onChange={(e) => setSiteSettings((s) => ({ ...s, address: e.target.value }))}
              className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
            />
          </div>
          <div className="pt-4 border-t border-[#E2E8F0]">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Mạng xã hội</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-900 mb-1.5 block">Facebook</label>
                <input
                  type="url"
                  value={siteSettings.facebook}
                  onChange={(e) => setSiteSettings((s) => ({ ...s, facebook: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900 mb-1.5 block">Zalo</label>
                <input
                  type="url"
                  value={siteSettings.zalo}
                  onChange={(e) => setSiteSettings((s) => ({ ...s, zalo: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-900 mb-1.5 block">TikTok</label>
                <input
                  type="url"
                  value={siteSettings.tiktok}
                  onChange={(e) => setSiteSettings((s) => ({ ...s, tiktok: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "ai" && (
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-5 max-w-2xl">
          <div>
            <label className="text-sm font-medium text-gray-900 mb-1.5 block">Model mặc định</label>
            <select
              value={aiSettings.defaultModel}
              onChange={(e) => setAiSettings((s) => ({ ...s, defaultModel: e.target.value }))}
              className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue outline-none bg-white"
            >
              <option value="gemini-2.5-flash">Gemini 2.5 Flash (Recommended - tiết kiệm)</option>
              <option value="gpt-4o-mini">GPT-4o-mini (SEO tốt)</option>
              <option value="claude-haiku-4.5">Claude Haiku 4.5 (Sáng tạo)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900 mb-1.5 block">System Prompt</label>
            <textarea
              value={aiSettings.systemPrompt}
              onChange={(e) => setAiSettings((s) => ({ ...s, systemPrompt: e.target.value }))}
              rows={5}
              className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none resize-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-900 mb-1.5 block">
              Rate Limiting
              <span className="text-gray-400 font-normal ml-2">Số lượt gọi AI tối đa / giờ</span>
            </label>
            <input
              type="number"
              value={aiSettings.rateLimit}
              onChange={(e) => setAiSettings((s) => ({ ...s, rateLimit: parseInt(e.target.value) || 10 }))}
              className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-sm focus:border-ocean-blue focus:ring-2 focus:ring-ocean-blue/20 outline-none"
            />
          </div>
          <div className="pt-4 border-t border-[#E2E8F0]">
            <div className="flex items-start gap-3 p-4 bg-[#eff4ff] rounded-lg">
              <Shield className="w-5 h-5 text-ocean-blue mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">API Keys</p>
                <p className="text-xs text-gray-500 mt-1">
                  Cấu hình API keys trong file .env trên server (GOOGLE_AI_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY).
                  Không lưu keys trong database.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
