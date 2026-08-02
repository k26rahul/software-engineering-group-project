import { http, HttpResponse } from "msw";
import { baseURL } from "@/lib/api";
import { readingLists } from "@/mocks/data/readingListsData";

export const readingListsHandlers = [
  // GET /reading-lists
  http.get(`${baseURL}/reading-lists`, async () => {
    return HttpResponse.json(readingLists);
  }),
];
