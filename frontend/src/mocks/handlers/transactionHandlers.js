import { http, HttpResponse } from "msw";
import { baseURL } from "@/lib/api";
import { activeTransactions, budgetEntries } from "@/mocks/data/transactionsData";
import { membersList } from "@/mocks/data/usersData";
import { books as mockBooks } from "@/mocks/data/booksData";
import { librarianDashboardMockData } from "@/mocks/data/dashboardsData";

// Mutable in-memory copies
let transactionsDB = structuredClone(activeTransactions);
let budgetDB = structuredClone(budgetEntries);
let nextTransactionId = 2000;

export const transactionHandlers = [
  // GET /transactions/active - all currently issued books
  http.get(`${baseURL}/transactions/active`, ({ request }) => {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.toLowerCase() || "";

    let result = transactionsDB;
    if (search) {
      result = result.filter(
        (t) =>
          t.member_name.toLowerCase().includes(search) ||
          t.book_title.toLowerCase().includes(search) ||
          t.member_email.toLowerCase().includes(search) ||
          String(t.transaction_id).includes(search)
      );
    }
    return HttpResponse.json(result);
  }),

  // POST /transactions/issue - issue a book copy to a member
  http.post(`${baseURL}/transactions/issue`, async ({ request }) => {
    const { member_id, book_id, copy_id } = await request.json();

    const member = membersList.find((m) => m.id === member_id);
    const book = mockBooks.find((b) => b.id === book_id);
    const copy = book?.copies.find((c) => c.id === copy_id);

    if (!member || !book || !copy) {
      return HttpResponse.json({ detail: "Member, book, or copy not found." }, { status: 404 });
    }
    if (copy.status !== "AVAILABLE") {
      return HttpResponse.json({ detail: "This copy is not available." }, { status: 409 });
    }

    // Mark copy as issued in the mock books
    copy.status = "ISSUED";
    book.available_copies = Math.max(0, book.available_copies - 1);

    const issueDate = new Date().toISOString().split("T")[0];
    const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const transaction = {
      transaction_id: nextTransactionId++,
      member_id: member.id,
      member_name: member.name,
      member_email: member.email,
      book_id: book.id,
      book_title: book.title,
      copy_id: copy.id,
      copy_number: copy.copy_number,
      issue_date: issueDate,
      due_date: dueDate,
      is_overdue: false,
      days_overdue: 0,
      fine_amount: 0,
    };

    transactionsDB.push(transaction);
    return HttpResponse.json(transaction, { status: 201 });
  }),

  // PATCH /transactions/:id/return - process a book return
  http.patch(`${baseURL}/transactions/:id/return`, ({ params }) => {
    const id = parseInt(params.id);
    const txIdx = transactionsDB.findIndex((t) => t.transaction_id === id);

    if (txIdx === -1) {
      return HttpResponse.json({ detail: "Transaction not found." }, { status: 404 });
    }

    const tx = transactionsDB[txIdx];

    // Mark the copy available again in mock books
    const book = mockBooks.find((b) => b.id === tx.book_id);
    if (book) {
      const copy = book.copies.find((c) => c.id === tx.copy_id);
      if (copy) {
        copy.status = "AVAILABLE";
        book.available_copies += 1;
      }
    }

    // Remove from active transactions
    transactionsDB.splice(txIdx, 1);

    return HttpResponse.json({
      detail: "Book returned successfully.",
      fine_amount: tx.fine_amount,
    });
  }),

  // GET /budget - budget summary + line items
  http.get(`${baseURL}/budget`, () => {
    const totalExpenses = budgetDB
      .filter((e) => e.type === "EXPENSE")
      .reduce((s, e) => s + e.amount, 0);
    const totalIncome = budgetDB
      .filter((e) => e.type === "INCOME")
      .reduce((s, e) => s + e.amount, 0);

    return HttpResponse.json({
      budget_limit: librarianDashboardMockData.budget_limit,
      budget_spent: totalExpenses - totalIncome,
      total_expenses: totalExpenses,
      total_income: totalIncome,
      entries: budgetDB,
    });
  }),

  // POST /budget/entries - add a budget entry
  http.post(`${baseURL}/budget/entries`, async ({ request }) => {
    const body = await request.json();
    const newEntry = {
      id: budgetDB.length + 100,
      ...body,
      date: new Date().toISOString().split("T")[0],
    };
    budgetDB.push(newEntry);
    return HttpResponse.json(newEntry, { status: 201 });
  }),
];
