import { http, HttpResponse } from "msw";
import { users } from "@/mocks/data";
import { baseURL } from "@/lib/api";

export const authHandlers = [
  http.post(`${baseURL}/auth/login`, async ({ request }) => {
    const { email, password } = await request.json();
    const user = users[email];

    if (user && user.password === password) {
      return HttpResponse.json({
        user: user,
        access_token: `mock-jwt-token-${email}`,
      });
    }

    return new HttpResponse(JSON.stringify({ detail: "Invalid email or password" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  http.post(`${baseURL}/auth/register`, async ({ request }) => {
    const { email, name, phone, membership_type } = await request.json();

    if (users[email]) {
      return new HttpResponse(JSON.stringify({ detail: "Email already registered." }), {
        status: 409,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return HttpResponse.json(
      {
        user: {
          id: 999,
          email,
          name,
          phone: phone || null,
          role: "MEMBER",
          membership_type,
          approval_status: "PENDING",
          is_active: false,
          created_at: new Date().toISOString(),
        },
        access_token: `mock-jwt-token-${email}`,
      },
      { status: 201 }
    );
  }),

  http.get(`${baseURL}/auth/me`, async ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new HttpResponse(JSON.stringify({ detail: "Not authenticated" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
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
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),
];
