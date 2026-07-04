export default function HomePage() {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold text-foreground">
        Library Management System
      </h1>
      <p className="text-muted-foreground">
        Frontend scaffold is running. Backend is at{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-sm">
          http://localhost:8000
        </code>
        .
      </p>
    </div>
  );
}
