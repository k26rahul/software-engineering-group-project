import { http, HttpResponse } from "msw";
import { baseURL } from "@/lib/api";
import { activeTransactions, budgetEntries, budgetSummary } from "@/mocks/data/transactionsData";

export const transactionsHandlers = [
  // GET /transactions/active - Response: list[transaction/TransactionResponse]
  http.get(`${baseURL}/transactions/active`, () => {
    return HttpResponse.json(activeTransactions);
  }),

  // POST /transactions/issue - Response: transaction/TransactionResponse (201 Created)
  http.post(`${baseURL}/transactions/issue`, () => {
    return HttpResponse.json(activeTransactions[0], { status: 201 });
  }),

  // PATCH /transactions/{id}/return - Response: None (204 No Content)
  http.patch(`${baseURL}/transactions/:id/return`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // GET /budget - Response: budget/BudgetSummaryResponse
  http.get(`${baseURL}/budget`, () => {
    return HttpResponse.json(budgetSummary);
  }),

  // POST /budget/expenses - Response: budget/ExpenseItemResponse (201 Created)
  http.post(`${baseURL}/budget/expenses`, () => {
    return HttpResponse.json(budgetEntries[0], { status: 201 });
  }),
];
