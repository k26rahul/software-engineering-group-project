import { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import useTransactionStore from "@/store/transactionStore";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clock,
  Search,
  AlertTriangle,
  Loader2,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  Filter,
  ArrowLeft,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

const STATUS_FILTERS = [
  { value: "all", label: "All Active" },
  { value: "overdue", label: "Overdue" },
  { value: "normal", label: "Normal" },
];

export default function OverduePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Pre-select filter from URL (?filter=overdue)
  const initialFilter = searchParams.get("filter") ?? "all";

  const [statusFilter, setStatusFilter] = useState(
    STATUS_FILTERS.some((f) => f.value === initialFilter) ? initialFilter : "all"
  );
  const [search, setSearch] = useState("");

  const { allTransactions, isLoading, error, fetchAllTransactions } = useTransactionStore();

  useEffect(() => {
    fetchAllTransactions();
  }, [fetchAllTransactions]);

  // Update URL param when filter changes
  const handleFilterChange = (value) => {
    setStatusFilter(value);
    if (value === "all") {
      searchParams.delete("filter");
    } else {
      searchParams.set("filter", value);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const filtered = useMemo(() => {
    let list = allTransactions;

    // Status filter
    if (statusFilter === "overdue") {
      list = list.filter((t) => t.is_overdue);
    } else if (statusFilter === "normal") {
      list = list.filter((t) => !t.is_overdue);
    }

    // Search filter
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (t) =>
          t.book_title?.toLowerCase().includes(q) ||
          t.member_name?.toLowerCase().includes(q) ||
          t.member_email?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allTransactions, statusFilter, search]);

  const overdueCount = useMemo(
    () => allTransactions.filter((t) => t.is_overdue).length,
    [allTransactions]
  );
  const normalCount = useMemo(
    () => allTransactions.filter((t) => !t.is_overdue).length,
    [allTransactions]
  );

  return (
    <div className="animate-fade-in flex flex-col gap-6 pb-12 duration-300">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Link
            to="/librarian"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="from-primary bg-linear-to-r to-red-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            Transactions
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            All currently borrowed books. Filter by overdue status or search by member / title.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      {!isLoading && !error && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card
            className="cursor-pointer border-l-4 border-l-blue-500 transition-all duration-200 hover:shadow-md"
            onClick={() => handleFilterChange("all")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                Total Active
              </CardTitle>
              <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
                <BookOpen className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{allTransactions.length}</div>
              <p className="text-muted-foreground mt-1 text-xs">Currently borrowed</p>
            </CardContent>
          </Card>

          <Card
            className="border-l-destructive cursor-pointer border-l-4 transition-all duration-200 hover:shadow-md"
            onClick={() => handleFilterChange("overdue")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">Overdue</CardTitle>
              <div className="bg-destructive/10 text-destructive rounded-lg p-2">
                <Clock className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-destructive text-3xl font-bold">{overdueCount}</div>
              <p className="text-muted-foreground mt-1 text-xs">Past their due date</p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer border-l-4 border-l-emerald-500 transition-all duration-200 hover:shadow-md"
            onClick={() => handleFilterChange("normal")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                On Time
              </CardTitle>
              <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">{normalCount}</div>
              <p className="text-muted-foreground mt-1 text-xs">Within deadline</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters + Table */}
      <Card>
        <CardHeader className="border-b pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Active Transactions</CardTitle>
              <CardDescription>
                {statusFilter === "all"
                  ? "All currently borrowed books"
                  : statusFilter === "overdue"
                    ? "Books past their due date"
                    : "Books within their due date"}
              </CardDescription>
            </div>

            {/* Status Filter Tabs */}
            <div className="bg-muted flex rounded-lg p-1">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  id={`filter-tab-${f.value}`}
                  onClick={() => handleFilterChange(f.value)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                    statusFilter === f.value
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.value === "overdue" && (
                    <span className="bg-destructive/15 text-destructive flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
                      {overdueCount}
                    </span>
                  )}
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-2">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              id="transaction-search"
              placeholder="Search by member name, email, or book title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
              <span className="text-muted-foreground text-sm">Loading transactions...</span>
            </div>
          ) : error ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 p-8 text-center">
              <AlertTriangle className="text-destructive h-10 w-10" />
              <div>
                <p className="text-foreground font-semibold">Failed to load transactions</p>
                <p className="text-muted-foreground mt-1 text-sm">{error}</p>
              </div>
              <Button variant="outline" onClick={fetchAllTransactions} className="gap-2">
                <RotateCcw className="h-4 w-4" /> Retry
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-muted-foreground flex min-h-[300px] flex-col items-center justify-center gap-3 p-8 text-center">
              {statusFilter === "overdue" ? (
                <>
                  <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                  <p className="text-foreground font-semibold">No overdue books!</p>
                  <p className="text-sm">All issued books are within their deadlines.</p>
                </>
              ) : (
                <>
                  <Filter className="text-muted-foreground/50 h-12 w-12" />
                  <p className="text-foreground font-semibold">No transactions found</p>
                  <p className="text-sm">
                    {search ? "Try a different search term." : "No matching transactions."}
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-muted/50 text-muted-foreground border-b font-semibold">
                    <th className="p-4">Member</th>
                    <th className="p-4">Book Title</th>
                    <th className="p-4">Issue Date</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((t) => (
                    <tr
                      key={t.transaction_id}
                      className={`transition-colors duration-150 ${
                        t.is_overdue ? "hover:bg-destructive/5" : "hover:bg-muted/20"
                      }`}
                    >
                      <td className="p-4">
                        <p className="text-foreground font-medium">{t.member_name}</p>
                        <p className="text-muted-foreground text-xs">{t.member_email}</p>
                      </td>
                      <td className="text-foreground p-4 font-medium">{t.book_title}</td>
                      <td className="text-muted-foreground p-4 text-xs">{formatDate(t.issue_date)}</td>
                      <td
                        className={`p-4 text-sm font-medium ${
                          t.is_overdue ? "text-destructive" : "text-muted-foreground"
                        }`}
                      >
                        {formatDate(t.due_date)}
                      </td>
                      <td className="p-4 text-center">
                        {t.is_overdue ? (
                          <span className="bg-destructive/10 text-destructive inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold">
                            <Clock className="h-3 w-3" />
                            {t.days_overdue > 0 ? `${t.days_overdue}d overdue` : "Overdue"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                            <CheckCircle2 className="h-3 w-3" />
                            On Time
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-muted-foreground border-t px-4 py-3 text-xs">
                Showing {filtered.length} of {allTransactions.length} active transactions
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
