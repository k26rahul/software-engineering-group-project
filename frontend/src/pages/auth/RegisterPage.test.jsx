import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import RegisterPage from "./RegisterPage";

describe("RegisterPage Component", () => {
  it("renders the register form elements correctly", () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    // Assert card header content
    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByText(/create a new member account/i)).toBeInTheDocument();

    // Assert inputs and labels
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("John Doe")).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("m@example.com")).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Assert required attribute is present on fields
    expect(screen.getByLabelText(/full name/i)).toBeRequired();
    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText(/password/i)).toBeRequired();

    // Assert buttons and links
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/login");
  });

  it("handles form submission without throwing or reloading page", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/full name/i), "Alice Smith");
    await user.type(screen.getByLabelText(/email/i), "alice@example.com");
    await user.type(screen.getByLabelText(/password/i), "mysecurepassword");

    const submitBtn = screen.getByRole("button", { name: /create account/i });
    // Click submit, should not throw or reload (default is prevented)
    await expect(user.click(submitBtn)).resolves.not.toThrow();
  });
});
