import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach, vi } from "vitest";
import ManagementReportsPage from "./ManagementReportsPage";
import useReportsStore from "@/store/reportsStore";

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

describe("ManagementReportsPage Component", () => {
  beforeEach(() => {
    useReportsStore.setState({
      usageReport: null,
      expenseReport: null,
      isLoading: false,
      error: null,
      downloadingType: null,
    });
  });

  it("renders reports header and fetches metrics", async () => {
    render(
      <MemoryRouter>
        <ManagementReportsPage />
      </MemoryRouter>
    );

    // Header check
    expect(
      screen.getByRole("heading", { name: /Reports & Analytics Center/i })
    ).toBeInTheDocument();

    // Wait for mock data to load
    await waitFor(() => {
      expect(screen.getAllByText("Total Checkouts").length).toBeGreaterThan(0);
    });

    expect(screen.getByText("142")).toBeInTheDocument();
  });

  it("switches tabs between Usage, Financial, and Executive Insights", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ManagementReportsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText("Total Checkouts").length).toBeGreaterThan(0);
    });

    // Click Financial Audit tab
    const financialTab = screen.getByRole("button", { name: /financial & budget audit/i });
    await user.click(financialTab);

    await waitFor(() => {
      expect(screen.getByText("Budget Allocated")).toBeInTheDocument();
      expect(screen.getByText("₹60,000")).toBeInTheDocument();
    });

    // Click Executive Summary tab
    const executiveTab = screen.getByRole("button", { name: /executive insights/i });
    await user.click(executiveTab);

    await waitFor(() => {
      expect(screen.getByText("Executive Highlights")).toBeInTheDocument();
    });
  });
});
