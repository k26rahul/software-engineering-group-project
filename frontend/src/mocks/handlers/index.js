import { authHandlers } from "./authHandlers";
import { dashboardHandlers } from "./dashboardHandlers";
import { notificationHandlers } from "./notificationHandlers";
import { memberHandlers } from "./memberHandlers";

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...notificationHandlers,
  ...memberHandlers,
];
