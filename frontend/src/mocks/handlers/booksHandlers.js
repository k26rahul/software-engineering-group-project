import { http, HttpResponse } from "msw";
import { books, bookSummaryList, mockLookupDB, mockReservation } from "@/mocks/data/booksData";
import { baseURL } from "@/lib/api";

export const booksHandlers = [
  // GET /books - Response: list[book/BookSummaryResponse]
  http.get(`${baseURL}/books`, () => {
    return HttpResponse.json(bookSummaryList);
  }),

  // POST /books - Response: book/BookDetailResponse (201 Created)
  http.post(`${baseURL}/books`, () => {
    return HttpResponse.json(books[0], { status: 201 });
  }),

  // POST /books/isbn-lookup - Response: book/AddBookRequest
  // Must be declared before /books/:id to avoid the :id segment matching "isbn-lookup"
  http.post(`${baseURL}/books/isbn-lookup`, () => {
    const firstEntry = Object.values(mockLookupDB)[0];
    return HttpResponse.json(firstEntry);
  }),

  // GET /books/{id} - Response: book/BookDetailResponse
  http.get(`${baseURL}/books/:id`, ({ params }) => {
    const book = books.find((b) => b.id === parseInt(params.id)) || books[0];
    return HttpResponse.json(book);
  }),

  // PATCH /books/{id} - Response: book/BookDetailResponse
  http.patch(`${baseURL}/books/:id`, ({ params }) => {
    const book = books.find((b) => b.id === parseInt(params.id)) || books[0];
    return HttpResponse.json(book);
  }),

  // DELETE /books/{id} - Response: None (204 No Content)
  http.delete(`${baseURL}/books/:id`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // PATCH /books/{id}/copies/{copy_id} - Response: book/BookDetailResponse
  http.patch(`${baseURL}/books/:id/copies/:copyId`, ({ params }) => {
    const book = books.find((b) => b.id === parseInt(params.id)) || books[0];
    return HttpResponse.json(book);
  }),

  // POST /books/{id}/copies - Response: book/BookDetailResponse (201 Created)
  http.post(`${baseURL}/books/:id/copies`, ({ params }) => {
    const book = books.find((b) => b.id === parseInt(params.id)) || books[0];
    return HttpResponse.json(book, { status: 201 });
  }),

  // POST /reservations - Response: reservation/ReservationResponse (201 Created)
  http.post(`${baseURL}/reservations`, () => {
    return HttpResponse.json(mockReservation, { status: 201 });
  }),
];
