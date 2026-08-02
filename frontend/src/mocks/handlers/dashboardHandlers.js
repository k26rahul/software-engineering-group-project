import { http, HttpResponse } from "msw";
import { baseURL } from "@/lib/api";
import { librarianDashboardMockData, managementDashboardMockData } from "../data/dashboardsData";

export const dashboardHandlers = [
  http.get(`${baseURL}/dashboard/librarian`, () => {
    return HttpResponse.json(librarianDashboardMockData);
  }),

  http.get(`${baseURL}/dashboard/management`, () => {
    return HttpResponse.json(managementDashboardMockData);
  }),
];
