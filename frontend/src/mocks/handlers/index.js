import { authHandlers } from "./authHandlers";
import { dashboardHandlers } from "./dashboardHandlers";
import { notificationsHandlers } from "./notificationsHandlers";
import { membersHandlers } from "./membersHandlers";
import { booksHandlers } from "./booksHandlers";
import { transactionsHandlers } from "./transactionsHandlers";
import { reportsHandlers } from "./reportsHandlers";

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...notificationsHandlers,
  ...membersHandlers,
  ...booksHandlers,
  ...transactionsHandlers,
  ...reportsHandlers,
];
