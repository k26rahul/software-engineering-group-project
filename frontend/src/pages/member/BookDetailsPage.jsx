import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, Star, Copy, Info, CheckCircle, XCircle, Library } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import useCatalogStore from "@/store/catalogStore";

export default function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedBook, isLoading, error, fetchBook } = useCatalogStore();

  useEffect(() => {
    if (id) {
      fetchBook(Number(id)).catch(() => {
        // Handle error if needed (caught in store, displayed via error state)
      });
    }
  }, [id, fetchBook]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-muted-foreground animate-pulse text-lg font-medium">
          Loading book details...
        </div>
      </div>
    );
  }

  if (error || !selectedBook) {
    return (
      <div className="flex flex-col gap-4">
        <Button variant="ghost" className="w-fit gap-2" onClick={() => navigate("/member/catalog")}>
          <ArrowLeft className="h-4 w-4" /> Back to Catalog
        </Button>
        <div className="bg-destructive/10 text-destructive border-destructive/20 flex flex-col items-center justify-center rounded-xl border p-12 text-center">
          <Info className="mb-4 h-10 w-10" />
          <h3 className="text-lg font-bold">Book not found</h3>
          <p className="mt-1 max-w-sm text-sm">
            {error || "The book you are looking for does not exist or has been removed."}
          </p>
        </div>
      </div>
    );
  }

  const isAvailable = selectedBook.available_copies > 0;

  return (
    <div className="flex flex-col gap-6 pb-8">
      <Button variant="ghost" className="w-fit gap-2" onClick={() => navigate("/member/catalog")}>
        <ArrowLeft className="h-4 w-4" /> Back to Catalog
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Visuals & Quick Actions */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <Card className="border-border overflow-hidden shadow-sm">
            <div className="bg-muted flex aspect-3/4 w-full items-center justify-center">
              <BookOpen className="text-muted-foreground/30 h-32 w-32" />
            </div>
          </Card>

          <Card className="border-border shadow-sm">
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">Availability</span>
                {isAvailable ? (
                  <Badge className="gap-1 bg-green-500 hover:bg-green-600">
                    <CheckCircle className="h-3 w-3" /> {selectedBook.available_copies} Available
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="gap-1">
                    <XCircle className="h-3 w-3" /> All issued
                  </Badge>
                )}
              </div>
              <Button className="w-full" size="lg" disabled={!isAvailable}>
                {isAvailable ? "Reserve Copy" : "Join Waitlist"}
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Star className="mr-2 h-4 w-4" /> Add to Reading List
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="border-border shadow-sm">
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-3xl font-extrabold tracking-tight">
                    {selectedBook.title}
                  </CardTitle>
                  <p className="text-muted-foreground mt-2 text-lg font-medium">
                    by {selectedBook.author}
                  </p>
                </div>
                <Badge variant="secondary" className="px-3 py-1 text-sm">
                  {selectedBook.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="text-foreground font-bold">
                    {selectedBook.average_rating?.toFixed(1) || "New"}
                  </span>
                </div>
                <span className="text-muted-foreground text-sm">
                  ({selectedBook.reviews?.length || 0} reviews)
                </span>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold">About this Book</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedBook.description || "No description provided for this book."}
                </p>
              </div>

              <div className="bg-muted/50 rounded-xl p-4">
                <h4 className="mb-3 font-semibold">Book Metadata</h4>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      ISBN
                    </span>
                    <span className="font-medium">{selectedBook.isbn || "N/A"}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Price
                    </span>
                    <span className="font-medium">₹{selectedBook.price?.toFixed(2)}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Total Copies
                    </span>
                    <span className="font-medium">{selectedBook.copies?.length || 0}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Added On
                    </span>
                    <span className="font-medium">
                      {selectedBook.created_at
                        ? new Date(selectedBook.created_at).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Copies Info (Optional details if needed) */}
          <Card className="border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <Library className="text-primary h-5 w-5" />
                Physical Copies Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedBook.copies && selectedBook.copies.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {selectedBook.copies.map((copy) => (
                    <div
                      key={copy.id}
                      className="border-border flex items-center justify-between rounded-lg border p-3"
                    >
                      <div className="flex items-center gap-2">
                        <Copy className="text-muted-foreground h-4 w-4" />
                        <span className="font-medium">Copy #{copy.copy_number}</span>
                      </div>
                      <Badge
                        variant={copy.status === "AVAILABLE" ? "default" : "secondary"}
                        className={
                          copy.status === "AVAILABLE" ? "bg-green-500 hover:bg-green-600" : ""
                        }
                      >
                        {copy.status.replace("_", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No physical copies registered.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
