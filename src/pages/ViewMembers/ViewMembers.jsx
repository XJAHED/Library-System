import { useEffect, useState } from "react";
import { Search, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeader, Card, EmptyState, Th, Td, inputCls, Pagination, Avatar } from "../../components/ui/UI.jsx";
import axios from "axios";

const PAGE_SIZE = 6;

export default function ViewMembers() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const getMembers = async () => {
    try {
      const response = await axios.get("https://library-system-3x9t.onrender.com/member/");
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

  const filtered = members.filter((m) =>
    [m.Member_name, m.member_id, m.department].join(" ").toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (v) => {
    setSearch(v);
    setPage(1);
  };

  const handleDelete = async (m) => {
    if (window.confirm(`Delete member "${m.Member_name}"? This cannot be undone.`)) {
      try {
        await axios.delete(`https://library-system-3x9t.onrender.com/member/${m.id}/`);
        setMembers(members.filter((member) => member.id !== m.id));
        if (paged.length === 1 && page > 1) setPage(page - 1);
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  return (
    <section>
      <SectionHeader eyebrow="Membership · 02" title="View Members" subtitle={`${members.length} member(s) on record.`} />
      <div className="mb-4 relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
        <input className={`${inputCls} pl-9`} placeholder="Search by name, ID or department" value={search} onChange={(e) => handleSearch(e.target.value)} />
      </div>
      <Card className="overflow-x-auto">
        {loading ? (
          <EmptyState text="Loading members..." />
        ) : paged.length === 0 ? (
          <EmptyState text="No members found." />
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Member ID</Th>
                <Th>Position</Th>
                <Th>Department</Th>
                <Th>Batch</Th>
                <Th>Contact</Th>
                <Th>Email</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {paged.map((m) => (
                <tr key={m.id} className="hover:bg-gold/[0.04]">
                  <Td>{m.Member_name}</Td>
                  <Td mono>{m.member_id}</Td>
                  <Td>{m.postion}</Td>
                  <Td>{m.department}</Td>
                  <Td>{m.batch}</Td>
                  <Td mono>{m.contact_no}</Td>
                  <Td>{m.email}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/edit-member/${m.id}`}
                        className="p-1.5 rounded-md border border-ink/12 text-ink/50 hover:text-gold hover:border-gold/40 transition-colors focus:outline-none focus:ring-2 focus:ring-gold/40"
                        aria-label="Edit member"
                      >
                        <Pencil size={13} />
                      </Link>
                      <button
                        onClick={() => handleDelete(m)}
                        className="p-1.5 rounded-md border border-ink/12 text-ink/50 hover:text-rust hover:border-rust/40 transition-colors focus:outline-none focus:ring-2 focus:ring-rust/30"
                        aria-label="Delete member"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
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