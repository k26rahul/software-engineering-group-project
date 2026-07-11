import { render, screen } from "@testing-library/react";
import { test, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ManagementDashboard from "./ManagementDashboard";

// Mock ResponsiveContainer for jsdom test environment compatibility
vi.mock("recharts", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    ResponsiveContainer: ({ children }) => (
      <div style={{ width: 800, height: 400 }}>{children}</div>
    ),
  };
});

test("renders ManagementDashboard with statistics and charts", async () => {
  render(
    <MemoryRouter>
      <ManagementDashboard />
    </MemoryRouter>
  );

  // Check if main heading is resolved after loading state
  expect(await screen.findByText(/Management Overview/i)).toBeInTheDocument();
  expect(screen.getByText(/Total Members/i)).toBeInTheDocument();
  expect(screen.getByText(/Active Borrowers/i)).toBeInTheDocument();
  expect(screen.getByText(/Issued Copies/i)).toBeInTheDocument();
  expect(screen.getByText(/Catalog Copies/i)).toBeInTheDocument();
  expect(screen.getByText(/Borrowing & Expense Trends/i)).toBeInTheDocument();
});
