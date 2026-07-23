import { headers } from "next/headers"
import { AuthProvider } from "@/components/admin/auth-provider"
import { AdminSidebar } from "@/components/admin/sidebar"
import { AdminTopbar } from "@/components/admin/topbar"
import { ToastProvider } from "@/components/admin/toast"

export const metadata = {
  title: "Admin | APLUS Technologies",
}

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const pathname = headersList.get("x-pathname") || ""
  const isLoginPage = pathname === "/admin/login"

  if (isLoginPage) {
    return <AuthProvider>{children}</AuthProvider>
  }

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">
          <AdminSidebar />
          <div className="ml-[260px] min-w-0">
            <AdminTopbar />
            <main className="p-8 max-w-[1600px]">{children}</main>
          </div>
        </div>
      </ToastProvider>
    </AuthProvider>
  )
}
