import { http, HttpResponse } from "msw";
import { baseURL } from "@/lib/api";
import { mockNotifications } from "../data/notificationsData";

export const notificationHandlers = [
  http.get(`${baseURL}/notifications`, () => {
    return HttpResponse.json(mockNotifications);
  }),

  http.patch(`${baseURL}/notifications/:id/read`, ({ params }) => {
    const id = parseInt(params.id);
    const notif = mockNotifications.find((n) => n.id === id);
    if (notif) {
      notif.is_read = true;
      return HttpResponse.json(notif);
    }
    return new HttpResponse(JSON.stringify({ detail: "Notification not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }),
];
