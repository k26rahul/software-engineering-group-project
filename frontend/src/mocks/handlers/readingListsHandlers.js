import { http, HttpResponse } from "msw";
import { baseURL } from "@/lib/api";
import { readingLists } from "@/mocks/data/readingListsData";

export const readingListsHandlers = [
  // GET /reading-lists - Response: list[reading_list/ReadingListResponse]
  http.get(`${baseURL}/reading-lists`, () => {
    return HttpResponse.json(readingLists);
  }),
];
