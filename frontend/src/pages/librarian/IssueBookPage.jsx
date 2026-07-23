import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, BookOpen, User, Check, Loader2, AlertTriangle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import useCatalogStore from "@/store/catalogStore";
import useMemberStore from "@/store/memberStore";
import useTransactionStore from "@/store/transactionStore";

// Step indicator
function Step({ number, label, active, done }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
          done
            ? "bg-emerald-600 text-white"
            : active
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground"
        }`}
      >
        {done ? <Check className="h-3.5 w-3.5" /> : number}
      </div>
      <span
        className={`hidden text-sm font-medium sm:block ${active ? "text-foreground" : "text-muted-foreground"}`}
      >
        {label}
      </span>
    </div>
  );
}

function StepDivider() {
  return <div className="bg-border mx-2 h-px flex-1" />;
}

export default function IssueBookPage() {
  const { books, fetchBooks, isLoading: booksLoading } = useCatalogStore();
  const { members, membersLoading, fetchMembers } = useMemberStore();
  const { issueBook, isLoading: issuing } = useTransactionStore();

  const [step, setStep] = useState(1); // 1=member, 2=book, 3=confirm
  const [memberSearch, setMemberSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const issueDateStr = useMemo(() => new Date().toLocaleDateString(), []);
  const dueDateStr = useMemo(
    () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    []
  );

  // Load members (only APPROVED+active)
  const loadMembers = useCallback(() => {
    fetchMembers({ search: memberSearch, approval_status: "APPROVED" });
  }, [memberSearch, fetchMembers]);

  useEffect(() => {
    const t = setTimeout(loadMembers, 300);
    return () => clearTimeout(t);
  }, [loadMembers]);

  // Load books with available copies
  const loadBooks = useCallback(() => {
    fetchBooks({ search: bookSearch });
  }, [bookSearch, fetchBooks]);

  useEffect(() => {
    if (step >= 2) {
      const t = setTimeout(loadBooks, 300);
      return () => clearTimeout(t);
    }
  }, [step, loadBooks]);

  const availableBooks = books.filter((b) => b.available_copies > 0);

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setStep(2);
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setStep(3);
  };

  const handleIssue = async () => {
    if (!selectedMember || !selectedBook) return;
    try {
      // The store will use any available copy_id; we pass -1 to let the mock pick one.
      // In a real API the server picks the copy. Here we simulate by passing copy_id=null.
      await issueBook(selectedMember.id, selectedBook.id, null);
      toast.success(`"${selectedBook.title}" issued to ${selectedMember.name} for 14 days.`);
      // Reset
      setStep(1);
      setSelectedMember(null);
      setSelectedBook(null);
      setMemberSearch("");
      setBookSearch("");
    } catch (err) {
      toast.error(err.message || "Failed to issue book.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Issue Book</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Select an approved member and an available book to issue.
        </p>
      </div>

      {/* Step bar */}
      <div className="flex items-center">
        <Step number={1} label="Select Member" active={step === 1} done={step > 1} />
        <StepDivider />
        <Step number={2} label="Select Book" active={step === 2} done={step > 2} />
        <StepDivider />
        <Step number={3} label="Confirm" active={step === 3} done={false} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left panel: step content */}
        <div className="lg:col-span-2">
          {/* Step 1: Member */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="text-primary h-4 w-4" />
                  Choose a Member
                </CardTitle>
                <CardDescription>Only active, approved members are shown.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                  <Input
                    id="issue-member-search"
                    placeholder="Search by name or email..."
                    className="pl-8"
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                  />
                </div>
                <div className="flex flex-col divide-y rounded-md border">
                  {membersLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      // eslint-disable-next-line @eslint-react/no-array-index-key
                      <div key={i} className="flex items-center gap-3 p-4">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="flex-1 space-y-1.5">
                          <Skeleton className="h-3.5 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                    ))
                  ) : members.length === 0 ? (
                    <div className="text-muted-foreground p-8 text-center text-sm">
                      No active members found.
                    </div>
                  ) : (
                    members.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => handleSelectMember(m)}
                        className="hover:bg-muted/50 flex w-full items-center gap-3 p-4 text-left transition-colors"
                      >
                        <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold">
                          {m.name.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{m.name}</p>
                          <p className="text-muted-foreground truncate text-xs">{m.email}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {m.membership_type === "ON_CAMPUS" ? "On Campus" : "Off Campus"}
                        </Badge>
                        <ChevronRight className="text-muted-foreground h-4 w-4 shrink-0" />
                      </button>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Book */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="text-primary h-4 w-4" />
                  Choose a Book
                </CardTitle>
                <CardDescription>Only books with available copies are shown.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                  <Input
                    id="issue-book-search"
                    placeholder="Search by title or author..."
                    className="pl-8"
                    value={bookSearch}
                    onChange={(e) => setBookSearch(e.target.value)}
                  />
                </div>
                <div className="flex flex-col divide-y rounded-md border">
                  {booksLoading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      // eslint-disable-next-line @eslint-react/no-array-index-key
                      <div key={i} className="flex items-center gap-3 p-4">
                        <Skeleton className="h-10 w-8 rounded" />
                        <div className="flex-1 space-y-1.5">
                          <Skeleton className="h-3.5 w-40" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-5 w-14 rounded-full" />
                      </div>
                    ))
                  ) : availableBooks.length === 0 ? (
                    <div className="text-muted-foreground p-8 text-center text-sm">
                      No books with available copies match your search.
                    </div>
                  ) : (
                    availableBooks.map((book) => (
                      <button
                        key={book.id}
                        onClick={() => handleSelectBook(book)}
                        className="hover:bg-muted/50 flex w-full items-center gap-3 p-4 text-left transition-colors"
                      >
                        <div className="bg-muted flex h-10 w-8 shrink-0 items-center justify-center rounded border">
                          <BookOpen className="text-muted-foreground h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{book.title}</p>
                          <p className="text-muted-foreground truncate text-xs">{book.author}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className="shrink-0 border-emerald-500 bg-emerald-500/10 text-xs text-emerald-600"
                        >
                          {book.available_copies} available
                        </Badge>
                        <ChevronRight className="text-muted-foreground h-4 w-4 shrink-0" />
                      </button>
                    ))
                  )}
                </div>
                <Button variant="ghost" size="sm" className="self-start" onClick={() => setStep(1)}>
                  ← Back
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && selectedMember && selectedBook && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Check className="h-4 w-4 text-emerald-600" />
                  Confirm Issue
                </CardTitle>
                <CardDescription>Review the details before confirming.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="bg-muted/40 grid gap-4 rounded-lg border p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                      Member
                    </p>
                    <p className="font-semibold">{selectedMember.name}</p>
                    <p className="text-muted-foreground text-sm">{selectedMember.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                      Book
                    </p>
                    <p className="font-semibold">{selectedBook.title}</p>
                    <p className="text-muted-foreground text-sm">{selectedBook.author}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                      Issue Date
                    </p>
                    <p className="font-semibold">{issueDateStr}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                      Due Date
                    </p>
                    <p className="font-semibold">{dueDateStr}</p>
                    <p className="text-muted-foreground text-xs">14-day loan period</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                    onClick={handleIssue}
                    disabled={issuing}
                  >
                    {issuing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Confirm Issue
                  </Button>
                  <Button variant="ghost" onClick={() => setStep(2)}>
                    ← Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right panel: selection summary */}
        <Card className="h-fit">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Selection Summary</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                Member
              </p>
              {selectedMember ? (
                <p className="text-sm font-semibold">{selectedMember.name}</p>
              ) : (
                <p className="text-muted-foreground text-sm italic">Not selected</p>
              )}
            </div>
            <div>
              <p className="text-muted-foreground mb-1 text-xs font-medium tracking-wide uppercase">
                Book
              </p>
              {selectedBook ? (
                <p className="text-sm font-semibold">{selectedBook.title}</p>
              ) : (
                <p className="text-muted-foreground text-sm italic">Not selected</p>
              )}
            </div>
            {selectedMember && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 p-3 text-xs text-amber-700">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Verify member ID before issuing.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
