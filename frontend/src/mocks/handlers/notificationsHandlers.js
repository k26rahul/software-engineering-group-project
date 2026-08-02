import { http, HttpResponse } from "msw";
import { baseURL } from "@/lib/api";
import { mockNotifications } from "../data/notificationsData";

export const notificationsHandlers = [
  // GET /notifications - Response: list[notification/NotificationResponse]
  http.get(`${baseURL}/notifications`, () => {
    return HttpResponse.json(mockNotifications);
  }),

  // PATCH /notifications/{id}/read - Response: notification/NotificationResponse
  http.patch(`${baseURL}/notifications/:id/read`, ({ params }) => {
    const id = parseInt(params.id);
    const notif = mockNotifications.find((n) => n.id === id) || mockNotifications[0];
    return HttpResponse.json(notif);
  }),
];
