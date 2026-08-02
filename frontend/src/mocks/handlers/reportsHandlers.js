import { http, HttpResponse } from "msw";
import { baseURL } from "@/lib/api";
import { usageReportMockData, expenseReportMockData } from "../data/reportsData";

export const reportsHandlers = [
  // GET /reports/usage - Response: budget/UsageReportResponse
  http.get(`${baseURL}/reports/usage`, () => {
    return HttpResponse.json(usageReportMockData);
  }),

  // GET /reports/expense - Response: budget/ExpenseReportResponse
  http.get(`${baseURL}/reports/expense`, () => {
    return HttpResponse.json(expenseReportMockData);
  }),

  // GET /reports/download/{type} - Response: None (file download stub)
  http.get(`${baseURL}/reports/download/:type`, ({ params }) => {
    return HttpResponse.json({
      status: "success",
      message: `Report format '${params.type}' generated successfully.`,
      download_url: `/exports/report_${params.type}.csv`,
    });
  }),
];
