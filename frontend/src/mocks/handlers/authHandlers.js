import { http, HttpResponse } from "msw";
import { mockUsers } from "../mockData";
import { baseURL } from "@/lib/api";

export const authHandlers = [
  http.post(`${baseURL}/auth/login`, async ({ request }) => {
    const { email, password } = await request.json();
    const user = mockUsers[email];

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
];
