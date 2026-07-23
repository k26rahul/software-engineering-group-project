import { authHandlers } from "./authHandlers";
import { dashboardHandlers } from "./dashboardHandlers";
import { notificationHandlers } from "./notificationHandlers";
import { memberHandlers } from "./memberHandlers";
import { catalogHandlers } from "./catalogHandlers";
import { transactionHandlers } from "./transactionHandlers";
import { reportsHandlers } from "./reportsHandlers";

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...notificationHandlers,
  ...memberHandlers,
  ...catalogHandlers,
  ...transactionHandlers,
  ...reportsHandlers,
];
