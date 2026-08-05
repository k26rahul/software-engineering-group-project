import { http, HttpResponse } from "msw";
import { baseURL } from "@/lib/api";
import { membersList } from "@/mocks/data/usersData";
import {
  borrowingHistory,
  currentIssues,
  payments,
  recommendations,
} from "@/mocks/data/membersData";

export const membersHandlers = [
  // GET /members - Response: list[user/MemberSummaryResponse]
  http.get(`${baseURL}/members`, () => {
    return HttpResponse.json(membersList);
  }),

  // PATCH /members/{id}/approve - Response: None (204 No Content)
  http.patch(`${baseURL}/members/:id/approve`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // PATCH /members/{id}/reject - Response: None (204 No Content)
  http.patch(`${baseURL}/members/:id/reject`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // GET /members/{id} - Response: user/MemberDetailResponse
  http.get(`${baseURL}/members/:id`, ({ params }) => {
    const member = membersList.find((m) => m.id === parseInt(params.id)) || membersList[0];
    return HttpResponse.json(member);
  }),

  // PATCH /members/{id}/profile - Response: user/MemberDetailResponse
  http.patch(`${baseURL}/members/:id/profile`, ({ params }) => {
    const member = membersList.find((m) => m.id === parseInt(params.id)) || membersList[0];
    return HttpResponse.json(member);
  }),

  // GET /members/{id}/history - Response: list[transaction/TransactionHistoryItemResponse]
  http.get(`${baseURL}/members/:id/history`, () => {
    return HttpResponse.json(borrowingHistory);
  }),

  // GET /members/{id}/current-issues - Response: list[transaction/TransactionResponse]
  http.get(`${baseURL}/members/:id/current-issues`, () => {
    return HttpResponse.json(currentIssues);
  }),

  // GET /payments/history - Response: list[payment/PaymentResponse]
  http.get(`${baseURL}/payments/history`, () => {
    return HttpResponse.json(payments);
  }),

  // GET /members/{id}/recommendations - Response: list[book/BookRecommendationResponse]
  http.get(`${baseURL}/members/:id/recommendations`, () => {
    return HttpResponse.json(recommendations);
  }),
];
