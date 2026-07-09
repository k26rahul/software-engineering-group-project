import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import useAuthStore from "@/store/authStore";

export default function MemberDashboard() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-col gap-6">
      {user && !user.is_active && (
        <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg border p-4 text-sm font-medium">
          Your account is currently deactivated and pending approval from a librarian. Some actions
          may be restricted.
        </div>
      )}
      <h1 className="text-3xl font-semibold tracking-tight">Member Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {user?.name || "Member"}</CardTitle>
          <CardDescription>This is an empty placeholder for the Member Dashboard.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
