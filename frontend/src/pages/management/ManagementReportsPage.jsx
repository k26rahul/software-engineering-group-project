import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Download,
  TrendingUp,
  DollarSign,
  PieChart as PieIcon,
  BookOpen,
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  BarChart3,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { exportToCSV } from "@/lib/utils";
import useReportsStore from "@/store/reportsStore";

const PIE_COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#f43f5e"];

export default function ManagementReportsPage() {
  const {
    usageReport,
    expenseReport,
    isLoading,
    error,
    fetchReportsData,
    downloadReport,
    downloadingType,
  } = useReportsStore();

  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "usage"; // "usage" | "financial" | "executive"
  const [period, setPeriod] = useState("current_month");

  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  // Handle report downloads with toast feedback
  const handleDownload = async (type) => {
    if (type === "pdf" || type === "monthly_audit" || type === "category_analytics") {
      window.open(`/management/print-report/${type}`, "_blank");
      return;
    }

    if (type === "expense_statement" || type === "csv") {
      const headers = ["Date", "Description", "Category", "Amount", "Status"];
      const rows = (expenseReport?.expense_items || []).map(item => [
        item.date,
        item.description,
        item.category,
        `₹${item.amount.toFixed(2)}`,
        item.status
      ]);
      exportToCSV("expense_statement.csv", headers, rows);
      toast.success("Exported EXPENSE STATEMENT CSV successfully");
      return;
    }

    if (type === "top_borrowed_books_csv") {
      const headers = ["Rank", "Book Title", "Author", "Category", "Total Checkouts", "Available Copies"];
      const rows = (usageReport?.top_borrowed_books || []).map((book, idx) => [
        `#${idx + 1}`,
        book.title,
        book.author,
        book.category,
        book.checkouts,
        book.available
      ]);
      exportToCSV("top_borrowed_books.csv", headers, rows);
      toast.success("Exported TOP BORROWED BOOKS CSV successfully");
      return;
    }

    try {
      const res = await downloadReport(type);
      toast.success(res.message || `Exported ${type.toUpperCase()} report successfully`);
    } catch (err) {
      toast.error(err.message || "Failed to download report");
    }
  };

  // Processed calculation helpers
  const usageSummary = usageReport?.summary;
  const expenseSummary = expenseReport?.summary;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Top Header & Breadcrumb Navigation */}
      <div className="flex flex-col gap-4">
        <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold">
          <Link
            to="/management"
            className="hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Overview
          </Link>
          <span>/</span>
          <span className="text-foreground">Reports & Analytics Center</span>
        </div>

        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
              Reports & Analytics Center
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Comprehensive operational audit metrics, circulation velocity, and budget allocation
              reports.
            </p>
          </div>

          {/* Time Filter & Export Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-[180px]">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <Calendar className="text-muted-foreground mr-2 h-4 w-4" />
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current_month">Jul 2026 (Current)</SelectItem>
                  <SelectItem value="q2_2026">Q2 2026 Audit</SelectItem>
                  <SelectItem value="last_6_months">Last 6 Months</SelectItem>
                  <SelectItem value="ytd">Year to Date (2026)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={downloadingType === "csv"}
              onClick={() => handleDownload("csv")}
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Export CSV
            </Button>

            <Button
              size="sm"
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
              disabled={downloadingType === "pdf"}
              onClick={() => handleDownload("pdf")}
            >
              <Download className="h-4 w-4" /> Download PDF Report
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-b pb-1">
        <Button
          variant={activeTab === "usage" ? "default" : "ghost"}
          className={`gap-2 text-sm font-semibold transition-all ${
            activeTab === "usage"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("usage")}
        >
          <TrendingUp className="h-4 w-4" /> Circulation & Member Usage
        </Button>

        <Button
          variant={activeTab === "financial" ? "default" : "ghost"}
          className={`gap-2 text-sm font-semibold transition-all ${
            activeTab === "financial"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("financial")}
        >
          <DollarSign className="h-4 w-4" /> Financial & Budget Audit
        </Button>

        <Button
          variant={activeTab === "executive" ? "default" : "ghost"}
          className={`gap-2 text-sm font-semibold transition-all ${
            activeTab === "executive"
              ? "bg-primary text-primary-foreground shadow-xs"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("executive")}
        >
          <Sparkles className="h-4 w-4" /> Executive Insights & Summary
        </Button>
      </div>

      {/* Loading Skeleton View */}
      {isLoading && (!usageReport || !expenseReport) ? (
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              // eslint-disable-next-line @eslint-react/no-array-index-key
              <Card key={i}>
                <CardHeader className="p-4">
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
          <Card>
            <CardContent className="p-8">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      ) : error ? (
        <Card className="border-destructive/20 bg-destructive/5 text-destructive p-8 text-center">
          <AlertCircle className="mx-auto mb-2 h-10 w-10" />
          <h3 className="text-lg font-bold">Failed to load reports</h3>
          <p className="mt-1 text-sm">{error}</p>
          <Button variant="outline" onClick={fetchReportsData} className="mt-4">
            Retry Loading
          </Button>
        </Card>
      ) : (
        <>
          {/* TAB 1: CIRCULATION & USAGE REPORT */}
          {activeTab === "usage" && (
            <div className="flex flex-col gap-6">
              {/* Usage Summary KPI Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-muted-foreground text-xs font-semibold uppercase">
                      Total Checkouts
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{usageSummary?.total_checkouts}</div>
                    <Badge
                      variant="secondary"
                      className="mt-1 bg-blue-500/10 text-[10px] text-blue-600"
                    >
                      +14% vs last period
                    </Badge>
                  </CardContent>
                </Card>

                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-muted-foreground text-xs font-semibold uppercase">
                      Active Borrowers
                    </CardTitle>
                    <Users className="h-4 w-4 text-emerald-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{usageSummary?.active_borrowers}</div>
                    <p className="text-muted-foreground mt-1 text-xs">82% engagement rate</p>
                  </CardContent>
                </Card>

                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-muted-foreground text-xs font-semibold uppercase">
                      Top Genre
                    </CardTitle>
                    <PieIcon className="h-4 w-4 text-indigo-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{usageSummary?.popular_category}</div>
                    <p className="text-muted-foreground mt-1 text-xs">36.6% of overall checkouts</p>
                  </CardContent>
                </Card>

                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-muted-foreground text-xs font-semibold uppercase">
                      Return On-Time Rate
                    </CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">
                      {usageSummary?.return_rate_percentage}%
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      Avg hold: {usageSummary?.avg_borrow_duration_days} days
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Issues vs Returns Chart & Category Distribution */}
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                      <BarChart3 className="h-5 w-5 text-blue-600" /> Monthly Circulation Velocity
                    </CardTitle>
                    <CardDescription>
                      Comparison of book issues vs returned inventory
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={usageReport?.monthly_trends}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="month" className="text-xs" />
                          <YAxis className="text-xs" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--card)",
                              borderColor: "var(--border)",
                              color: "var(--foreground)",
                            }}
                          />
                          <Legend verticalAlign="top" height={36} />
                          <Bar
                            dataKey="checkouts"
                            name="Books Issued"
                            fill="#3b82f6"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="returns"
                            name="Books Returned"
                            fill="#10b981"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Genre Split Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                      <PieIcon className="h-5 w-5 text-indigo-600" /> Subject Breakdown
                    </CardTitle>
                    <CardDescription>Checkout volume share by category</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={usageReport?.category_breakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            dataKey="checkouts"
                          >
                            {usageReport?.category_breakdown.map((entry, index) => (
                              <Cell
                                key={`cell-${entry.category}`}
                                fill={PIE_COLORS[index % PIE_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--card)",
                              borderColor: "var(--border)",
                              color: "var(--foreground)",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-2 grid w-full grid-cols-2 gap-2 text-xs">
                      {usageReport?.category_breakdown.map((c, i) => (
                        <div key={c.category} className="flex items-center gap-2">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                          ></span>
                          <span className="truncate font-medium">
                            {c.category} ({c.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Top Borrowed Books Table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">Most borrowed books</CardTitle>
                    <CardDescription>Popular books with high circulation velocity</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                    onClick={() => handleDownload("top_borrowed_books_csv")}
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" /> CSV
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Rank</TableHead>
                        <TableHead>Book Title</TableHead>
                        <TableHead>Author</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Total Checkouts</TableHead>
                        <TableHead className="text-right">Available Copies</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usageReport?.top_borrowed_books.map((b, idx) => (
                        <TableRow key={b.id}>
                          <TableCell className="text-muted-foreground font-bold">
                            #{idx + 1}
                          </TableCell>
                          <TableCell className="font-semibold">{b.title}</TableCell>
                          <TableCell>{b.author}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{b.category}</Badge>
                          </TableCell>
                          <TableCell className="text-primary font-bold">{b.checkouts}</TableCell>
                          <TableCell className="text-right font-medium">
                            {b.available} available
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 2: FINANCIAL & BUDGET AUDIT REPORT */}
          {activeTab === "financial" && (
            <div className="flex flex-col gap-6">
              {/* Financial KPI Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-muted-foreground text-xs font-semibold uppercase">
                      Budget Allocated
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ₹{expenseSummary?.total_budget.toLocaleString()}
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">Monthly approved cap</p>
                  </CardContent>
                </Card>

                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-muted-foreground text-xs font-semibold uppercase">
                      Total Expenses
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-emerald-600">
                      ₹{expenseSummary?.total_spent.toLocaleString()}
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">
                      {expenseSummary?.budget_utilization_percent}% utilized
                    </p>
                  </CardContent>
                </Card>

                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-muted-foreground text-xs font-semibold uppercase">
                      Fine Income Collected
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-indigo-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-indigo-600">
                      ₹{expenseSummary?.fine_income.toLocaleString()}
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">Overdue payments log</p>
                  </CardContent>
                </Card>

                <Card className="transition-all hover:shadow-md">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-muted-foreground text-xs font-semibold uppercase">
                      Net Expenditure
                    </CardTitle>
                    <CheckCircle2 className="h-4 w-4 text-violet-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ₹{expenseSummary?.net_spend.toLocaleString()}
                    </div>
                    <p className="text-muted-foreground mt-1 text-xs">Expenses minus fines</p>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Expense & Income Trend */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    <DollarSign className="h-5 w-5 text-emerald-600" /> Budget vs Expense Breakdown
                  </CardTitle>
                  <CardDescription>
                    Monthly expense tracking against limits and fine income
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={expenseReport?.monthly_expenses}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="month" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            borderColor: "var(--border)",
                            color: "var(--foreground)",
                          }}
                        />
                        <Legend verticalAlign="top" height={36} />
                        <Line
                          type="monotone"
                          dataKey="spent"
                          name="Expenses (₹)"
                          stroke="#10b981"
                          strokeWidth={3}
                        />
                        <Line
                          type="monotone"
                          dataKey="income"
                          name="Fine Revenue (₹)"
                          stroke="#8b5cf6"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Expense Items Log Table */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">Recent Expense Itemization</CardTitle>
                    <CardDescription>
                      Audited book purchases, subscriptions, and maintenance
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                    onClick={() => handleDownload("expense_statement")}
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" /> CSV
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenseReport?.expense_items.map((e) => (
                        <TableRow key={e.id}>
                          <TableCell className="font-mono text-xs">{e.date}</TableCell>
                          <TableCell className="font-semibold">{e.description}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{e.category}</Badge>
                          </TableCell>
                          <TableCell className="font-bold text-emerald-600">
                            ₹{e.amount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge
                              variant={e.status === "PAID" ? "secondary" : "default"}
                              className={
                                e.status === "PAID" ? "bg-emerald-500/10 text-emerald-600" : ""
                              }
                            >
                              {e.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 3: EXECUTIVE SUMMARY & INSIGHTS */}
          {activeTab === "executive" && (
            <div className="flex flex-col gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-primary/20 from-primary/5 bg-linear-to-br via-transparent to-transparent">
                  <CardHeader>
                    <div className="text-primary flex items-center gap-2 text-lg font-bold">
                      <Sparkles className="h-5 w-5" /> Executive Highlights
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4 text-sm leading-relaxed">
                    <div className="border-border bg-background/60 rounded-lg border p-4">
                      <h4 className="text-foreground font-bold">
                        High Book Utilization in Tech & Science
                      </h4>
                      <p className="text-muted-foreground mt-1 text-xs">
                        Technology and Science genres represent 60.5% of overall checkout volume.
                        Recommend allocating +15% budget to new technology editions for next
                        quarter.
                      </p>
                    </div>

                    <div className="border-border bg-background/60 rounded-lg border p-4">
                      <h4 className="text-foreground font-bold">
                        Strong On-Time Return Compliance
                      </h4>
                      <p className="text-muted-foreground mt-1 text-xs">
                        94.2% of borrowed items are returned within standard limits, maintaining
                        high physical availability and minimal overdue penalties.
                      </p>
                    </div>

                    <div className="border-border bg-background/60 rounded-lg border p-4">
                      <h4 className="text-foreground font-bold">Budget Under Utilization Margin</h4>
                      <p className="text-muted-foreground mt-1 text-xs">
                        Current expense utilization stands at 32.5% of total annual budget limit,
                        leaving ample headroom for planned digital journal subscriptions in Q3.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Available Downloadable Audit Packages */}
                <Card className="flex flex-col justify-between">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl font-bold">
                      <FileText className="h-5 w-5 text-indigo-600" /> Exportable Audit Packages
                    </CardTitle>
                    <CardDescription>
                      Official formatted reports ready for committee distribution
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4">
                    <div className="border-border hover:bg-muted/50 flex items-center justify-between rounded-xl border p-4 transition-all">
                      <div>
                        <h4 className="font-semibold">Full Monthly Operations Audit</h4>
                        <p className="text-muted-foreground text-xs">
                          Complete breakdown of circulation, inventory, and fines.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload("monthly_audit")}
                      >
                        <Download className="mr-1.5 h-3.5 w-3.5" /> PDF
                      </Button>
                    </div>

                    <div className="border-border hover:bg-muted/50 flex items-center justify-between rounded-xl border p-4 transition-all">
                      <div>
                        <h4 className="font-semibold">Financial & Expense Statement</h4>
                        <p className="text-muted-foreground text-xs">
                          Itemized ledger of all library purchases and subscription costs.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload("expense_statement")}
                      >
                        <Download className="mr-1.5 h-3.5 w-3.5" /> CSV
                      </Button>
                    </div>

                    <div className="border-border hover:bg-muted/50 flex items-center justify-between rounded-xl border p-4 transition-all">
                      <div>
                        <h4 className="font-semibold">Category Utilization Analytics</h4>
                        <p className="text-muted-foreground text-xs">
                          Book demand split and waitlist statistics by department.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload("category_analytics")}
                      >
                        <Download className="mr-1.5 h-3.5 w-3.5" /> PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
