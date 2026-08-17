import { useEffect, useState } from "react";
import { SectionHeader, Card, EmptyState, Th, Td, Stamp, Pagination, Msg } from "../../components/ui/UI.jsx";
import { fmt, todayStr } from "../../utils/helpers.js";

const PAGE_SIZE = 8;
const API_URL = "https://library-system-3x9t.onrender.com/issuebook/";
const BOOK_URL = "https://library-system-3x9t.onrender.com/book/";

export default function ReturnBook() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState(1);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      // API does not expose `id` in the list response.
      // Django orders records by PK ascending, so id = index + 1.
      setIssues(Array.isArray(data) ? data.map((rec, i) => ({ ...rec, id: i + 1 })) : []);
      setApiError("");
    } catch (err) {
      setApiError(`Failed to load issue records: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const currentlyIssued = issues.filter((i) => !i.is_returned);
  const totalPages = Math.max(1, Math.ceil(currentlyIssued.length / PAGE_SIZE));
  const paged = currentlyIssued.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusOf = (rec) => {
    if (rec.is_returned) return "Returned";
    return rec.due_date < todayStr() ? "Overdue" : "Issued";
  };

  const handleReturn = async (rec) => {
    try {
      // 1. Mark the issue record as returned
      const res = await fetch(`${API_URL}${rec.id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_returned: true, return_date: todayStr() }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setMsg(`error:${JSON.stringify(errData)}`);
        return;
      }

      // 2. Increment the book quantity back into the database
      const bookNumber = rec.book.book_number;
      const bookRes = await fetch(`${BOOK_URL}${bookNumber}/`);
      const bookData = await bookRes.json();
      const newQuantity = (Number(bookData.book_quantity) || 0) + 1;
      await fetch(`${BOOK_URL}${bookNumber}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_quantity: newQuantity }),
      });

      setMsg("ok:Book returned successfully.");
      setTimeout(() => setMsg(""), 3000);
      fetchIssues();
      if (paged.length === 1 && page > 1) setPage(page - 1);
    } catch (err) {
      setMsg(`error:${err.message}`);
    }
  };

  return (
    <section>
      <SectionHeader eyebrow="Circulation · 02" title="Return Book" subtitle="Currently issued books awaiting return." />
      <Card className="overflow-x-auto">
        <div className="px-5 pt-5">
          <Msg value={msg} />
        </div>
        {loading ? (
          <EmptyState text="Loading issue records..." />
        ) : apiError ? (
          <EmptyState text={apiError} />
        ) : paged.length === 0 ? (
          <EmptyState text="No books are currently issued." />
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <Th>Member</Th>
                <Th>Book</Th>
                <Th>Issue Date</Th>
                <Th>Due Date</Th>
                <Th>Status</Th>
                <Th>Action</Th>
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
                  <Td><Stamp status={statusOf(rec)} /></Td>
                  <Td>
                    <button
                      onClick={() => handleReturn(rec)}
                      className="text-xs font-medium bg-sage hover:bg-sage/85 text-white px-3.5 py-1.5 rounded-md shadow-sm hover:-translate-y-0.5 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:ring-offset-1"
                    >
                      Mark Returned
                    </button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </Card>
    </section>
  );
}