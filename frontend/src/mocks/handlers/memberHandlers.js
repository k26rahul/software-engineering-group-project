import { http, HttpResponse } from "msw";
import { baseURL } from "@/lib/api";

export const memberHandlers = [
  http.patch(`${baseURL}/members/:id/approve`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json({
      id: id,
      name: id === 4 ? "Sneha Reddy" : "Amit Patel",
      email: id === 4 ? "pending_member1@example.com" : "pending_member2@example.com",
      role: "MEMBER",
      membership_type: id === 4 ? "ON_CAMPUS" : "OFF_CAMPUS",
      approval_status: "APPROVED",
      is_active: true,
      created_at: new Date().toISOString(),
      membership_start_date: new Date().toISOString().split("T")[0],
      max_issue_limit: 3,
    });
  }),

  http.patch(`${baseURL}/members/:id/reject`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json({
      id: id,
      name: id === 4 ? "Sneha Reddy" : "Amit Patel",
      email: id === 4 ? "pending_member1@example.com" : "pending_member2@example.com",
      role: "MEMBER",
      membership_type: id === 4 ? "ON_CAMPUS" : "OFF_CAMPUS",
      approval_status: "REJECTED",
      is_active: false,
      created_at: new Date().toISOString(),
      membership_start_date: null,
      max_issue_limit: 3,
    });
  }),
];
