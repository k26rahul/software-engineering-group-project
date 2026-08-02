import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import MemberCatalogPage from "./MemberCatalogPage";
import useBookStore from "@/store/bookStore";

describe("MemberCatalogPage Component", () => {
  beforeEach(() => {
    useBookStore.setState({
      books: [],
      selectedBook: null,
      isLoading: false,
      error: null,
    });
  });

  it("renders catalog header and books grid correctly", async () => {
    render(
      <MemoryRouter>
        <MemberCatalogPage />
      </MemoryRouter>
    );

    // Check page title header
    expect(screen.getByText("Library Book Catalog")).toBeInTheDocument();

    // Wait for mock books to load
    await waitFor(() => {
      expect(screen.getByText("Clean Code")).toBeInTheDocument();
    });

    expect(screen.getByText("by Robert C. Martin")).toBeInTheDocument();
  });

  it("renders the search input and accepts user input", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <MemberCatalogPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Clean Code")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search catalog/i);
    await user.type(searchInput, "Gatsby");
    expect(searchInput).toHaveValue("Gatsby");
  });


  it("opens book details dialog when clicking Details button", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <MemberCatalogPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Clean Code")).toBeInTheDocument();
    });

    const detailsButtons = screen.getAllByRole("button", { name: /details/i });
    await user.click(detailsButtons[0]);

    // Check dialog content is displayed
    await waitFor(() => {
      expect(screen.getByText(/library counter/i)).toBeInTheDocument();
    });
  });
});
