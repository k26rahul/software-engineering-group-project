import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import api from "./api";

const server = setupServer(
  http.get("http://localhost:8000/test-success", () => {
    return HttpResponse.json({ data: "success" });
  }),
  http.get("http://localhost:8000/test-error-detail", () => {
    return HttpResponse.json(
      { detail: "Custom error detail from backend" },
      { status: 401 }
    );
  }),
  http.get("http://localhost:8000/test-error-message", () => {
    return HttpResponse.json(
      { message: "Custom error message from backend" },
      { status: 400 }
    );
  }),
  http.get("http://localhost:8000/test-network-error", () => {
    return HttpResponse.error();
  }),
  http.get("http://localhost:8000/test-unknown-error", () => {
    return HttpResponse.json(
      { someOtherField: "Unknown error shape" },
      { status: 500 }
    );
  })
);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("api interceptor", () => {
  it("passes successful responses through", async () => {
    const res = await api.get("http://localhost:8000/test-success");
    expect(res.data).toEqual({ data: "success" });
  });

  it("normalizes errors with detail field", async () => {
    await expect(api.get("http://localhost:8000/test-error-detail")).rejects.toThrow(
      "Custom error detail from backend"
    );
  });

  it("normalizes errors with message field", async () => {
    await expect(api.get("http://localhost:8000/test-error-message")).rejects.toThrow(
      "Custom error message from backend"
    );
  });

  it("normalizes network errors (no response)", async () => {
    await expect(api.get("http://localhost:8000/test-network-error")).rejects.toThrow(
      "Network error. Please check your connection and try again."
    );
  });

  it("normalizes unknown errors to a fallback message", async () => {
    await expect(api.get("http://localhost:8000/test-unknown-error")).rejects.toThrow(
      "Something went wrong. Please try again."
    );
  });
});
