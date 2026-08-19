import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useMemberStore from "@/store/memberStore";
import {
  BookOpen,
  ArrowLeft,
  Book,
  User,
  Tag,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function ReadingListDetailPage() {
  const { id } = useParams();
  const { readingListDetail, loading, error, fetchReadingListDetail } = useMemberStore();

  useEffect(() => {
    fetchReadingListDetail(id);
  }, [id, fetchReadingListDetail]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground animate-pulse text-lg font-medium">
          Loading reading list...
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

  if (!readingListDetail) return null;

  const { title, description, books } = readingListDetail;

  return (
    <div className="flex flex-col gap-8 pb-8">
      {/* Back button + Header */}
      <div className="flex flex-col gap-3">
        <Button asChild variant="ghost" size="sm" className="w-fit gap-1 -ml-2">
          <Link to="/member">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary mt-1 rounded-lg p-2.5 shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="from-primary to-primary-foreground bg-linear-to-r bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              {title}
            </h1>
            {description && (
              <p className="text-muted-foreground mt-1 text-sm">{description}</p>
            )}
            <p className="text-muted-foreground mt-2 text-xs font-medium">
              {books.length} {books.length === 1 ? "book" : "books"} in this list
            </p>
          </div>
        </div>
      </div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Book className="text-muted-foreground mb-4 h-12 w-12" />
            <p className="font-semibold">No books in this list yet</p>
            <p className="text-muted-foreground mt-1 text-sm">
              The librarian hasn&apos;t added any books to this list.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link to="/member/catalog">Browse Catalog</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => (
            <Card
              key={book.id}
              className="border-border hover:shadow-md group relative flex flex-col overflow-hidden transition-all"
            >
              {/* Availability ribbon */}
              <div
                className={`absolute right-3 top-3 flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                  book.available_copies > 0
                    ? "bg-emerald-500/15 text-emerald-600"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {book.available_copies > 0 ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                {book.available_copies > 0 ? "Available" : "Checked Out"}
              </div>

              <CardHeader className="pb-3 pr-28">
                <CardTitle className="line-clamp-2 text-base font-bold leading-snug">
                  {book.title}
                </CardTitle>
                <CardDescription className="mt-1 flex items-center gap-1 text-xs">
                  <User className="h-3 w-3 shrink-0" />
                  {book.author}
                </CardDescription>
              </CardHeader>

              <CardContent className="mt-auto flex items-center justify-between pt-0">
                <span className="bg-secondary text-secondary-foreground flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium">
                  <Tag className="h-3 w-3" />
                  {book.category}
                </span>
                {book.available_copies > 0 && (
                  <span className="text-muted-foreground text-xs">
                    {book.available_copies} cop{book.available_copies === 1 ? "y" : "ies"} available
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Footer CTA */}
      <div className="border-border flex items-center justify-between rounded-xl border bg-muted/30 px-5 py-4">
        <div>
          <p className="text-sm font-semibold">Looking for more books?</p>
          <p className="text-muted-foreground text-xs">Browse the full catalog to discover all available titles.</p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/member/catalog">Browse Catalog</Link>
        </Button>
      </div>
    </div>
  );
}
