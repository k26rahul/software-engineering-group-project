import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { baseURL, ACCESS_TOKEN_KEY } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import RegisterPage from "./RegisterPage";

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    isInitializing: false,
    hasInitialized: false,
  });
  localStorage.clear();
});

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
    expect(screen.getByLabelText(/phone number \(optional\)/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("+1234567890")).toBeInTheDocument();
    expect(screen.getByLabelText(/membership type/i)).toBeInTheDocument();

    // Assert required attribute is present on standard input fields
    expect(screen.getByLabelText(/full name/i)).toBeRequired();
    expect(screen.getByLabelText(/email/i)).toBeRequired();
    expect(screen.getByLabelText(/password/i)).toBeRequired();

    // Assert buttons and links
    expect(screen.getByRole("button", { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute("href", "/login");
  });

  it("handles successful registration", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pending-approval" element={<div>Pending Approval Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/full name/i), "Alice Smith");
    await user.type(screen.getByLabelText(/email/i), "alice@example.com");
    await user.type(screen.getByLabelText(/password/i), "mysecurepassword");
    await user.type(screen.getByLabelText(/phone number \(optional\)/i), "+15555555555");

    // Open select dropdown and select "Off Campus"
    await user.click(screen.getByLabelText(/membership type/i));
    await user.click(screen.getByRole("option", { name: "Off Campus" }));

    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("Pending Approval Page")).toBeInTheDocument();
    });

    // The mock always returns the static pending user; verify the store and token are set correctly.
    expect(useAuthStore.getState().user).toMatchObject({
      id: 999,
      role: "MEMBER",
      approval_status: "PENDING",
      is_active: false,
    });
    expect(useAuthStore.getState().accessToken).toBe("mock-jwt-token-pending@example.com");
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe("mock-jwt-token-pending@example.com");
  });

  it("displays error message when registration API returns error", async () => {
    // Mock handler to simulate email already registered
    server.use(
      http.post(`${baseURL}/auth/register`, () => {
        return new HttpResponse(JSON.stringify({ detail: "Email already registered." }), {
          status: 409,
          headers: {
            "Content-Type": "application/json",
          },
        });
      })
    );

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/full name/i), "Duplicate User");
    await user.type(screen.getByLabelText(/email/i), "duplicate@example.com");
    await user.type(screen.getByLabelText(/password/i), "somepassword");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText("Email already registered.")).toBeInTheDocument();
    });
  });
});
