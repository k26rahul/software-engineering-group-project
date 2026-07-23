import { authHandlers } from "./authHandlers";
import { memberHandlers } from "./memberHandlers";
import { catalogHandlers } from "./catalogHandlers";
export const handlers = [...authHandlers, ...memberHandlers, ...catalogHandlers];
