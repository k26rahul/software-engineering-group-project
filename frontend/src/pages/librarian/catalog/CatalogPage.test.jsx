import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import CatalogPage from "./CatalogPage";
import useBookStore from "@/store/bookStore";

describe("CatalogPage Component", () => {
  beforeEach(() => {
    useBookStore.setState({
      books: [],
      selectedBook: null,
      isLoading: false,
      error: null,
    });
  });

  it("renders catalog table correctly with mocked books", async () => {
    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    );

    // Initial loading state shows skeletons, wait for them to disappear
    await waitFor(() => {
      // Clean Code is ID 1 in our mock data
      expect(screen.getByText("Clean Code")).toBeInTheDocument();
    });

    // Verify some specific mock data
    expect(screen.getByText("Robert C. Martin")).toBeInTheDocument();
    expect(screen.getAllByText("Technology").length).toBeGreaterThan(0);
  });

  it("renders the search input and accepts user input", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Clean Code")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by title/i);
    await user.type(searchInput, "Gatsby");
    expect(searchInput).toHaveValue("Gatsby");
  });
});
