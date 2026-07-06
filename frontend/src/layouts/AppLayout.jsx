export default function AppLayout({ children }) {
  return (
    <div className="bg-background flex min-h-screen">
      {/* Sidebar placeholder */}
      <aside className="bg-card w-64 border-r p-4">
        <p className="text-foreground font-semibold">Library MS</p>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="bg-card border-b px-6 py-3">
          <p className="text-muted-foreground text-sm">Header</p>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
