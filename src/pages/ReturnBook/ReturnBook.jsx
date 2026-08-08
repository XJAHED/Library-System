import { useState } from "react";
import { useLibrary } from "../../context/LibraryContext.jsx";
import { SectionHeader, Card, EmptyState, Th, Td, Stamp, Pagination } from "../../components/ui/UI.jsx";
import { fmt } from "../../utils/helpers.js";

const PAGE_SIZE = 8;

export default function ReturnBook() {
  const { issues, issueStatus, returnBook } = useLibrary();
  const [page, setPage] = useState(1);

  const currentlyIssued = issues.filter((i) => !i.returnDate);
  const totalPages = Math.max(1, Math.ceil(currentlyIssued.length / PAGE_SIZE));
  const paged = currentlyIssued.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleReturn = (id) => {
    returnBook(id);
    if (paged.length === 1 && page > 1) setPage(page - 1);
  };

  return (
    <section>
      <SectionHeader eyebrow="Circulation · 02" title="Return Book" subtitle="Currently issued books awaiting return." />
      <Card className="overflow-x-auto">
        {paged.length === 0 ? (
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
              {paged.map((i) => (
                <tr key={i.id} className="hover:bg-gold/[0.04]">
                  <Td>
                    {i.memberName} <span className="text-ink/35" style={{ fontFamily: "'JetBrains Mono', monospace" }}>({i.memberId})</span>
                  </Td>
                  <Td>{i.bookTitle}</Td>
                  <Td mono>{fmt(i.issueDate)}</Td>
                  <Td mono>{fmt(i.dueDate)}</Td>
                  <Td><Stamp status={issueStatus(i)} /></Td>
                  <Td>
                    <button
                      onClick={() => handleReturn(i.id)}
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
