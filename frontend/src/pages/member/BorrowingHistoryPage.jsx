import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import useMemberStore from "@/store/memberStore";
import {
  History,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  BookMarked,
} from "lucide-react";
import { formatDate } from "@/lib/utils";


export default function BorrowingHistoryPage() {
  const user = useAuthStore((state) => state.user);
  const { history, loading, error, fetchProfileAndHistory } = useMemberStore();

  const memberId = user?.id || 1;

  useEffect(() => {
    fetchProfileAndHistory(memberId);
  }, [memberId, fetchProfileAndHistory]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground animate-pulse text-lg font-medium">
          Loading borrowing history...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg border p-4 text-sm font-medium">
        {error}
      </div>
    );
  }

  const returned = history.filter((h) => h.return_date !== null);
  const active = history.filter((h) => h.return_date === null);
  const overdue = active.filter((h) => h.is_overdue);

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Back + Header */}
      <div className="flex flex-col gap-3">
        <Button asChild variant="ghost" size="sm" className="w-fit gap-1 -ml-2">
          <Link to="/member">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary mt-1 rounded-lg p-2.5 shrink-0">
            <History className="h-6 w-6" />
          </div>
          <div>
            <h1 className="from-primary to-primary-foreground bg-linear-to-r bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              Borrowing History
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              A complete record of all books you&apos;ve checked out.
            </p>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="border-border rounded-xl border bg-card px-5 py-4 flex items-center gap-4">
          <div className="bg-primary/10 text-primary rounded-lg p-2.5 shrink-0">
            <BookMarked className="h-5 w-5" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">Total Borrowed</p>
            <p className="text-2xl font-bold">{history.length}</p>
          </div>
        </div>
        <div className="border-border rounded-xl border bg-card px-5 py-4 flex items-center gap-4">
          <div className="rounded-lg bg-emerald-500/10 p-2.5 shrink-0 text-emerald-600">
            <CheckCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">Returned</p>
            <p className="text-2xl font-bold">{returned.length}</p>
          </div>
        </div>
        <div
          className={`border-border rounded-xl border bg-card px-5 py-4 flex items-center gap-4 ${overdue.length > 0 ? "border-destructive/30 bg-destructive/5" : ""}`}
        >
          <div
            className={`rounded-lg p-2.5 shrink-0 ${overdue.length > 0 ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-500"}`}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium">Currently Overdue</p>
            <p className={`text-2xl font-bold ${overdue.length > 0 ? "text-destructive" : ""}`}>
              {overdue.length}
            </p>
          </div>
        </div>
      </div>

      {/* History table / empty state */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <BookOpen className="text-primary h-5 w-5" />
            All Transactions
          </CardTitle>
          <CardDescription>
            Showing {history.length} transaction{history.length !== 1 ? "s" : ""} in total.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="border-muted flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-14 text-center">
              <BookOpen className="text-muted-foreground mb-3 h-10 w-10" />
              <p className="font-semibold">No borrowing history yet</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Books you borrow will appear here once returned.
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <Link to="/member/catalog">Browse Catalog</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="border-border text-muted-foreground border-b text-xs font-semibold uppercase tracking-wide">
                    <th className="px-4 py-3">Book Title</th>
                    <th className="px-4 py-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Issued
                      </span>
                    </th>
                    <th className="px-4 py-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        Due
                      </span>
                    </th>
                    <th className="px-4 py-3">
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Returned
                      </span>
                    </th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => {
                    const isActive = !item.return_date;
                    const isOverdue = item.is_overdue;
                    return (
                      <tr
                        key={item.transaction_id}
                        className={`border-border border-b transition-all last:border-0 ${
                          isOverdue
                            ? "bg-destructive/5 hover:bg-destructive/10"
                            : "hover:bg-muted/30"
                        }`}
                      >
                        <td className="text-foreground px-4 py-3.5 font-semibold">
                          {item.book_title}
                        </td>
                        <td className="text-muted-foreground px-4 py-3.5">{formatDate(item.issue_date)}</td>
                        <td
                          className={`px-4 py-3.5 font-medium ${isOverdue ? "text-destructive" : "text-muted-foreground"}`}
                        >
                          {formatDate(item.due_date)}
                        </td>
                        <td className="text-muted-foreground px-4 py-3.5">
                          {item.return_date ? formatDate(item.return_date) : (
                            <span className="text-primary text-xs font-medium italic">
                              In Progress
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {isActive ? (
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                isOverdue
                                  ? "bg-destructive/15 text-destructive"
                                  : "bg-primary/10 text-primary"
                              }`}
                            >
                              {isOverdue ? (
                                <>
                                  <AlertTriangle className="h-3 w-3" />
                                  Overdue
                                </>
                              ) : (
                                <>
                                  <Clock className="h-3 w-3" />
                                  Active
                                </>
                              )}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                              <CheckCircle className="h-3 w-3" />
                              Returned
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
