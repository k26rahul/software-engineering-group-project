import { useEffect, useState, useCallback } from "react";
import { Search, RotateCcw, Loader2, AlertTriangle, CheckCircle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import useTransactionStore from "@/store/transactionStore";

export default function ProcessReturnPage() {
  const { activeTransactions, isLoading, actionLoading, fetchActiveTransactions, returnBook } =
    useTransactionStore();

  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    fetchActiveTransactions({ search });
  }, [search, fetchActiveTransactions]);

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [load]);

  const handleReturn = async (transaction) => {
    try {
      const result = await returnBook(transaction.transaction_id);
      const fine = result?.fine_amount;
      if (fine > 0) {
        toast.warning(
          `"${transaction.book_title}" returned. Fine of ₹${fine.toFixed(2)} applied.`
        );
      } else {
        toast.success(`"${transaction.book_title}" returned successfully.`);
      }
    } catch (err) {
      toast.error(err.message || "Failed to process return.");
    }
  };

  const overdueCount = activeTransactions.filter((t) => t.is_overdue).length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Process Return</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Search for a member or book to process a return.
          </p>
        </div>
      </div>

      {/* Stat chips */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Currently Issued
            </CardTitle>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
              <RotateCcw className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeTransactions.length}</div>
            <p className="text-muted-foreground mt-1 text-xs">Active checkouts</p>
          </CardContent>
        </Card>

        <Card className={`border-l-4 ${overdueCount > 0 ? "border-l-destructive" : "border-l-emerald-500"}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Overdue Returns
            </CardTitle>
            <div
              className={`rounded-lg p-2 ${overdueCount > 0 ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600"}`}
            >
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${overdueCount > 0 ? "text-destructive" : ""}`}>
              {overdueCount}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              {overdueCount > 0 ? "Require immediate attention" : "All returns on time"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table card */}
      <Card>
        <CardHeader>
          <CardTitle>Active Checkouts</CardTitle>
          <CardDescription>Search by member, book title, or transaction ID.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-3">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                id="return-search"
                placeholder="Search member, book, or ID..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" onClick={load} title="Refresh">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead className="hidden sm:table-cell">Book</TableHead>
                  <TableHead className="hidden md:table-cell">Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && activeTransactions.length === 0 ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    // eslint-disable-next-line @eslint-react/no-array-index-key
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-36" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="ml-auto h-7 w-20 rounded-md" /></TableCell>
                    </TableRow>
                  ))
                ) : activeTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground h-28 text-center">
                      <CheckCircle className="mx-auto mb-2 h-6 w-6 text-emerald-500" />
                      No active checkouts found.
                    </TableCell>
                  </TableRow>
                ) : (
                  activeTransactions.map((tx) => (
                    <TableRow
                      key={tx.transaction_id}
                      className={tx.is_overdue ? "bg-destructive/5" : ""}
                    >
                      <TableCell>
                        <p className="text-sm font-medium">{tx.member_name}</p>
                        <p className="text-muted-foreground hidden text-xs sm:block">
                          {tx.member_email}
                        </p>
                      </TableCell>
                      <TableCell className="hidden text-sm sm:table-cell">{tx.book_title}</TableCell>
                      <TableCell className="text-muted-foreground hidden text-sm md:table-cell">
                        {new Date(tx.issue_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(tx.due_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {tx.is_overdue ? (
                          <Badge
                            variant="outline"
                            className="border-destructive bg-destructive/10 text-destructive text-xs"
                          >
                            {tx.days_overdue}d overdue
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-emerald-500 bg-emerald-500/10 text-xs text-emerald-600"
                          >
                            On time
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          id={`return-tx-${tx.transaction_id}`}
                          size="sm"
                          variant="outline"
                          className="h-7 gap-1.5 px-3 text-xs"
                          disabled={actionLoading[tx.transaction_id]}
                          onClick={() => handleReturn(tx)}
                        >
                          {actionLoading[tx.transaction_id] ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <RotateCcw className="h-3 w-3" />
                          )}
                          Return
                        </Button>
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
