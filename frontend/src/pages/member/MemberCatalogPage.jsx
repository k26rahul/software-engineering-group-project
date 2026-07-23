import { useEffect, useState, useMemo } from "react";
import {
  Search,
  BookOpen,
  LayoutGrid,
  List,
  Star,
  Clock,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Info,
  SlidersHorizontal,
  ArrowUpDown,
  BookCopy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import useCatalogStore from "@/store/catalogStore";
import { categories } from "@/mocks/data/books";

// Category badge color theme mapping
const CATEGORY_STYLES = {
  Technology: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  Science: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  History: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  Fiction: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  Biography: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800",
};

export default function MemberCatalogPage() {
  const { books, fetchBooks, reserveBook, isLoading } = useCatalogStore();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [availability, setAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("title");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const [selectedBook, setSelectedBook] = useState(null);
  const [reservingBookId, setReservingBookId] = useState(null);

  // Fetch books when search or category changes
  useEffect(() => {
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (category !== "all") params.category = category;

    const timer = setTimeout(() => {
      fetchBooks(params);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, category, fetchBooks]);

  // Process books with availability filtering and sorting locally
  const processedBooks = useMemo(() => {
    let result = [...books];

    if (availability === "available") {
      result = result.filter((b) => b.available_copies > 0);
    } else if (availability === "unavailable") {
      result = result.filter((b) => b.available_copies === 0);
    }

    result.sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "author") return a.author.localeCompare(b.author);
      if (sortBy === "rating") return (b.average_rating || 0) - (a.average_rating || 0);
      if (sortBy === "availability") return b.available_copies - a.available_copies;
      return 0;
    });

    return result;
  }, [books, availability, sortBy]);

  // Handle reserve waitlist action for out of stock books
  const handleReserve = async (book) => {
    setReservingBookId(book.id);
    try {
      await reserveBook(book.id);
      toast.success(`Reservation placed for "${book.title}". You will be notified when available.`);
    } catch (err) {
      toast.error(err.message || "Failed to place reservation");
    } finally {
      setReservingBookId(null);
    }
  };

  const totalBooksCount = books.length;
  const availableBooksCount = books.filter((b) => b.available_copies > 0).length;

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header section with Stats Overview */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="from-primary to-primary/60 bg-linear-to-r bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl">
            Library Book Catalog
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Browse our collection, check real-time availability, and reserve books for borrowing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1.5 px-3 py-1 text-xs">
            <BookOpen className="text-primary h-3.5 w-3.5" />
            <span className="font-semibold">{totalBooksCount}</span> Total Books
          </Badge>
          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 gap-1.5 px-3 py-1 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="font-semibold">{availableBooksCount}</span> Available Now
          </Badge>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <Card className="border-border shadow-xs">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search catalog by title, author, or ISBN..."
                  className="pl-9"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* View Switcher & Clear Filters */}
              <div className="flex items-center gap-2">
                <div className="bg-muted border-border flex items-center rounded-lg border p-1">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 px-2.5"
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid View"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 px-2.5"
                    onClick={() => setViewMode("list")}
                    aria-label="List View"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Select Dropdowns Row */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="text-muted-foreground h-4 w-4 shrink-0" />
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Availability Filter */}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-muted-foreground h-4 w-4 shrink-0" />
                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="available">Available Only</SelectItem>
                    <SelectItem value="unavailable">Out of Stock / Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="text-muted-foreground h-4 w-4 shrink-0" />
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="title">Title (A-Z)</SelectItem>
                    <SelectItem value="author">Author (A-Z)</SelectItem>
                    <SelectItem value="rating">Highest Rating</SelectItem>
                    <SelectItem value="availability">Highest Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Catalog Display Section */}
      {isLoading && books.length === 0 ? (
        // Loading State Skeletons
        viewMode === "grid" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              // eslint-disable-next-line @eslint-react/no-array-index-key
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-36 w-full" />
                <CardHeader className="p-4 pb-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="mt-2 h-4 w-1/2" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="mt-4 h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, i) => (
                    // eslint-disable-next-line @eslint-react/no-array-index-key
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="ml-auto h-8 w-20" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      ) : processedBooks.length === 0 ? (
        // Empty State
        <Card className="border-dashed p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <BookOpen className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-bold">No books found</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            Try modifying your search keywords or clearing filters to see available catalog items.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              setSearch("");
              setCategory("all");
              setAvailability("all");
            }}
          >
            Clear Filters
          </Button>
        </Card>
      ) : viewMode === "grid" ? (
        // Grid View Cards
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {processedBooks.map((book) => {
            const categoryStyle = CATEGORY_STYLES[book.category] || "bg-muted text-muted-foreground";
            const isAvailable = book.available_copies > 0;

            return (
              <Card
                key={book.id}
                className="group relative flex flex-col justify-between overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div>
                  {/* Decorative Banner Header */}
                  <div className="from-primary/10 via-primary/5 relative flex h-28 items-center justify-between border-b bg-linear-to-br to-transparent p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background/80 shadow-xs backdrop-blur-xs">
                      <BookCopy className="text-primary h-6 w-6" />
                    </div>
                    <Badge variant="outline" className={`border font-semibold ${categoryStyle}`}>
                      {book.category}
                    </Badge>
                  </div>

                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="group-hover:text-primary line-clamp-1 text-lg font-bold transition-colors">
                        {book.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="line-clamp-1 font-medium">
                      by {book.author}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4 pt-0">
                    <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
                      {book.description || "No description provided."}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 font-semibold text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                        <span>{book.average_rating ? book.average_rating.toFixed(1) : "N/A"}</span>
                      </div>

                      <Badge
                        variant={isAvailable ? "secondary" : "destructive"}
                        className={`gap-1 font-medium ${
                          isAvailable
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : ""
                        }`}
                      >
                        {isAvailable ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" /> {book.available_copies} Available
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-3 w-3" /> Out of Stock
                          </>
                        )}
                      </Badge>
                    </div>
                  </CardContent>
                </div>

                {/* Footer Action Buttons */}
                <div className="border-border flex items-center gap-2 border-t p-4 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => setSelectedBook(book)}
                  >
                    <Info className="mr-1.5 h-3.5 w-3.5" /> Details
                  </Button>

                  {!isAvailable && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 text-xs font-semibold"
                      disabled={reservingBookId === book.id}
                      onClick={() => handleReserve(book)}
                    >
                      <Clock className="mr-1.5 h-3.5 w-3.5" /> Reserve
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        // List View Table
        <Card className="border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title & Author</TableHead>
                <TableHead className="hidden sm:table-cell">Category</TableHead>
                <TableHead className="hidden md:table-cell">Rating</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processedBooks.map((book) => {
                const categoryStyle = CATEGORY_STYLES[book.category] || "bg-muted text-muted-foreground";
                const isAvailable = book.available_copies > 0;

                return (
                  <TableRow key={book.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell>
                      <div>
                        <div className="font-semibold text-foreground">{book.title}</div>
                        <div className="text-muted-foreground text-xs">by {book.author}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className={`border ${categoryStyle}`}>
                        {book.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-1 font-semibold text-amber-500 text-xs">
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                        <span>{book.average_rating ? book.average_rating.toFixed(1) : "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={isAvailable ? "secondary" : "destructive"}
                        className={isAvailable ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : ""}
                      >
                        {isAvailable ? `${book.available_copies} Copies Available` : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedBook(book)}
                        >
                          Details
                        </Button>
                        {!isAvailable && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 text-xs font-semibold"
                            disabled={reservingBookId === book.id}
                            onClick={() => handleReserve(book)}
                          >
                            Reserve
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Book Details Modal Dialog */}
      {selectedBook && (
        <Dialog open={Boolean(selectedBook)} onOpenChange={(open) => !open && setSelectedBook(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`border font-semibold ${
                    CATEGORY_STYLES[selectedBook.category] || "bg-muted text-muted-foreground"
                  }`}
                >
                  {selectedBook.category}
                </Badge>
                {selectedBook.isbn && (
                  <span className="text-muted-foreground text-xs font-mono">ISBN: {selectedBook.isbn}</span>
                )}
              </div>
              <DialogTitle className="text-2xl font-bold">{selectedBook.title}</DialogTitle>
              <DialogDescription className="text-sm font-medium">by {selectedBook.author}</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4 py-2">
              <div className="bg-muted/40 border-border rounded-lg border p-4">
                <h4 className="text-muted-foreground mb-1 text-xs font-semibold uppercase">Description</h4>
                <p className="text-foreground text-sm leading-relaxed">
                  {selectedBook.description || "No description provided for this book catalog item."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="border-border rounded-lg border p-3">
                  <span className="text-muted-foreground text-xs">Average Rating</span>
                  <div className="mt-1 flex items-center gap-1.5 font-bold text-amber-500">
                    <Star className="h-4 w-4 fill-amber-500" />
                    <span>{selectedBook.average_rating ? selectedBook.average_rating.toFixed(1) : "N/A"} / 5.0</span>
                  </div>
                </div>

                <div className="border-border rounded-lg border p-3">
                  <span className="text-muted-foreground text-xs">Status & Stock</span>
                  <div className="mt-1 flex items-center gap-1.5 font-bold">
                    {selectedBook.available_copies > 0 ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        {selectedBook.available_copies} copies ready
                      </span>
                    ) : (
                      <span className="text-rose-500">Waitlist Active</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-border flex items-center justify-between border-t pt-4">
              <span className="text-muted-foreground text-xs">
                To issue available books, present your Member ID at the library counter.
              </span>
              {selectedBook.available_copies === 0 && (
                <Button
                  className="bg-amber-500 text-white hover:bg-amber-600"
                  disabled={reservingBookId === selectedBook.id}
                  onClick={() => {
                    handleReserve(selectedBook);
                    setSelectedBook(null);
                  }}
                >
                  <Bookmark className="mr-1.5 h-4 w-4" /> Place Waitlist Hold
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
