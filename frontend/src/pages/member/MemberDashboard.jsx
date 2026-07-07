import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function MemberDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">Member Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, Member</CardTitle>
          <CardDescription>This is an empty placeholder for the Member Dashboard.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
