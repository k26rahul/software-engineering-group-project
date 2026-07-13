import { http, HttpResponse } from "msw";
import { baseURL } from "@/lib/api";
import {
  getMemberApprovalMockResponse,
  getMemberRejectionMockResponse,
} from "../data/memberData";

export const memberHandlers = [
  http.patch(`${baseURL}/members/:id/approve`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json(getMemberApprovalMockResponse(id));
  }),

  http.patch(`${baseURL}/members/:id/reject`, ({ params }) => {
    const id = parseInt(params.id);
    return HttpResponse.json(getMemberRejectionMockResponse(id));
  }),
];
