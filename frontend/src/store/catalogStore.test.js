import { describe, it, expect, beforeEach } from "vitest";
import useCatalogStore from "./catalogStore";

describe("catalogStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useCatalogStore.setState({
      books: [],
      selectedBook: null,
      isLoading: false,
      error: null,
    });
  });

  it("fetchBooks correctly populates the store", async () => {
    await useCatalogStore.getState().fetchBooks();
    const state = useCatalogStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    // Assuming our mock data has 10 books, but we just check it's populated
    expect(state.books.length).toBeGreaterThan(0);
    expect(state.books[0]).toHaveProperty("title");
  });

  it("fetchBook sets selectedBook", async () => {
    const book = await useCatalogStore.getState().fetchBook(1);
    const state = useCatalogStore.getState();

    expect(state.isLoading).toBe(false);
    expect(state.selectedBook).toBeDefined();
    expect(state.selectedBook.id).toBe(1);
    expect(book.id).toBe(1);
  });

  it("addBook updates books list", async () => {
    const newBook = {
      title: "Test Book",
      author: "Test Author",
      category: "Technology",
      price: 19.99,
      initial_copies: 2,
    };

    const addedBook = await useCatalogStore.getState().addBook(newBook);
    const state = useCatalogStore.getState();

    expect(addedBook.title).toBe("Test Book");
    // Ensure the new book was added to the state
    const foundBook = state.books.find((b) => b.id === addedBook.id);
    expect(foundBook).toBeDefined();
  });

  it("deleteBook removes book from store", async () => {
    // First fetch books to populate
    await useCatalogStore.getState().fetchBooks();
    const initialCount = useCatalogStore.getState().books.length;

    // Assume book id 1 exists from mock data
    await useCatalogStore.getState().deleteBook(1);

    const newCount = useCatalogStore.getState().books.length;
    expect(newCount).toBe(initialCount - 1);

    const deletedBook = useCatalogStore.getState().books.find((b) => b.id === 1);
    expect(deletedBook).toBeUndefined();
  });

  it("lookupISBN works for known ISBN", async () => {
    const result = await useCatalogStore.getState().lookupISBN("9781491950296");
    expect(result.title).toBe("Programming TypeScript");
    expect(result.author).toBe("Boris Cherny");
  });

  it("lookupISBN handles errors properly", async () => {
    await expect(useCatalogStore.getState().lookupISBN("invalid-isbn")).rejects.toThrow();
  });
});
