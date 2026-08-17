import { useEffect, useState } from "react";
import { SectionHeader, Field, Card, Msg, EmptyState, inputCls, Th, Td, Stamp, Pagination } from "../../components/ui/UI.jsx";
import { fmt, todayStr, addDays } from "../../utils/helpers.js";

const PAGE_SIZE = 8;
const API_URL = "https://library-system-3x9t.onrender.com/issuebook/";
const MEMBER_URL = "https://library-system-3x9t.onrender.com/member/";
const BOOK_URL = "https://library-system-3x9t.onrender.com/book/";

export default function IssueBook() {
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ member: "", book: "", issue_date: todayStr(), due_date: addDays(todayStr(), 14) });
  const [msg, setMsg] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [page, setPage] = useState(1);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRecords(Array.isArray(data) ? data : []);
      setApiError("");
    } catch (err) {
      setApiError(`Failed to load issue records: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch(MEMBER_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load members:", err);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await fetch(BOOK_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load books:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchMembers();
    fetchBooks();
  }, []);

  const availableBooks = books.filter((b) => b.book_quantity > 0);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.member || !form.book) {
      setMsg("error:Select a member and a book.");
      return;
    }
    try {
      const bookNumber = Number(form.book);
      const selectedBook = books.find((b) => b.book_number === bookNumber);
      if (!selectedBook) {
        setMsg("error:Selected book not found.");
        return;
      }

      // 1. Create the issue record
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_post: Number(form.member),
          book_post: bookNumber,
          issue_date: form.issue_date,
          due_date: form.due_date,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setMsg(`error:${JSON.stringify(errData)}`);
        return;
      }

      // 2. Decrement the book quantity by 1
      const newQuantity = Math.max(0, selectedBook.book_quantity - 1);
      await fetch(`${BOOK_URL}${bookNumber}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_quantity: newQuantity }),
      });

      setForm({ member: "", book: "", issue_date: todayStr(), due_date: addDays(todayStr(), 14) });
      setMsg("ok:Book issued successfully.");
      setTimeout(() => setMsg(""), 3000);
      fetchRecords();
      fetchBooks();
    } catch (err) {
      setMsg(`error:${err.message}`);
    }
  };

  const statusOf = (rec) => {
    if (rec.is_returned) return "Returned";
    return rec.due_date < todayStr() ? "Overdue" : "Issued";
  };

  const totalPages = Math.max(1, Math.ceil(records.length / PAGE_SIZE));
  const paged = records.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section>
      <SectionHeader eyebrow="Circulation · 01" title="Issue Book" subtitle="Issue a book to a registered member." />
      <Card className="p-7 lg:p-9">
        <Msg value={msg} />
        {members.length === 0 || availableBooks.length === 0 ? (
          <EmptyState text="Add at least one member and one available book before issuing." />
        ) : (
          <form onSubmit={submit} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Field label="Member" required>
              <select required className={inputCls} value={form.member} onChange={(e) => setForm({ ...form, member: e.target.value })}>
                <option value="">Select member</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.Member_name} ({m.member_id})</option>
                ))}
              </select>
            </Field>
            <Field label="Book" required>
              <select required className={inputCls} value={form.book} onChange={(e) => setForm({ ...form, book: e.target.value })}>
                <option value="">Select book</option>
                {availableBooks.map((b) => (
                  <option key={b.book_number} value={b.book_number}>{b.book_name} ({b.book_quantity} available)</option>
                ))}
              </select>
            </Field>
            <Field label="Issue Date" required>
              <input required type="date" className={inputCls} value={form.issue_date} onChange={(e) => setForm({ ...form, issue_date: e.target.value })} />
            </Field>
            <Field label="Due Date" required>
              <input required type="date" className={inputCls} value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
            </Field>
            <div className="sm:col-span-2 lg:col-span-4 pt-2">
              <button type="submit" className="bg-gradient-to-r from-gold to-gold-light text-ink text-sm font-semibold tracking-wide px-6 py-2.5 rounded-lg shadow-[0_4px_14px_-4px_rgba(176,138,66,0.5)] hover:shadow-[0_6px_18px_-4px_rgba(176,138,66,0.6)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 transition-all duration-150">
                Issue Book
              </button>
            </div>
          </form>
        )}
      </Card>

      <div className="mt-8">
        <SectionHeader eyebrow="Circulation · API" title="Issue Records" subtitle="Records fetched from the issue book API." />
        <Card className="overflow-x-auto">
          {loading ? (
            <EmptyState text="Loading issue records..." />
          ) : apiError ? (
            <EmptyState text={apiError} />
          ) : paged.length === 0 ? (
            <EmptyState text="No issue records found." />
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <Th>Member</Th>
                  <Th>Book</Th>
                  <Th>Issue Date</Th>
                  <Th>Due Date</Th>
                  <Th>Return Date</Th>
                  <Th>Status</Th>
                </tr>
              </thead>
              <tbody>
                {paged.map((rec) => (
                  <tr key={rec.id} className="hover:bg-gold/[0.04]">
                    <Td>
                      {rec.member.Member_name}{" "}
                      <span className="text-ink/35" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        ({rec.member.member_id})
                      </span>
                    </Td>
                    <Td>
                      {rec.book.book_name}{" "}
                      <span className="text-ink/35" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                        (ISBN: {rec.book.isbn_number})
                      </span>
                    </Td>
                    <Td mono>{fmt(rec.issue_date)}</Td>
                    <Td mono>{fmt(rec.due_date)}</Td>
                    <Td mono>{rec.return_date ? fmt(rec.return_date) : "—"}</Td>
                    <Td><Stamp status={statusOf(rec)} /></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </Card>
      </div>
    </section>
  );
}