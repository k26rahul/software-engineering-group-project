import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, TrendingDown, Plus, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import FormSelect from "@/components/FormSelect";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import useTransactionStore from "@/store/transactionStore";

const CATEGORIES = [
  { value: "Book Purchase", label: "Book Purchase" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Subscription", label: "Subscription" },
  { value: "Fine Collection", label: "Fine Collection" },
  { value: "Other", label: "Other" },
];

function SpendGauge({ spent, limit }) {
  const pct = Math.min(100, (spent / limit) * 100);
  const color = pct >= 90 ? "bg-destructive" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div className="space-y-1.5">
      <div className="bg-muted h-3 w-full overflow-hidden rounded-full">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">₹{spent.toLocaleString()} spent</span>
        <span className="font-medium">{pct.toFixed(1)}% used</span>
      </div>
    </div>
  );
}

export default function BudgetTrackerPage() {
  const { budget, budgetLoading, budgetError, fetchBudget, addBudgetEntry } = useTransactionStore();

  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    description: "",
    category: "Book Purchase",
    amount: "",
    type: "EXPENSE",
  });

  useEffect(() => {
    fetchBudget();
  }, [fetchBudget]);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addBudgetEntry({
        ...form,
        amount: parseFloat(form.amount),
      });
      toast.success("Budget entry added.");
      setOpen(false);
      setForm({ description: "", category: "Book Purchase", amount: "", type: "EXPENSE" });
    } catch (err) {
      toast.error(err.message || "Failed to add entry.");
    } finally {
      setSaving(false);
    }
  };

  const entries = budget?.entries ?? [];
  const sorted = [...entries].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Budget Tracker</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitor library expenditure and income against the monthly budget.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <form onSubmit={handleAdd}>
              <DialogHeader>
                <DialogTitle>New Budget Entry</DialogTitle>
                <DialogDescription>Record an expense or income item.</DialogDescription>
              </DialogHeader>
              <div className="mt-4 grid gap-4">
                <div className="grid gap-1.5">
                  <Label htmlFor="budget-type">Type</Label>
                  <FormSelect
                    triggerId="budget-type"
                    value={form.type}
                    onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}
                    options={[
                      { value: "EXPENSE", label: "Expense" },
                      { value: "INCOME", label: "Income" },
                    ]}
                    placeholder="Select type"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="budget-category">Category</Label>
                  <FormSelect
                    triggerId="budget-category"
                    value={form.category}
                    onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                    options={CATEGORIES}
                    placeholder="Select category"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="budget-description">Description</Label>
                  <Input
                    id="budget-description"
                    placeholder="e.g. 3 copies of Clean Code"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="budget-amount">Amount (₹)</Label>
                  <Input
                    id="budget-amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving} className="gap-2">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Save Entry
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error state */}
      {budgetError && (
        <div className="bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-3 rounded-lg border p-4 text-sm">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {budgetError}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Monthly Budget
            </CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {budgetLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-3xl font-bold">
                ₹{(budget?.budget_limit ?? 0).toLocaleString()}
              </div>
            )}
            <p className="text-muted-foreground mt-1 text-xs">Total allocation</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Expenses
            </CardTitle>
            <div className="rounded-lg bg-red-500/10 p-2 text-red-600">
              <TrendingDown className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {budgetLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-3xl font-bold text-red-600">
                ₹{(budget?.total_expenses ?? 0).toLocaleString()}
              </div>
            )}
            <p className="text-muted-foreground mt-1 text-xs">All recorded expenses</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Total Income
            </CardTitle>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            {budgetLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <div className="text-3xl font-bold text-blue-600">
                ₹{(budget?.total_income ?? 0).toLocaleString()}
              </div>
            )}
            <p className="text-muted-foreground mt-1 text-xs">Fines & recoveries</p>
          </CardContent>
        </Card>
      </div>

      {/* Budget gauge */}
      {!budgetLoading && budget && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Budget Utilisation</CardTitle>
            <CardDescription>
              ₹{(budget.budget_limit - budget.budget_spent).toLocaleString()} remaining
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SpendGauge spent={budget.budget_spent} limit={budget.budget_limit} />
          </CardContent>
        </Card>
      )}

      {/* Entries table */}
      <Card>
        <CardHeader>
          <CardTitle>Ledger</CardTitle>
          <CardDescription>All expense and income entries, newest first.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden sm:table-cell">Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    // eslint-disable-next-line @eslint-react/no-array-index-key
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="ml-auto h-4 w-20" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : sorted.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground h-24 text-center">
                      No entries yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  sorted.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(entry.date)}
                      </TableCell>
                      <TableCell className="text-sm">{entry.category}</TableCell>
                      <TableCell className="text-muted-foreground hidden text-sm sm:table-cell">
                        {entry.description}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            entry.type === "EXPENSE"
                              ? "border-red-400 bg-red-50 text-xs text-red-600"
                              : "border-emerald-500 bg-emerald-50 text-xs text-emerald-600"
                          }
                        >
                          {entry.type === "EXPENSE" ? "Expense" : "Income"}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={`text-right text-sm font-medium ${entry.type === "INCOME" ? "text-emerald-600" : ""}`}
                      >
                        {entry.type === "INCOME" ? "+" : ""}₹{entry.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
