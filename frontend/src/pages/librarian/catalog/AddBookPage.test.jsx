import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import AddBookPage from "./AddBookPage";
import useCatalogStore from "@/store/catalogStore";

describe("AddBookPage Component", () => {
  beforeEach(() => {
    useCatalogStore.setState({
      books: [],
      selectedBook: null,
      isLoading: false,
      error: null,
    });
  });

  it("renders the add book form elements", () => {
    render(
      <MemoryRouter>
        <AddBookPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Add New Book")).toBeInTheDocument();
    expect(screen.getByLabelText(/title \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/author \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/isbn/i, { selector: 'input[name="isbn"]' })).toBeInTheDocument();
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/initial copies/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /save book/i })).toBeInTheDocument();
  });

  it("auto-fills form on successful ISBN lookup", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AddBookPage />
      </MemoryRouter>
    );

    const lookupInput = screen.getByPlaceholderText(/e\.g\. 9781491950296/i);
    const lookupButton = screen.getByRole("button", { name: /lookup/i });

    await user.type(lookupInput, "9781491950296");
    await user.click(lookupButton);

    await waitFor(() => {
      // The form fields should be populated from the mock lookup response
      expect(screen.getByLabelText(/title \*/i)).toHaveValue("Programming TypeScript");
      expect(screen.getByLabelText(/author \*/i)).toHaveValue("Boris Cherny");
      expect(screen.getByLabelText(/price/i)).toHaveValue(399); // 399 is in the mock
    });
  });

  it("submits the form and navigates to catalog", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/add"]}>
        <Routes>
          <Route path="/add" element={<AddBookPage />} />
          <Route path="/librarian/catalog" element={<div>Catalog List View</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/title \*/i), "My Test Book");
    await user.type(screen.getByLabelText(/author \*/i), "Test Author");
    await user.type(screen.getByLabelText(/price/i), "15.99");

    // Select category
    await user.click(screen.getByRole("combobox")); // Radix UI Select trigger
    await user.click(screen.getByRole("option", { name: "Fiction" }));

    await user.click(screen.getByRole("button", { name: /save book/i }));

    await waitFor(() => {
      expect(screen.getByText("Catalog List View")).toBeInTheDocument();
    });
  });
});
