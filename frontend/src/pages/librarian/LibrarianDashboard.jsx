import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useDashboardStore from "@/store/dashboardStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Clock,
  UserCheck,
  CalendarDays,
  Check,
  X,
  Bell,
  ArrowRight,
  BookOpen,
  Plus,
  RotateCcw,
  FileText,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export default function LibrarianDashboard() {
  const {
    librarianStats: stats,
    alerts,
    loading,
    error,
    actionLoading,
    fetchLibrarianDashboard,
    dismissAlert,
    handleMemberAction: storeMemberAction,
  } = useDashboardStore();
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchLibrarianDashboard();
    }
    return () => {
      mounted = false;
    };
  }, [fetchLibrarianDashboard]);

  const handleDismissAlert = (id) => {
    dismissAlert(id);
  };

  const handleMemberAction = async (id, action) => {
    try {
      setActionError(null);
      await storeMemberAction(id, action);
    } catch (err) {
      console.error(`Failed to ${action} member:`, err);
      setActionError(`Error processing request: ${err.message}`);
      setTimeout(() => setActionError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <span className="text-muted-foreground text-sm font-medium">Loading your dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive border-destructive/20 flex flex-col items-center gap-4 rounded-xl border p-8 text-center">
        <AlertTriangle className="h-10 w-10" />
        <div>
          <h3 className="text-lg font-semibold">Could not load dashboard</h3>
          <p className="mt-1 text-sm opacity-90">{error}</p>
        </div>
        <Button variant="outline" onClick={fetchLibrarianDashboard} className="gap-2">
          <RotateCcw className="h-4 w-4" /> Try Again
        </Button>
      </div>
    );
  }

  if (!stats) return null;

  const budgetPercent = stats
    ? Math.min(100, Math.round((stats.budget_spent / stats.budget_limit) * 100))
    : 0;

  // Progress bar colors based on utilization
  const getProgressColorClass = (percent) => {
    if (percent >= 90) return "bg-red-500";
    if (percent >= 75) return "bg-amber-500";
    return "bg-primary";
  };

  return (
    <div className="animate-fade-in flex flex-col gap-8 pb-12 duration-300">
      <div className="flex flex-col gap-2">
        <h1 className="from-primary bg-linear-to-r to-emerald-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          Librarian Operations
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Monitor library activity, manage registrations, budget tracking, and process alerts.
        </p>
      </div>

      {/* Stats Widgets Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Pending Approvals */}
        <Card className="border-l-4 border-l-amber-500 transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-600">
              <UserCheck className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pending_approvals_count}</div>
            <p className="text-muted-foreground mt-1 text-xs">Requires review & action</p>
          </CardContent>
        </Card>

        {/* Overdue Books */}
        <Card className="border-l-destructive border-l-4 transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Overdue Books
            </CardTitle>
            <div className="bg-destructive/10 text-destructive rounded-lg p-2">
              <Clock className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">{stats.overdue_books_count}</div>
            <p className="text-muted-foreground mt-1 text-xs">Outstanding return periods</p>
          </CardContent>
        </Card>

        {/* Active Reservations */}
        <Card className="border-l-4 border-l-blue-500 transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Active Reservations
            </CardTitle>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
              <CalendarDays className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.active_reservations_count}</div>
            <p className="text-muted-foreground mt-1 text-xs">Members in book queues</p>
          </CardContent>
        </Card>

        {/* Budget Utilization */}
        <Card className="border-l-primary border-l-4 transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Monthly Budget
            </CardTitle>
            <div className="text-primary text-xs font-semibold">
              ₹{stats.budget_spent.toLocaleString()} / ₹{stats.budget_limit.toLocaleString()}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground font-bold">{budgetPercent}% Spent</span>
              <span className="text-muted-foreground">
                ₹{(stats.budget_limit - stats.budget_spent).toLocaleString()} left
              </span>
            </div>
            <div className="bg-muted h-2 w-full rounded-full">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColorClass(budgetPercent)}`}
                style={{ width: `${budgetPercent}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Alerts & Notifications Widget */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div>
                <CardTitle className="text-lg font-bold">Active Alerts</CardTitle>
                <CardDescription>System events requiring immediate attention</CardDescription>
              </div>
              <span className="bg-destructive/10 text-destructive flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold">
                <Bell className="fill-destructive/20 h-3.5 w-3.5" />
                {alerts.length} Pending
              </span>
            </CardHeader>
            <CardContent className="p-0">
              {alerts.length === 0 ? (
                <div className="text-muted-foreground flex flex-col items-center justify-center p-12 text-center">
                  <CheckCircleIcon className="mb-3 h-12 w-12 text-emerald-500" />
                  <p className="text-foreground font-semibold">All clear!</p>
                  <p className="text-sm">No new active alerts or notifications.</p>
                </div>
              ) : (
                <div className="max-h-[350px] divide-y overflow-y-auto">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="hover:bg-muted/30 group flex items-start gap-4 p-4 transition-colors duration-150"
                    >
                      <div className={`mt-0.5 rounded-lg p-2 ${getAlertIconBg(alert.type)}`}>
                        {getAlertIcon(alert.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-foreground text-sm leading-snug font-medium">
                          {alert.message}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {new Date(alert.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          - {new Date(alert.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleDismissAlert(alert.id)}
                        className="hover:bg-destructive/10 hover:text-destructive self-center opacity-0 transition-all duration-200 group-hover:opacity-100"
                      >
                        Dismiss
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Panel */}
        <Card className="flex h-full flex-col justify-between">
          <CardHeader className="border-b pb-4">
            <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            <CardDescription>Common operations links</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 pt-6">
            <Button
              asChild
              variant="outline"
              className="group h-11 w-full justify-between text-left"
            >
              <Link to="/librarian/issue" className="flex w-full items-center justify-between">
                <span className="flex items-center gap-3">
                  <BookOpen className="text-primary h-5 w-5" />
                  <span className="text-foreground font-semibold">Issue Book</span>
                </span>
                <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="group h-11 w-full justify-between text-left"
            >
              <Link to="/librarian/return" className="flex w-full items-center justify-between">
                <span className="flex items-center gap-3">
                  <RotateCcw className="text-primary h-5 w-5" />
                  <span className="text-foreground font-semibold">Process Return</span>
                </span>
                <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="group h-11 w-full justify-between text-left"
            >
              <Link to="/librarian/catalog" className="flex w-full items-center justify-between">
                <span className="flex items-center gap-3">
                  <Plus className="text-primary h-5 w-5" />
                  <span className="text-foreground font-semibold">Add Book to Catalog</span>
                </span>
                <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="group h-11 w-full justify-between text-left"
            >
              <Link to="/librarian/budget" className="flex w-full items-center justify-between">
                <span className="flex items-center gap-3">
                  <FileText className="text-primary h-5 w-5" />
                  <span className="text-foreground font-semibold">Budget Tracker</span>
                </span>
                <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
              </Link>
            </Button>
          </CardContent>
          <div className="text-muted-foreground mt-4 border-t p-6 pt-0 text-center text-xs">
            Authorized Librarian Context
          </div>
        </Card>
      </div>

      {/* Details Tables Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Approvals Table */}
        <Card className="flex flex-col">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Pending Registrations</CardTitle>
                <CardDescription>Review and activate new member accounts</CardDescription>
              </div>
              <Link
                to="/librarian/members"
                className="text-primary flex items-center gap-1 text-xs font-semibold hover:underline"
              >
                View Directory <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {actionError && (
              <div className="text-destructive bg-destructive/10 mt-2 rounded p-2 text-sm">
                {actionError}
              </div>
            )}
          </CardHeader>
          <CardContent className="flex-1 p-0">
            {stats.pending_approvals.length === 0 ? (
              <div className="text-muted-foreground flex h-[250px] flex-col items-center justify-center p-8 text-center">
                <UserCheck className="text-muted-foreground/50 mb-2 h-10 w-10" />
                <p className="text-foreground font-medium">No pending registrations</p>
                <p className="text-xs">Any new registration requests will show up here.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-muted/50 text-muted-foreground border-b font-semibold">
                      <th className="p-4">Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Registered</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {stats.pending_approvals.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                        <td className="text-foreground p-4 font-medium">{user.name}</td>
                        <td className="text-muted-foreground p-4 text-xs sm:text-sm">
                          {user.email}
                        </td>
                        <td className="text-muted-foreground p-4 text-xs">{user.created_at}</td>
                        <td className="p-4 text-right">
                          <div className="inline-flex gap-1.5">
                            <Button
                              size="xs"
                              variant="default"
                              onClick={() => handleMemberAction(user.id, "approve")}
                              disabled={
                                actionLoading[user.id] !== undefined &&
                                actionLoading[user.id] !== null
                              }
                              className="h-7 gap-1 bg-emerald-600 px-2 text-white hover:bg-emerald-700"
                            >
                              {actionLoading[user.id] === "approve" ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                              Approve
                            </Button>
                            <Button
                              size="xs"
                              variant="destructive"
                              onClick={() => handleMemberAction(user.id, "reject")}
                              disabled={
                                actionLoading[user.id] !== undefined &&
                                actionLoading[user.id] !== null
                              }
                              className="h-7 gap-1 px-2"
                            >
                              {actionLoading[user.id] === "reject" ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <X className="h-3 w-3" />
                              )}
                              Reject
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Overdue Books Table */}
        <Card className="flex flex-col">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Recent Overdue Books</CardTitle>
                <CardDescription>Outstanding circulation items</CardDescription>
              </div>
              <Link
                to="/librarian/overdue"
                className="text-primary flex items-center gap-1 text-xs font-semibold hover:underline"
              >
                View Overdue List <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            {stats.recent_overdue_books.length === 0 ? (
              <div className="text-muted-foreground flex h-[250px] flex-col items-center justify-center p-8 text-center">
                <Clock className="text-muted-foreground/50 mb-2 h-10 w-10" />
                <p className="text-foreground font-medium">No overdue items</p>
                <p className="text-xs">Awesome! All issued copies are within their deadlines.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-muted/50 text-muted-foreground border-b font-semibold">
                      <th className="p-4">Book Title</th>
                      <th className="p-4">Borrower</th>
                      <th className="p-4">Due Date</th>
                      <th className="p-4 text-right">Delay</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {stats.recent_overdue_books.map((item) => (
                      <tr key={item.transaction_id} className="hover:bg-muted/20 transition-colors">
                        <td className="text-foreground p-4 font-medium">{item.title}</td>
                        <td className="text-muted-foreground p-4">{item.borrower_name}</td>
                        <td className="text-muted-foreground p-4 text-xs">{item.due_date}</td>
                        <td className="p-4 text-right">
                          <span className="bg-destructive/10 text-destructive rounded-full px-2 py-0.5 text-xs font-bold">
                            {item.days_overdue} days
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Subcomponents / Helpers
function CheckCircleIcon({ className, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
}

function getAlertIcon(type) {
  switch (type) {
    case "OVERDUE_REMINDER":
      return <Clock className="text-destructive h-4 w-4" />;
    case "REGISTRATION_APPROVED":
      return <UserCheck className="h-4 w-4 text-amber-600" />;
    case "BILLING_RENEWAL":
      return <FileText className="text-primary h-4 w-4" />;
    default:
      return <Bell className="text-muted-foreground h-4 w-4" />;
  }
}

function getAlertIconBg(type) {
  switch (type) {
    case "OVERDUE_REMINDER":
      return "bg-destructive/10";
    case "REGISTRATION_APPROVED":
      return "bg-amber-500/10";
    case "BILLING_RENEWAL":
      return "bg-primary/10";
    default:
      return "bg-muted";
  }
}
