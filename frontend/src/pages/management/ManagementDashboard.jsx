import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function ManagementDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">Management Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, Management</CardTitle>
          <CardDescription>
            This is an empty placeholder for the Management Dashboard.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
