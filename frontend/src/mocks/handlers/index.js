import { authHandlers } from "./authHandlers";
import { memberHandlers } from "./memberHandlers";

export const handlers = [...authHandlers, ...memberHandlers];
