import { useEffect } from "react";
import { Link, Routes, Route } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";
import useMemberStore from "@/store/memberStore";
import MemberProfilePage from "./MemberProfilePage";
import CatalogPage from "./CatalogPage";
import BookDetailsPage from "./BookDetailsPage";
import {
  BookOpen,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Library,
  Book,
} from "lucide-react";

function MemberDashboardHome() {
  const user = useAuthStore((state) => state.user);
  const {
    profile,
    issues,
    payments,
    recommendations,
    readingLists,
    loading,
    error,
    fetchDashboardData,
  } = useMemberStore();

  const memberId = user?.id || 1; // Fallback to 1 for mock member

  useEffect(() => {
    fetchDashboardData(memberId);
  }, [memberId, fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground animate-pulse text-lg font-medium">
          Loading dashboard metrics...
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

  // Calculate stats
  const activeIssuesCount = issues.length;
  const overdueIssuesCount = issues.filter((issue) => issue.is_overdue).length;
  const totalFinesPaid = payments
    .filter((p) => p.type === "FINE_PAYMENT" && p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);

  // Let's assume outstanding dues is 15.00 INR or calculate from fines if any
  const outstandingFines = overdueIssuesCount > 0 ? 50.0 : 0.0;

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Alert for deactivated status */}
      {profile && !profile.is_active && (
        <div className="bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-3 rounded-xl border p-4 text-sm font-medium">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          <div>
            Your account is currently pending approval from a librarian. Some borrowing privileges
            are restricted.
          </div>
        </div>
      )}

      {/* Header and Welcome */}
      <div className="flex flex-col gap-2">
        <h1 className="from-primary to-primary-foreground bg-linear-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          Welcome back, {profile?.name || user?.name || "Member"}
        </h1>
        <p className="text-muted-foreground text-sm">
          Here is your library status overview, active borrow details, and new suggestions.
        </p>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border relative overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Currently Issued
            </CardTitle>
            <BookOpen className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIssuesCount}</div>
            <p className="text-muted-foreground mt-1 text-xs">
              {overdueIssuesCount > 0
                ? `${overdueIssuesCount} item(s) overdue`
                : "All items in good standing"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border relative overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Active Reservations
            </CardTitle>
            <Clock className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-muted-foreground mt-1 text-xs">1 book in hold queue</p>
          </CardContent>
        </Card>

        <Card
          className={`border-border relative overflow-hidden transition-all hover:shadow-md ${outstandingFines > 0 ? "border-destructive/30 bg-destructive/5" : ""}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Outstanding Fines
            </CardTitle>
            <AlertTriangle
              className={`h-4 w-4 ${outstandingFines > 0 ? "text-destructive" : "text-primary"}`}
            />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${outstandingFines > 0 ? "text-destructive" : ""}`}>
              ₹{outstandingFines.toFixed(2)}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              {outstandingFines > 0 ? "Requires payment immediately" : "No outstanding fines"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border relative overflow-hidden transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Fines Paid
            </CardTitle>
            <CheckCircle className="text-primary h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalFinesPaid.toFixed(2)}</div>
            <p className="text-muted-foreground mt-1 text-xs">All-time payment history</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid Section */}
      <div className="grid gap-6 md:grid-cols-6">
        {/* Left Column: Borrowed Books */}
        <div className="flex flex-col gap-6 md:col-span-4">
          <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-bold">
                  <Library className="text-primary h-5 w-5" />
                  Currently Borrowed
                </CardTitle>
                <CardDescription>
                  Keep track of return deadlines to avoid late fines.
                </CardDescription>
              </div>
              <Button asChild variant="ghost" size="sm" className="gap-1">
                <Link to="/member/profile">
                  View History <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              {issues.length === 0 ? (
                <div className="border-muted flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 text-center">
                  <Book className="text-muted-foreground mb-2 h-10 w-10" />
                  <p className="font-semibold">No books checked out</p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    Explore the catalog to borrow your next read!
                  </p>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link to="/member/catalog">Browse Catalog</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {issues.map((issue) => (
                    <div
                      key={issue.transaction_id}
                      className={`flex flex-col justify-between rounded-xl border p-4 transition-all sm:flex-row sm:items-center ${
                        issue.is_overdue
                          ? "border-destructive/30 bg-destructive/5 hover:bg-destructive/10"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-1 shrink-0 rounded-lg p-2 ${issue.is_overdue ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"}`}
                        >
                          <Book className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-foreground font-semibold">{issue.book_title}</h4>
                          <p className="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3" /> Issued: {issue.issue_date}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-4 sm:mt-0 sm:justify-end">
                        <div className="text-right">
                          <p className="text-muted-foreground text-xs">Due Date</p>
                          <p
                            className={`flex items-center gap-1 text-sm font-medium ${issue.is_overdue ? "text-destructive font-bold" : "text-foreground"}`}
                          >
                            {issue.due_date}
                            {issue.is_overdue && (
                              <AlertTriangle className="h-3 w-3 animate-bounce" />
                            )}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            issue.is_overdue
                              ? "bg-destructive/15 text-destructive"
                              : "bg-primary/15 text-primary"
                          }`}
                        >
                          {issue.is_overdue ? "Overdue" : "Active"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Curated Reading Lists */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <BookOpen className="text-primary h-5 w-5" />
                Library Curated Reading Lists
              </CardTitle>
              <CardDescription>
                Discover handpicked books organized by topics of interest.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {readingLists.map((list) => (
                  <div
                    key={list.id}
                    className="border-border hover:bg-muted/50 flex flex-col justify-between rounded-xl border p-4 transition-all"
                  >
                    <div>
                      <h4 className="text-foreground font-semibold">{list.title}</h4>
                      <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                        {list.description}
                      </p>
                    </div>
                    <div className="border-border mt-4 flex items-center justify-between border-t pt-3">
                      <span className="text-muted-foreground text-xs font-medium">
                        {list.books.length} Books
                      </span>
                      <Button asChild variant="link" size="sm" className="h-auto p-0">
                        <Link to="/member/catalog" className="text-primary text-xs font-semibold">
                          Explore
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recommendations */}
        <div className="flex flex-col gap-6 md:col-span-2">
          <Card className="border-border h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Library className="text-primary h-5 w-5" />
                Recommended For You
              </CardTitle>
              <CardDescription>Based on your reading preferences.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              {recommendations.length === 0 ? (
                <p className="text-muted-foreground py-6 text-center text-sm">
                  No recommendations available yet.
                </p>
              ) : (
                recommendations.map((book) => (
                  <div
                    key={book.id}
                    className="border-border hover:bg-muted/50 flex flex-col gap-2 rounded-xl border p-4 transition-all"
                  >
                    <div>
                      <h4 className="text-foreground line-clamp-1 font-semibold">{book.title}</h4>
                      <p className="text-muted-foreground mt-0.5 text-xs">by {book.author}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="bg-secondary text-secondary-foreground rounded px-2 py-0.5 text-xs font-medium">
                        {book.category}
                      </span>
                      <span className="text-primary text-xs font-semibold">
                        {book.availability > 0 ? "Available" : "Checked Out"}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function MemberDashboard() {
  return (
    <Routes>
      <Route path="" element={<MemberDashboardHome />} />
      <Route path="profile" element={<MemberProfilePage />} />
      <Route path="catalog" element={<CatalogPage />} />
      <Route path="catalog/:id" element={<BookDetailsPage />} />
    </Routes>
  );
}
