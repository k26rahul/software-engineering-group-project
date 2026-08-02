import { http, HttpResponse } from "msw";
import { users, mockPendingMemberTokenResponse } from "@/mocks/data/usersData";
import { baseURL } from "@/lib/api";

export const authHandlers = [
  // POST /auth/login - Response: auth/TokenResponse
  // Kept credential lookup so different roles can be tested by logging in with the correct email.
  http.post(`${baseURL}/auth/login`, async ({ request }) => {
    const { email, password } = await request.json();
    const user = users[email];

    if (user && user.password === password) {
      return HttpResponse.json({
        access_token: `mock-jwt-token-${email}`,
        user,
      });
    }

    return new HttpResponse(JSON.stringify({ detail: "Invalid email or password" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }),

  // POST /auth/register - Response: auth/TokenResponse (201 Created)
  http.post(`${baseURL}/auth/register`, () => {
    return HttpResponse.json(mockPendingMemberTokenResponse, { status: 201 });
  }),

  // POST /auth/logout - Response: None (204 No Content)
  http.post(`${baseURL}/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // POST /auth/change-password - Response: None (204 No Content)
  http.post(`${baseURL}/auth/change-password`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // GET /auth/me - Response: user/UserProfileResponse
  // Resolves the token back to a user so page refreshes restore the session correctly.
  http.get(`${baseURL}/auth/me`, async ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new HttpResponse(JSON.stringify({ detail: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const token = authHeader.substring("Bearer ".length);
    if (token.startsWith("mock-jwt-token-")) {
      const email = token.substring("mock-jwt-token-".length);
      const user = users[email];
      if (user) {
        return HttpResponse.json(user);
      }
    }

    return new HttpResponse(JSON.stringify({ detail: "Invalid token" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }),
];
