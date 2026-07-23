import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import BookCopiesPage from "./BookCopiesPage";
import useCatalogStore from "@/store/catalogStore";

describe("BookCopiesPage Component", () => {
  beforeEach(() => {
    useCatalogStore.setState({
      books: [],
      selectedBook: null,
      isLoading: false,
      error: null,
    });
  });

  it("fetches book details and renders copies", async () => {
    render(
      <MemoryRouter initialEntries={["/catalog/1/copies"]}>
        <Routes>
          <Route path="/catalog/:id/copies" element={<BookCopiesPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Should fetch and show Clean Code details
    await waitFor(() => {
      expect(screen.getByText("Clean Code by Robert C. Martin")).toBeInTheDocument();
    });

    // Should show copies
    expect(screen.getByText("Physical Inventory")).toBeInTheDocument();
    // Copy 1, 2, 3 from the mock data should be rendered
    expect(screen.getByText("1")).toBeInTheDocument(); // Copy #1
  });

  it("allows adding a new copy", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/catalog/1/copies"]}>
        <Routes>
          <Route path="/catalog/:id/copies" element={<BookCopiesPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Clean Code by Robert C. Martin")).toBeInTheDocument();
    });

    const addBtn = screen.getByRole("button", { name: /add new copy/i });
    await user.click(addBtn);

    // In the mock, a new copy gets added. Wait for toast or state update
    // We can assume a success toast appears or copy count increases
    await waitFor(() => {
      // The store's selectedBook should be updated with the new copy
      const state = useCatalogStore.getState();
      expect(state.selectedBook.copies.length).toBeGreaterThan(3); // Mock starts with 3
    });
  });
});
