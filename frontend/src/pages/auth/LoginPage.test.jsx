import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import { baseURL, ACCESS_TOKEN_KEY } from "@/lib/api";
import useAuthStore from "@/store/authStore";
import LoginPage from "./LoginPage";

beforeEach(() => {
  useAuthStore.setState({
    user: null,
    accessToken: null,
    isInitializing: false,
    hasInitialized: false,
  });
  localStorage.clear();
});

describe("LoginPage Component", () => {
  it("renders the login form elements correctly", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    // Assert card header content
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(
      screen.getByText(/enter your email below to login to your account/i)
    ).toBeInTheDocument();

    // Assert inputs and labels
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("librarian@example.com")).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("password123")).toBeInTheDocument();

    // Assert buttons and links
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /register/i })).toBeInTheDocument();
  });

  it("redirects LIBRARIAN to /librarian after successful login", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/librarian" element={<div>Librarian Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), "librarian@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Librarian Dashboard Page")).toBeInTheDocument();
    });

    // Check store state updated
    expect(useAuthStore.getState().user).toEqual({
      email: "librarian@example.com",
      name: "Chitra",
      role: "LIBRARIAN",
      password: "password123",
    });
    expect(useAuthStore.getState().accessToken).toBe("mock-jwt-token-librarian@example.com");
    expect(localStorage.getItem(ACCESS_TOKEN_KEY)).toBe("mock-jwt-token-librarian@example.com");
  });

  it("redirects MEMBER to /member after successful login", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/member" element={<div>Member Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), "member@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Member Dashboard Page")).toBeInTheDocument();
    });

    expect(useAuthStore.getState().user.role).toBe("MEMBER");
  });

  it("redirects CAMPUS_MANAGEMENT to /management after successful login", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/management" element={<div>Management Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), "management@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Management Dashboard Page")).toBeInTheDocument();
    });

    expect(useAuthStore.getState().user.role).toBe("CAMPUS_MANAGEMENT");
  });

  it("displays custom error message from backend when login fails with invalid credentials", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), "wrong@example.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });

    // Check store state remains null
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().accessToken).toBeNull();
  });

  it("displays network error fallback when connection fails", async () => {
    // Override the login handler specifically for this test to trigger network error
    server.use(
      http.post(`${baseURL}/auth/login`, () => {
        return HttpResponse.error();
      })
    );

    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/email/i), "librarian@example.com");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByText("Network error. Please check your connection and try again.")
      ).toBeInTheDocument();
    });
  });
});
