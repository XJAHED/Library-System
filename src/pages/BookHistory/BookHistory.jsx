import { useEffect, useState } from "react";
import { SectionHeader, Card, EmptyState, Th, Td, Stamp, Pagination } from "../../components/ui/UI.jsx";
import { fmt, todayStr } from "../../utils/helpers.js";

const FILTERS = ["All", "Issued", "Returned", "Overdue"];
const PAGE_SIZE = 8;
const API_URL = "https://library-system-3x9t.onrender.com/issuebook/";

export default function BookHistory() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [filter, setFilter] = useState("All");
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

  const statusOf = (rec) => {
    if (rec.is_returned) return "Returned";
    return rec.due_date < todayStr() ? "Overdue" : "Issued";
  };

  const rows = issues
    .filter((i) => filter === "All" || statusOf(i) === filter)
    .slice()
    .reverse();
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilter = (s) => {
    setFilter(s);
    setPage(1);
  };

  return (
    <section>
      <SectionHeader eyebrow="Circulation · 03" title="Book History" subtitle="Full record of every issue and return." />
      <div className="mb-4 flex gap-2 flex-wrap">
        {FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => handleFilter(s)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border focus:outline-none focus:ring-2 focus:ring-gold/40 ${
              filter === s ? "bg-ink text-white border-ink" : "bg-white text-ink/60 border-ink/15 hover:bg-paper"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <Card className="overflow-x-auto">
        {loading ? (
          <EmptyState text="Loading issue records..." />
        ) : apiError ? (
          <EmptyState text={apiError} />
        ) : paged.length === 0 ? (
          <EmptyState text="No history yet." />
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
    </section>
  );
}