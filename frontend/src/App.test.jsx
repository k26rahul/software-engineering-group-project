import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import App from "./App";

test("renders the homepage heading", async () => {
  render(<App />);
  expect(await screen.findByRole("heading", { level: 1 })).toBeInTheDocument();
});
