import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import HomePage from "./HomePage";

describe("HomePage Component", () => {
  it("renders the hero section, key features, and auth buttons when not logged in", () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );

    expect(screen.getAllByText(/RVK Library/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Empowering Readers through/i)).toBeInTheDocument();
    expect(screen.getByText(/Instant Catalog Discovery/i)).toBeInTheDocument();
    expect(screen.getByText(/Automated Issue & Returns/i)).toBeInTheDocument();
    expect(screen.getByText(/Fair Reservation Queues/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Get Started/i).length).toBeGreaterThan(0);
  });
});
