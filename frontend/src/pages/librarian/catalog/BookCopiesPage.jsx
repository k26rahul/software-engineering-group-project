import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { toast } from "sonner";
import useBookStore from "@/store/bookStore";

const statusColors = {
  AVAILABLE: "secondary",
  ISSUED: "default",
  DAMAGED: "outline",
  LOST: "destructive",
};

export default function BookCopiesPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchBook, updateCopyStatus, addCopy, selectedBook, isLoading } = useBookStore();
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const loadBook = async () => {
      try {
        await fetchBook(Number(id));
      } catch {
        toast.error("Failed to load book copies");
        navigate("/librarian/catalog");
      } finally {
        setIsFetching(false);
      }
    };

    loadBook();
  }, [id, fetchBook, navigate]);

  const handleStatusChange = async (copyId, newStatus) => {
    try {
      await updateCopyStatus(Number(id), copyId, newStatus);
      toast.success("Copy status updated");
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleAddCopy = async () => {
    try {
      await addCopy(Number(id));
      toast.success("New copy added successfully");
    } catch (err) {
      toast.error(err.message || "Failed to add copy");
    }
  };

  if (isFetching || !selectedBook) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/librarian/catalog">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold tracking-tight">Manage Copies</h1>
          <p className="text-muted-foreground">
            {selectedBook.title} by {selectedBook.author}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">Total Copies</span>
              <span className="font-bold">{selectedBook.copies?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">Available</span>
              <Badge variant={selectedBook.available_copies > 0 ? "secondary" : "destructive"}>
                {selectedBook.available_copies}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">ISBN</span>
              <span className="text-sm">{selectedBook.isbn || "N/A"}</span>
            </div>
            <Button onClick={handleAddCopy} disabled={isLoading} className="mt-4 w-full">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Add New Copy
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Physical Inventory</CardTitle>
            <CardDescription>Track the status of each physical copy of this book.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Copy #</TableHead>
                    <TableHead>System ID</TableHead>
                    <TableHead>Current Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!selectedBook.copies || selectedBook.copies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-muted-foreground h-24 text-center">
                        No copies found. Add one to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    selectedBook.copies.map((copy) => (
                      <TableRow key={copy.id}>
                        <TableCell className="font-medium">{copy.copy_number}</TableCell>
                        <TableCell className="text-muted-foreground text-sm">#{copy.id}</TableCell>
                        <TableCell>
                          <Badge variant={statusColors[copy.status] || "default"}>
                            {copy.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={copy.status}
                            onValueChange={(val) => handleStatusChange(copy.id, val)}
                            disabled={isLoading}
                          >
                            <SelectTrigger className="ml-auto h-8 w-[140px]">
                              <SelectValue placeholder="Update status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="AVAILABLE">Available</SelectItem>
                              <SelectItem value="ISSUED">Issued</SelectItem>
                              <SelectItem value="DAMAGED">Damaged</SelectItem>
                              <SelectItem value="LOST">Lost</SelectItem>
                            </SelectContent>
                          </Select>
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
    </div>
  );
}
