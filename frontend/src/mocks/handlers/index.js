import { authHandlers } from "./authHandlers";
import { dashboardHandlers } from "./dashboardHandlers";
import { notificationHandlers } from "./notificationHandlers";
import { memberHandlers } from "./memberHandlers";
import { catalogHandlers } from "./catalogHandlers";
import { transactionHandlers } from "./transactionHandlers";

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...notificationHandlers,
  ...memberHandlers,
  ...catalogHandlers,
  ...transactionHandlers,
];
