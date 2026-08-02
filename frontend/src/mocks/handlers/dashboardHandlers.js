import { http, HttpResponse } from "msw";
import { baseURL } from "@/lib/api";
import { librarianDashboardMockData, managementDashboardMockData } from "../data/dashboardsData";

export const dashboardHandlers = [
  // GET /dashboard/librarian - Response: dashboard/LibrarianDashboardResponse
  http.get(`${baseURL}/dashboard/librarian`, () => {
    return HttpResponse.json(librarianDashboardMockData);
  }),

  // GET /dashboard/management - Response: dashboard/ManagementDashboardResponse
  http.get(`${baseURL}/dashboard/management`, () => {
    return HttpResponse.json(managementDashboardMockData);
  }),
];
