export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Override admin layout — login page has no sidebar
  return (
    <div className="min-h-screen" style={{ marginLeft: 0 }}>
      {children}
    </div>
  )
}
