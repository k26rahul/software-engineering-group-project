import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, BookOpen, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import useCatalogStore from "@/store/catalogStore";

export default function CatalogPage() {
  const { books, isLoading, error, fetchBooks } = useCatalogStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [availabilityFilter, setAvailabilityFilter] = useState("ALL"); // ALL, AVAILABLE
  const [sortBy, setSortBy] = useState("title"); // title, newest

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch books when search or category changes
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (selectedCategory !== "ALL") params.category = selectedCategory;

    fetchBooks(params);
  }, [debouncedSearch, selectedCategory, fetchBooks]);

  // Categories derived from books to populate the filter (ideally from a constants file)
  const categories = ["ALL", "Fiction", "Non-Fiction", "Science", "History", "Technology"];

  // Client-side filtering & sorting
  const processedBooks = useMemo(() => {
    let filtered = [...books];

    // Filter by Availability
    if (availabilityFilter === "AVAILABLE") {
      filtered = filtered.filter((book) => book.available_copies > 0);
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "newest") {
        // Assuming higher ID means newer, or use created_at if available in the mock
        return (b.id || 0) - (a.id || 0);
      }
      return 0;
    });

    return filtered;
  }, [books, availabilityFilter, sortBy]);

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="flex flex-col gap-2">
        <h1 className="from-primary to-primary-foreground bg-linear-to-r bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          Library Catalog
        </h1>
        <p className="text-muted-foreground text-sm">
          Search and discover books in our digital collection.
        </p>
      </div>

      <div className="bg-card border-border flex flex-col gap-4 rounded-xl border p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input
            placeholder="Search by title, author, or ISBN..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="text-muted-foreground h-4 w-4" />
            <select
              className="border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "ALL" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>

          <select
            className="border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <option value="ALL">All Availability</option>
            <option value="AVAILABLE">Available Now</option>
          </select>

          <select
            className="border-input bg-background text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 items-center justify-between rounded-md border px-3 py-2 text-sm focus:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="title">Sort: Title (A-Z)</option>
            <option value="newest">Sort: Newest Additions</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive border-destructive/20 flex items-center gap-2 rounded-lg border p-4 text-sm font-medium">
          <AlertCircle className="h-5 w-5" />
          Failed to load catalog: {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="bg-muted h-48 w-full rounded-t-xl" />
              <CardContent className="p-4">
                <div className="bg-muted mb-2 h-4 w-3/4 rounded" />
                <div className="bg-muted mb-4 h-3 w-1/2 rounded" />
                <div className="bg-muted h-6 w-1/3 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : processedBooks.length === 0 ? (
        <div className="border-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center shadow-sm">
          <BookOpen className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="text-lg font-bold">No books found</h3>
          <p className="text-muted-foreground mt-1 max-w-sm text-sm">
            We couldn't find any books matching your search criteria. Try adjusting your filters or
            search term.
          </p>
          {(searchTerm || selectedCategory !== "ALL" || availabilityFilter !== "ALL") && (
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("ALL");
                setAvailabilityFilter("ALL");
              }}
            >
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {processedBooks.map((book) => (
            <Link key={book.id} to={`/member/catalog/${book.id}`} className="group h-full">
              <Card className="border-border hover:border-primary/50 flex h-full flex-col overflow-hidden shadow-xs transition-all hover:shadow-md">
                <div className="bg-muted relative flex h-52 w-full shrink-0 items-center justify-center overflow-hidden border-b transition-all group-hover:opacity-90">
                  <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/5" />
                  <BookOpen className="text-muted-foreground/30 h-16 w-16 transition-transform duration-300 group-hover:scale-110" />
                  {book.available_copies > 0 ? (
                    <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="absolute top-2 right-2">
                      Checked Out
                    </Badge>
                  )}
                </div>
                <CardContent className="flex grow flex-col p-4">
                  <div className="group-hover:text-primary mb-2 line-clamp-2 min-h-[3rem] leading-tight font-bold transition-colors">
                    {book.title}
                  </div>
                  <p className="text-muted-foreground mb-4 text-sm font-medium">{book.author}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 text-xs font-semibold">
                      {book.category}
                    </span>
                    <span className="text-muted-foreground text-xs font-medium">
                      {book.available_copies} copy
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
