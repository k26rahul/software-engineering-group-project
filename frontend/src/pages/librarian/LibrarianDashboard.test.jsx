import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LibrarianDashboard from "./LibrarianDashboard";

test("renders LibrarianDashboard with stats and elements", async () => {
  render(
    <MemoryRouter>
      <LibrarianDashboard />
    </MemoryRouter>
  );
  // Check if main heading is resolved after loading state
  expect(await screen.findByText("Librarian Operations")).toBeInTheDocument();
  expect(screen.getByText("Pending Approvals")).toBeInTheDocument();
  expect(screen.getByText("Overdue Books", { exact: true })).toBeInTheDocument();
  expect(screen.getByText("Active Reservations")).toBeInTheDocument();
  expect(screen.getByText("Active Alerts")).toBeInTheDocument();
});
