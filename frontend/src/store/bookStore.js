import { create } from "zustand";
import api from "@/lib/api";

const useBookStore = create((set) => ({
  books: [],
  selectedBook: null,
  isLoading: false,
  error: null,

  fetchBooks: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { search, category } = params;
      const queryParams = new URLSearchParams();
      if (search) queryParams.append("search", search);
      if (category) queryParams.append("category", category);

      const response = await api.get(`/books?${queryParams.toString()}`);
      set({ books: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchBook: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/books/${id}`);
      set({ selectedBook: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addBook: async (bookData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/books", bookData);
      set((state) => ({
        books: [...state.books, response.data],
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateBook: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/books/${id}`, updates);
      set((state) => ({
        books: state.books.map((b) => (b.id === id ? { ...b, ...response.data } : b)),
        selectedBook:
          state.selectedBook?.id === id
            ? { ...state.selectedBook, ...response.data }
            : state.selectedBook,
        isLoading: false,
      }));
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteBook: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/books/${id}`);
      set((state) => ({
        books: state.books.filter((b) => b.id !== id),
        selectedBook: state.selectedBook?.id === id ? null : state.selectedBook,
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  lookupISBN: async (isbn) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/books/isbn-lookup", { isbn });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateCopyStatus: async (bookId, copyId, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.patch(`/books/${bookId}/copies/${copyId}`, { status });
      set((state) => {
        let updatedSelectedBook = state.selectedBook;
        if (updatedSelectedBook && updatedSelectedBook.id === bookId) {
          updatedSelectedBook = { ...response.data };
        }

        const updatedBooks = state.books.map((b) =>
          b.id === bookId ? { ...b, available_copies: response.data.available_copies } : b
        );

        return {
          books: updatedBooks,
          selectedBook: updatedSelectedBook,
          isLoading: false,
        };
      });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addCopy: async (bookId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post(`/books/${bookId}/copies`);

      set((state) => {
        let updatedSelectedBook = state.selectedBook;
        let updatedBooks = [...state.books];

        if (updatedSelectedBook && updatedSelectedBook.id === bookId) {
          updatedSelectedBook = {
            ...updatedSelectedBook,
            copies: [...updatedSelectedBook.copies, response.data],
            available_copies: updatedSelectedBook.available_copies + 1,
          };
        }

        updatedBooks = updatedBooks.map((b) =>
          b.id === bookId ? { ...b, available_copies: b.available_copies + 1 } : b
        );

        return {
          books: updatedBooks,
          selectedBook: updatedSelectedBook,
          isLoading: false,
        };
      });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  reserveBook: async (bookId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/reservations", { book_id: bookId });
      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));

export default useBookStore;
