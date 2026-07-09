import { describe, it, expect, beforeEach } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/mocks/server";
import api from "./api";

beforeEach(() => {
  server.use(
    http.get("http://localhost:8000/test-success", () => {
      return HttpResponse.json({ data: "success" });
    }),
    http.get("http://localhost:8000/test-error-detail", () => {
      return HttpResponse.json({ detail: "Custom error detail from backend" }, { status: 401 });
    }),
    http.get("http://localhost:8000/test-network-error", () => {
      return HttpResponse.error();
    }),
    http.get("http://localhost:8000/test-unknown-error", () => {
      return HttpResponse.json({ someOtherField: "Unknown error shape" }, { status: 500 });
    })
  );
});

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
