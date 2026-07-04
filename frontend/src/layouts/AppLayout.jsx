export default function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar placeholder */}
      <aside className="w-64 border-r bg-card p-4">
        <p className="font-semibold text-foreground">Library MS</p>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="border-b bg-card px-6 py-3">
          <p className="text-sm text-muted-foreground">Header</p>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
