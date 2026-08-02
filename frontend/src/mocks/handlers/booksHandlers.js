import { http, HttpResponse } from "msw";
import { books as mockBooks, mockLookupDB } from "@/mocks/data/booksData";
import { baseURL } from "@/lib/api";

// Keep a mutable in-memory copy
let booksDB = structuredClone(mockBooks); //deep clone to avoid mutating the original mock data
let nextId = Math.max(0, ...booksDB.map((b) => b.id)) + 1;
let nextCopyId = Math.max(0, ...booksDB.flatMap((b) => b.copies.map((c) => c.id))) + 1;

export const booksHandlers = [
  http.get(`${baseURL}/books`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase() || "";
    const category = url.searchParams.get("category");

    let filtered = booksDB.filter((b) => !b.is_archived);

    if (search) {
      filtered = filtered.filter(
        (b) =>
          b.title.toLowerCase().includes(search) ||
          b.author.toLowerCase().includes(search) ||
          (b.isbn && b.isbn.includes(search))
      );
    }

    if (category) {
      filtered = filtered.filter((b) => b.category === category);
    }

    // Map to BookSummaryResponse
    const response = filtered.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      category: b.category,
      price: b.price,
      available_copies: b.available_copies,
    }));

    return HttpResponse.json(response);
  }),

  http.post(`${baseURL}/books`, async ({ request }) => {
    const data = await request.json();
    const { title, author, isbn, category, price, description, initial_copies = 1 } = data;

    const newBook = {
      id: nextId++,
      title,
      author,
      isbn: isbn || null,
      category,
      price: parseFloat(price) || 0,
      description: description || null,
      available_copies: initial_copies,
      average_rating: 0,
      created_at: new Date().toISOString(),
      is_archived: false,
      copies: [],
    };

    for (let i = 0; i < initial_copies; i++) {
      newBook.copies.push({
        id: nextCopyId++,
        book_id: newBook.id,
        copy_number: i + 1,
        status: "AVAILABLE",
      });
    }

    booksDB.push(newBook);
    return HttpResponse.json(newBook, { status: 201 });
  }),

  http.get(`${baseURL}/books/:id`, ({ params }) => {
    const book = booksDB.find((b) => b.id === Number(params.id));
    if (!book || book.is_archived) {
      return HttpResponse.json({ detail: "Book not found" }, { status: 404 });
    }
    return HttpResponse.json(book);
  }),

  http.patch(`${baseURL}/books/:id`, async ({ params, request }) => {
    const bookIndex = booksDB.findIndex((b) => b.id === Number(params.id));
    if (bookIndex === -1 || booksDB[bookIndex].is_archived) {
      return HttpResponse.json({ detail: "Book not found" }, { status: 404 });
    }

    const updates = await request.json();
    booksDB[bookIndex] = { ...booksDB[bookIndex], ...updates };

    return HttpResponse.json(booksDB[bookIndex]);
  }),

  // DELETE /books/:id (Soft Delete)
  http.delete(`${baseURL}/books/:id`, ({ params }) => {
    const bookIndex = booksDB.findIndex((b) => b.id === Number(params.id));
    if (bookIndex === -1 || booksDB[bookIndex].is_archived) {
      return HttpResponse.json({ detail: "Book not found" }, { status: 404 });
    }

    booksDB[bookIndex].is_archived = true;
    return HttpResponse.json({ detail: "Book archived successfully" });
  }),

  http.post(`${baseURL}/books/isbn-lookup`, async ({ request }) => {
    const { isbn } = await request.json();

    const result = mockLookupDB[isbn];

    if (result) {
      return HttpResponse.json({ isbn, ...result });
    }

    return HttpResponse.json({ detail: "ISBN not found" }, { status: 404 });
  }),

  http.patch(`${baseURL}/books/:id/copies/:copyId`, async ({ params, request }) => {
    const bookIndex = booksDB.findIndex((b) => b.id === Number(params.id));
    if (bookIndex === -1 || booksDB[bookIndex].is_archived) {
      return HttpResponse.json({ detail: "Book not found" }, { status: 404 });
    }

    const { status } = await request.json();
    const copyIndex = booksDB[bookIndex].copies.findIndex((c) => c.id === Number(params.copyId));

    if (copyIndex === -1) {
      return HttpResponse.json({ detail: "Copy not found" }, { status: 404 });
    }

    booksDB[bookIndex].copies[copyIndex].status = status;

    // Recalculate available copies
    booksDB[bookIndex].available_copies = booksDB[bookIndex].copies.filter(
      (c) => c.status === "AVAILABLE"
    ).length;

    return HttpResponse.json(booksDB[bookIndex]);
  }),

  http.post(`${baseURL}/books/:id/copies`, async ({ params }) => {
    const bookIndex = booksDB.findIndex((b) => b.id === Number(params.id));
    if (bookIndex === -1 || booksDB[bookIndex].is_archived) {
      return HttpResponse.json({ detail: "Book not found" }, { status: 404 });
    }

    const newCopy = {
      id: nextCopyId++,
      book_id: Number(params.id),
      copy_number: booksDB[bookIndex].copies.length + 1,
      status: "AVAILABLE",
    };

    booksDB[bookIndex].copies.push(newCopy);
    booksDB[bookIndex].available_copies += 1;

    return HttpResponse.json(newCopy, { status: 201 });
  }),

  http.post(`${baseURL}/reservations`, async ({ request }) => {
    const { book_id } = await request.json();
    const book = booksDB.find((b) => b.id === Number(book_id));
    if (!book) {
      return HttpResponse.json({ detail: "Book not found" }, { status: 404 });
    }

    return HttpResponse.json(
      {
        id: Math.floor(Math.random() * 1000) + 1,
        book_id: Number(book_id),
        status: "WAITING",
        created_at: new Date().toISOString(),
        notified_at: null,
      },
      { status: 201 }
    );
  }),
];
