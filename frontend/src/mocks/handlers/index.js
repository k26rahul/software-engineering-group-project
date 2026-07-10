import { authHandlers } from "./authHandlers";
import { catalogHandlers } from "./catalogHandlers";

export const handlers = [...authHandlers, ...catalogHandlers];
