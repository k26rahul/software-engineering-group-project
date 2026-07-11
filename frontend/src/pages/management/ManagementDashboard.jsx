import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  Library,
  DollarSign,
  TrendingUp,
  FileBarChart,
  ArrowUpRight,
  AlertTriangle,
  Loader2,
  PieChart as PieIcon,
  BarChart4,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"];

export default function ManagementDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchManagementData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/dashboard/management");
      setData(res.data);
    } catch (err) {
      console.error("Error fetching management dashboard:", err);
      setError(err.message || "Failed to load dashboard metrics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagementData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <Loader2 className="text-primary h-8 w-8 animate-spin" />
        <span className="text-muted-foreground text-sm font-medium">
          Assembling management analytics...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive border-destructive/20 flex flex-col items-center gap-4 rounded-xl border p-8 text-center">
        <AlertTriangle className="h-10 w-10" />
        <div>
          <h3 className="text-lg font-semibold">Could not load metrics</h3>
          <p className="mt-1 text-sm opacity-90">{error}</p>
        </div>
        <Button variant="outline" onClick={fetchManagementData} className="gap-2">
          Try Again
        </Button>
      </div>
    );
  }

  const budgetPercent = data
    ? Math.min(100, Math.round((data.budget_spent / data.budget_limit) * 100))
    : 0;

  return (
    <div className="animate-fade-in flex flex-col gap-8 pb-12 duration-300">
      {/* Page Header */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
            Management Overview
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            High-level metrics, usage reports, and budget allocation insights.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" className="gap-2">
            <Link to="/management/reports">
              <FileBarChart className="h-4 w-4" /> Reports Center
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {/* Total Members */}
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Total Members
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_members}</div>
            <p className="text-muted-foreground mt-1 text-[10px]">Registrations in system</p>
          </CardContent>
        </Card>

        {/* Active Members */}
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Active Borrowers
            </CardTitle>
            <Users className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.active_members}</div>
            <p className="text-muted-foreground mt-1 text-[10px]">Approved & active profiles</p>
          </CardContent>
        </Card>

        {/* Active Issues */}
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Issued Copies
            </CardTitle>
            <BookOpen className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.active_issues}</div>
            <p className="text-muted-foreground mt-1 text-[10px]">Books currently checked out</p>
          </CardContent>
        </Card>

        {/* Total Books */}
        <Card className="transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Catalog Copies
            </CardTitle>
            <Library className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.total_books}</div>
            <p className="text-muted-foreground mt-1 text-[10px]">Total physical copies tracking</p>
          </CardContent>
        </Card>

        {/* Budget Spent */}
        <Card className="transition-all duration-200 hover:shadow-md sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Budget Utilization
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              ₹{data.budget_spent.toLocaleString()}
            </div>
            <div className="bg-muted mt-2 h-1.5 w-full rounded-full">
              <div
                className="h-1.5 rounded-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${budgetPercent}%` }}
              ></div>
            </div>
            <p className="text-muted-foreground mt-1 text-[10px]">
              {budgetPercent}% of ₹{data.budget_limit.toLocaleString()} monthly limit
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Monthly Trend Area Chart */}
        <Card className="md:col-span-2">
          <CardHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <BarChart4 className="h-5 w-5 text-blue-600" />
                  Borrowing & Expense Trends
                </CardTitle>
                <CardDescription>Performance metrics over the last 6 months</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.monthly_stats}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSpent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-muted-foreground text-xs" />
                  <YAxis
                    yAxisId="left"
                    className="text-muted-foreground text-xs"
                    label={{ value: "Issues", angle: -90, position: "insideLeft", offset: 10 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    className="text-muted-foreground text-xs"
                    label={{ value: "Spent (₹)", angle: 90, position: "insideRight", offset: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      borderColor: "var(--border)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--foreground)",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="issues"
                    name="Books Issued"
                    stroke="#3b82f6"
                    fillOpacity={1}
                    fill="url(#colorIssues)"
                    strokeWidth={2}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="spent"
                    name="Budget Spent (₹)"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorSpent)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Pie Chart */}
        <Card className="flex flex-col">
          <CardHeader className="border-b pb-4">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <PieIcon className="h-5 w-5 text-indigo-600" />
              Category Distribution
            </CardTitle>
            <CardDescription>Book copies split by subject genre</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center pt-6">
            {data.category_stats.length === 0 || data.category_stats.every((c) => c.value === 0) ? (
              <div className="text-muted-foreground flex h-64 flex-col items-center justify-center p-8 text-center">
                <Library className="text-muted-foreground/30 mb-2 h-10 w-10" />
                <p className="text-sm font-semibold">No catalog entries</p>
                <p className="text-xs">
                  Once book copies are added, distribution charts will render.
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-6">
                <div className="h-52 w-full max-w-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.category_stats}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.category_stats.map((entry, index) => (
                          <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          borderColor: "var(--border)",
                          borderRadius: "var(--radius-md)",
                          color: "var(--foreground)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Custom Legend */}
                <div className="grid w-full grid-cols-2 gap-2 text-xs">
                  {data.category_stats.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></span>
                      <span className="text-muted-foreground truncate font-medium">
                        {entry.name} ({entry.value})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reports Navigation Section */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Link to Usage Reports */}
        <Card className="hover:border-primary/40 group flex flex-col justify-between transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-blue-500/10 p-3 text-blue-600">
                <TrendingUp className="h-6 w-6" />
              </span>
              <Button asChild variant="ghost" size="icon" className="group-hover:text-primary">
                <Link to="/management/reports">
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            <CardTitle className="mt-4 text-xl font-bold">Circulation & Member Reports</CardTitle>
            <CardDescription className="mt-1">
              Analyze daily/weekly borrow metrics, active membership growth, and popular genres
              lists.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-primary mt-4 flex items-center justify-between border-t px-6 py-4 pt-0 text-xs font-semibold">
            <span>Access detailed Excel/CSV usage exports</span>
            <span className="flex items-center gap-1">
              Open Reports <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </CardContent>
        </Card>

        {/* Link to Expense Reports */}
        <Card className="hover:border-primary/40 group flex flex-col justify-between transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600">
                <DollarSign className="h-6 w-6" />
              </span>
              <Button asChild variant="ghost" size="icon" className="group-hover:text-primary">
                <Link to="/management/reports/expense">
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
            <CardTitle className="mt-4 text-xl font-bold">
              Expense & Reimbursement Tracker
            </CardTitle>
            <CardDescription className="mt-1">
              Audit book copy purchases, newspapers/magazines monthly subscription dues, and fine
              logs.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-primary mt-4 flex items-center justify-between border-t px-6 py-4 pt-0 text-xs font-semibold">
            <span>Review current year budget utilization</span>
            <span className="flex items-center gap-1">
              Open Budget <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
