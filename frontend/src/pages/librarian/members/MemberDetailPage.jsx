import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import useMemberStore from "@/store/memberStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

const MEMBERSHIP_LABELS = {
  ON_CAMPUS: "On Campus",
  OFF_CAMPUS: "Off Campus",
};

function StatusBadge({ status, isActive }) {
  if (status === "APPROVED") {
    return (
      <Badge
        variant="outline"
        className={
          isActive
            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
            : "border-amber-500 bg-amber-500/10 text-amber-600"
        }
      >
        {isActive ? "Active" : "Inactive"}
      </Badge>
    );
  }
  if (status === "PENDING") {
    return (
      <Badge variant="outline" className="border-blue-500 bg-blue-500/10 text-blue-600">
        Pending
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-destructive bg-destructive/10 text-destructive">
      Rejected
    </Badge>
  );
}

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          // eslint-disable-next-line @eslint-react/no-array-index-key
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-64 rounded-xl" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}

export default function MemberDetailPage() {
  const { id } = useParams();
  const {
    memberDetail: member,
    memberCurrentIssues: currentIssues,
    memberHistory: history,
    memberDetailLoading: loading,
    memberDetailError: error,
    fetchMemberDetail,
    clearMemberDetail,
  } = useMemberStore();

  useEffect(() => {
    fetchMemberDetail(id);
    return () => clearMemberDetail();
  }, [id, fetchMemberDetail, clearMemberDetail]);

  if (loading) return <DetailSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <AlertTriangle className="text-destructive h-10 w-10" />
        <div>
          <p className="text-foreground font-semibold">Failed to load member</p>
          <p className="text-muted-foreground mt-1 text-sm">{error}</p>
        </div>
        <Button variant="outline" onClick={() => fetchMemberDetail(id)} className="gap-2">
          <RotateCcw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  if (!member) return null;

  const activeCount = currentIssues.length;
  const overdueCount = currentIssues.filter((t) => t.is_overdue).length;
  const totalBorrowed = history.length + currentIssues.length;

  return (
    <div className="animate-fade-in flex flex-col gap-6 pb-12 duration-300">
      {/* Back + header */}
      <div className="flex flex-col gap-1">
        <Link
          to="/librarian/members"
          className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Members
        </Link>
        <h1 className="from-primary mt-1 bg-linear-to-r to-violet-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          {member.name}
        </h1>
        <p className="text-muted-foreground text-sm">Member ID: #{member.id}</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Currently Borrowed
            </CardTitle>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
              <BookOpen className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeCount}</div>
            <p className="text-muted-foreground mt-1 text-xs">Books in hand</p>
          </CardContent>
        </Card>

        <Card className="border-l-destructive border-l-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Overdue</CardTitle>
            <div className="bg-destructive/10 text-destructive rounded-lg p-2">
              <Clock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-destructive text-3xl font-bold">{overdueCount}</div>
            <p className="text-muted-foreground mt-1 text-xs">Past due date</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Borrowed
            </CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalBorrowed}</div>
            <p className="text-muted-foreground mt-1 text-xs">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Profile card */}
      <Card>
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <User className="text-primary h-4 w-4" />
            Member Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 pt-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start gap-3">
            <Mail className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Email
              </p>
              <p className="text-sm font-medium">{member.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Phone
              </p>
              <p className="text-sm font-medium">{member.phone ?? "—"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Member Since
              </p>
              <p className="text-sm font-medium">
                {formatDate(member.created_at)}
              </p>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
              Membership Type
            </p>
            <Badge variant="outline" className="text-xs">
              {MEMBERSHIP_LABELS[member.membership_type] ?? member.membership_type}
            </Badge>
          </div>

          <div>
            <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
              Account Status
            </p>
            <StatusBadge status={member.approval_status} isActive={member.is_active} />
          </div>

          <div>
            <p className="text-muted-foreground mb-1 text-xs font-medium uppercase tracking-wide">
              Borrow Limit
            </p>
            <p className="text-sm font-medium">
              {activeCount} / {member.max_issue_limit} books
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current issues */}
      <Card>
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <BookOpen className="text-primary h-4 w-4" />
            Currently Borrowed
          </CardTitle>
          <CardDescription>
            Books this member currently has checked out
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {currentIssues.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-10 text-center">
              <BookOpen className="text-muted-foreground/40 h-8 w-8" />
              <p className="text-sm">No books currently borrowed.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentIssues.map((t) => (
                  <TableRow
                    key={t.transaction_id}
                    className={t.is_overdue ? "hover:bg-destructive/5" : ""}
                  >
                    <TableCell className="font-medium">{t.book_title}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(t.issue_date)}</TableCell>
                    <TableCell
                      className={`text-sm font-medium ${t.is_overdue ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {formatDate(t.due_date)}
                    </TableCell>
                    <TableCell className="text-center">
                      {t.is_overdue ? (
                        <Badge
                          variant="outline"
                          className="border-destructive bg-destructive/10 text-destructive text-xs"
                        >
                          <Clock className="mr-1 h-3 w-3" />
                          Overdue
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-emerald-500 bg-emerald-500/10 text-xs text-emerald-600"
                        >
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          On Time
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Borrowing history */}
      <Card>
        <CardHeader className="border-b pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <Clock className="text-primary h-4 w-4" />
            Borrowing History
          </CardTitle>
          <CardDescription>All past completed transactions for this member</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {history.length === 0 ? (
            <div className="text-muted-foreground flex flex-col items-center justify-center gap-2 py-10 text-center">
              <Loader2 className="text-muted-foreground/40 h-8 w-8" />
              <p className="text-sm">No borrowing history yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Returned</TableHead>
                  <TableHead className="text-center">Was Overdue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((t) => (
                  <TableRow key={t.transaction_id}>
                    <TableCell className="font-medium">{t.book_title}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(t.issue_date)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{formatDate(t.due_date)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {t.return_date ? formatDate(t.return_date) : "—"}
                    </TableCell>
                    <TableCell className="text-center">
                      {t.is_overdue ? (
                        <Badge
                          variant="outline"
                          className="border-destructive bg-destructive/10 text-destructive text-xs"
                        >
                          Late
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="border-emerald-500 bg-emerald-500/10 text-xs text-emerald-600"
                        >
                          On Time
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
