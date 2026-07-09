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
        token: "mock-jwt-token-123",
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
        token: "mock-jwt-token-123",
        access_token: "mock-jwt-token-123",
      },
      { status: 201 }
    );
  }),
];
