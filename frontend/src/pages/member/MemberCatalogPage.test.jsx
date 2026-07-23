import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import MemberCatalogPage from "./MemberCatalogPage";
import useCatalogStore from "@/store/catalogStore";

describe("MemberCatalogPage Component", () => {
  beforeEach(() => {
    useCatalogStore.setState({
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

  it("filters books based on search query", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <MemberCatalogPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Clean Code")).toBeInTheDocument();
      expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search catalog/i);
    await user.type(searchInput, "Gatsby");

    await waitFor(() => {
      expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
      expect(screen.queryByText("Clean Code")).not.toBeInTheDocument();
    });
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
