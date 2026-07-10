import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import useCatalogStore from "@/store/catalogStore";
import { categories } from "@/mocks/data/books";

export default function AddBookPage() {
  const navigate = useNavigate();
  const { addBook, lookupISBN, isLoading } = useCatalogStore();
  const [isbnLookup, setIsbnLookup] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    price: "",
    description: "",
    initial_copies: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleLookup = async () => {
    if (!isbnLookup.trim()) return;
    
    setIsLookingUp(true);
    try {
      const data = await lookupISBN(isbnLookup);
      setFormData((prev) => ({
        ...prev,
        title: data.title || prev.title,
        author: data.author || prev.author,
        category: data.category || prev.category,
        price: data.price ? String(data.price) : prev.price,
        description: data.description || prev.description,
        isbn: isbnLookup,
      }));
      toast.success("Book details found!");
    } catch (error) {
      toast.error(error.message || "ISBN not found. Please fill details manually.");
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBook({
        ...formData,
        price: parseFloat(formData.price) || 0,
        initial_copies: parseInt(formData.initial_copies, 10) || 1,
      });
      toast.success("Book added successfully!");
      navigate("/librarian/catalog");
    } catch (error) {
      toast.error(error.message || "Failed to add book");
    }
  };

  return (
    <div className="flex max-w-3xl flex-col gap-6 mx-auto w-full">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/librarian/catalog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-semibold tracking-tight">Add New Book</h1>
      </div>

      {/* ISBN Lookup Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Fast Entry: ISBN Lookup</CardTitle>
          <CardDescription>
            Enter an ISBN to auto-fill book details from the global database.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="e.g. 9781491950296"
              value={isbnLookup}
              onChange={(e) => setIsbnLookup(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLookup();
                }
              }}
            />
            <Button onClick={handleLookup} disabled={isLookingUp || !isbnLookup.trim()}>
              {isLookingUp ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
              Lookup
            </Button>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Book Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={handleCategoryChange} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="initial_copies">Initial Copies</Label>
                <Input
                  id="initial_copies"
                  name="initial_copies"
                  type="number"
                  min="1"
                  value={formData.initial_copies}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-6">
            <Button variant="ghost" type="button" onClick={() => navigate("/librarian/catalog")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Book
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
