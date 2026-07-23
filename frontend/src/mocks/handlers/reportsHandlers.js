import { http, HttpResponse } from "msw";
import { baseURL } from "@/lib/api";
import { usageReportMockData, expenseReportMockData } from "../data/reportsData";

export const reportsHandlers = [
  http.get(`${baseURL}/reports/usage`, () => {
    return HttpResponse.json(usageReportMockData);
  }),

  http.get(`${baseURL}/reports/expense`, () => {
    return HttpResponse.json(expenseReportMockData);
  }),

  http.get(`${baseURL}/reports/download/:type`, ({ params }) => {
    const { type } = params;
    return HttpResponse.json({
      status: "success",
      message: `Report format '${type}' generated successfully.`,
      download_url: `/exports/report_${type}_${Date.now()}.csv`,
    });
  }),
];
