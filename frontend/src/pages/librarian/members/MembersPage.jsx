import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Users, Check, X, Loader2, RotateCcw, AlertTriangle } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import useMemberStore from "@/store/memberStore";
import { formatDate } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "APPROVED", label: "Approved" },
  { value: "PENDING", label: "Pending" },
  { value: "REJECTED", label: "Rejected" },
];

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

export default function MembersPage() {
  const {
    members,
    membersLoading,
    membersError,
    memberActionLoading,
    fetchMembers,
    approveMember,
    rejectMember,
  } = useMemberStore();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = useCallback(() => {
    const params = { role: "MEMBER" };
    if (search) params.search = search;
    if (statusFilter !== "all") params.approval_status = statusFilter;
    fetchMembers(params);
  }, [search, statusFilter, fetchMembers]);

  // Debounced fetch on search/filter change
  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
  }, [load]);

  const handleApprove = async (member) => {
    try {
      await approveMember(member.id);
      toast.success(`${member.name} has been approved.`);
    } catch (err) {
      toast.error(err.message || "Failed to approve member.");
    }
  };

  const handleReject = async (member) => {
    try {
      await rejectMember(member.id);
      toast.warning(`${member.name}'s registration has been rejected.`);
    } catch (err) {
      toast.error(err.message || "Failed to reject member.");
    }
  };

  const totalMembers = members.length;
  const activeCount = members.filter((m) => m.is_active).length;
  const pendingCount = members.filter((m) => m.approval_status === "PENDING").length;

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Member Directory</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage library members, review registrations, and control account access.
          </p>
        </div>
      </div>

      {/* Summary stat chips */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Active Members
            </CardTitle>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeCount}</div>
            <p className="text-muted-foreground mt-1 text-xs">Currently active accounts</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Pending Review
            </CardTitle>
            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-600">
              <Loader2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingCount}</div>
            <p className="text-muted-foreground mt-1 text-xs">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="border-l-primary border-l-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">Total Shown</CardTitle>
            <div className="text-primary bg-primary/10 rounded-lg p-2">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalMembers}</div>
            <p className="text-muted-foreground mt-1 text-xs">Matching current filters</p>
          </CardContent>
        </Card>
      </div>

      {/* Main table card */}
      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
          <CardDescription>
            Search, filter, and manage all registered library members.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters row */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative max-w-sm flex-1">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
              <Input
                id="members-search"
                type="search"
                placeholder="Search by name or email..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-[200px]">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="members-status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error state */}
          {membersError && (
            <div className="bg-destructive/10 text-destructive border-destructive/20 mb-4 flex items-center gap-3 rounded-lg border p-4 text-sm">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{membersError}</span>
              <Button variant="outline" size="sm" onClick={load} className="ml-auto gap-1.5">
                <RotateCcw className="h-3.5 w-3.5" />
                Retry
              </Button>
            </div>
          )}

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Membership</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {membersLoading && members.length === 0 ? (
                  // Skeleton rows while loading
                  Array.from({ length: 5 }).map((_, i) => (
                    // eslint-disable-next-line @eslint-react/no-array-index-key
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-[140px]" />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Skeleton className="h-4 w-[200px]" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-4 w-[100px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-5 w-[70px] rounded-full" />
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Skeleton className="h-4 w-[90px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="ml-auto h-7 w-[80px] rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : members.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-muted-foreground h-28 text-center">
                      No members match your current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((member) => {
                    const isActioning =
                      memberActionLoading[member.id] !== undefined &&
                      memberActionLoading[member.id] !== null;
                    const isPending = member.approval_status === "PENDING";

                    return (
                      <TableRow
                        key={member.id}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => navigate(`/librarian/members/${member.id}`)}
                      >
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell className="text-muted-foreground hidden sm:table-cell">
                          {member.email}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {MEMBERSHIP_LABELS[member.membership_type] ?? member.membership_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <StatusBadge
                            status={member.approval_status}
                            isActive={member.is_active}
                          />
                        </TableCell>
                        <TableCell className="text-muted-foreground hidden text-sm lg:table-cell">
                          {formatDate(member.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          {isPending ? (
                            <div
                              className="inline-flex gap-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                id={`approve-member-${member.id}`}
                                size="sm"
                                disabled={isActioning}
                                onClick={() => handleApprove(member)}
                                className="h-7 gap-1 bg-emerald-600 px-2.5 text-white hover:bg-emerald-700"
                              >
                                {memberActionLoading[member.id] === "approve" ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                                {memberActionLoading[member.id] === "approve" ? "Approving..." : "Approve"}
                              </Button>
                              <Button
                                id={`reject-member-${member.id}`}
                                size="sm"
                                variant="destructive"
                                disabled={isActioning}
                                onClick={() => handleReject(member)}
                                className="h-7 gap-1 px-2.5"
                              >
                                {memberActionLoading[member.id] === "reject" ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <X className="h-3 w-3" />
                                )}
                                {memberActionLoading[member.id] === "reject" ? "Rejecting..." : "Reject"}
                              </Button>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
