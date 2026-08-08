import { useState } from "react";
import { Search, Users } from "lucide-react";
import { useLibrary } from "../../context/LibraryContext.jsx";
import { SectionHeader, Card, EmptyState, Th, Td, inputCls, Pagination } from "../../components/ui/UI.jsx";

const PAGE_SIZE = 6;

const fmtDateTime = (iso) =>
  new Date(iso).toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default function EmailHistory() {
  const { emails } = useLibrary();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = emails
    .filter((e) => [e.to, e.subject].join(" ").toLowerCase().includes(search.toLowerCase()))
    .slice()
    .reverse();
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (v) => {
    setSearch(v);
    setPage(1);
  };

  return (
    <section>
      <SectionHeader eyebrow="Communication · 02" title="Email History" subtitle={`${emails.length} email(s) sent.`} />
      <div className="mb-4 relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
        <input className={`${inputCls} pl-9`} placeholder="Search by recipient or subject" value={search} onChange={(e) => handleSearch(e.target.value)} />
      </div>
      <Card className="overflow-x-auto">
        {paged.length === 0 ? (
          <EmptyState text="No emails sent yet." />
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <Th>To</Th>
                <Th>Subject</Th>
                <Th>Message</Th>
                <Th>Recipients</Th>
                <Th>Sent At</Th>
              </tr>
            </thead>
            <tbody>
              {paged.map((e) => (
                <tr key={e.id} className="hover:bg-gold/[0.04] align-top">
                  <Td><span className="font-medium text-ink">{e.to}</span></Td>
                  <Td>{e.subject}</Td>
                  <Td>
                    <span className="text-ink/55 line-clamp-2 block max-w-xs">{e.body}</span>
                  </Td>
                  <Td>
                    <span className="inline-flex items-center gap-1.5 text-ink/60">
                      <Users size={12} /> {e.recipientCount}
                    </span>
                  </Td>
                  <Td mono>{fmtDateTime(e.sentAt)}</Td>
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
