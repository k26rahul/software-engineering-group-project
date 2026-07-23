import { Routes, Route } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import CatalogPage from "./catalog/CatalogPage";
import AddBookPage from "./catalog/AddBookPage";
import EditBookPage from "./catalog/EditBookPage";
import BookCopiesPage from "./catalog/BookCopiesPage";

function LibrarianHome() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold tracking-tight">Librarian Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, Librarian</CardTitle>
          <CardDescription>
            This is an empty placeholder for the Librarian Dashboard.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

export default function LibrarianDashboard() {
  return (
    <Routes>
      <Route path="/" element={<LibrarianHome />} />
      <Route path="catalog" element={<CatalogPage />} />
      <Route path="catalog/add" element={<AddBookPage />} />
      <Route path="catalog/:id/edit" element={<EditBookPage />} />
      <Route path="catalog/:id/copies" element={<BookCopiesPage />} />
    </Routes>
  );
}
