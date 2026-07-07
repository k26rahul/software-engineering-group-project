import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function LibrarianDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">Librarian Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, Librarian</CardTitle>
          <CardDescription>
            This is an empty placeholder for the Librarian Dashboard.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
