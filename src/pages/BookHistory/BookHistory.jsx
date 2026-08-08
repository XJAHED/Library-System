import { useState } from "react";
import { useLibrary } from "../../context/LibraryContext.jsx";
import { SectionHeader, Card, EmptyState, Th, Td, Stamp, Pagination } from "../../components/ui/UI.jsx";
import { fmt } from "../../utils/helpers.js";

const FILTERS = ["All", "Issued", "Returned", "Overdue"];
const PAGE_SIZE = 8;

export default function BookHistory() {
  const { issues, issueStatus } = useLibrary();
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const rows = issues.filter((i) => filter === "All" || issueStatus(i) === filter).slice().reverse();
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
        {paged.length === 0 ? (
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
              {paged.map((i) => (
                <tr key={i.id} className="hover:bg-gold/[0.04]">
                  <Td>{i.memberName}</Td>
                  <Td>{i.bookTitle}</Td>
                  <Td mono>{fmt(i.issueDate)}</Td>
                  <Td mono>{fmt(i.dueDate)}</Td>
                  <Td mono>{i.returnDate ? fmt(i.returnDate) : "—"}</Td>
                  <Td><Stamp status={issueStatus(i)} /></Td>
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
