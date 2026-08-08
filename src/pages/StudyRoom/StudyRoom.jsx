import { useState } from "react";
import { useLibrary } from "../../context/LibraryContext.jsx";
import { SectionHeader, Field, Card, Msg, EmptyState, Th, Td, Stamp, inputCls, Pagination } from "../../components/ui/UI.jsx";
import { fmt } from "../../utils/helpers.js";

const PAGE_SIZE = 6;

export default function StudyRoom() {
  const { rooms, members, bookings, bookRoom, todayStr } = useLibrary();
  const EMPTY = { roomId: "", memberId: "", date: todayStr(), slot: "" };
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState("");
  const [page, setPage] = useState(1);

  const sortedBookings = bookings.slice().reverse();
  const totalPages = Math.max(1, Math.ceil(sortedBookings.length / PAGE_SIZE));
  const paged = sortedBookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const submit = (e) => {
    e.preventDefault();
    const result = bookRoom(form);
    if (!result.ok) {
      setMsg(`error:${result.message}`);
      return;
    }
    setForm({ roomId: "", memberId: "", date: todayStr(), slot: "" });
    setMsg(`ok:${result.message}`);
    setPage(1);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <section>
      <SectionHeader eyebrow="Facilities · 01" title="Study Room" subtitle="Reserve a study room for a member." />

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {rooms.map((r) => (
          <Card key={r.id} className="p-4">
            <p className="text-sm text-ink/35 uppercase tracking-wide" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Capacity {r.capacity}
            </p>
            <p className="text-lg text-ink mt-1" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
              {r.roomNo}
            </p>
          </Card>
        ))}
      </div>

      <Card className="p-7 lg:p-9 mb-8">
        <Msg value={msg} />
        <form onSubmit={submit} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Field label="Room" required>
            <select required className={inputCls} value={form.roomId} onChange={(e) => setForm({ ...form, roomId: e.target.value })}>
              <option value="">Select room</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>{r.roomNo} (cap. {r.capacity})</option>
              ))}
            </select>
          </Field>
          <Field label="Member" required>
            <select required className={inputCls} value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })}>
              <option value="">Select member</option>
              {members.map((m) => (
                <option key={m.id} value={m.memberId}>{m.memberName} ({m.memberId})</option>
              ))}
            </select>
          </Field>
          <Field label="Date" required>
            <input required type="date" className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Field>
          <Field label="Time Slot" required>
            <input required className={inputCls} placeholder="e.g. 10:00 - 12:00" value={form.slot} onChange={(e) => setForm({ ...form, slot: e.target.value })} />
          </Field>
          <div className="sm:col-span-2 lg:col-span-4 pt-2">
            <button
              type="submit"
              className="bg-gradient-to-r from-gold to-gold-light text-ink text-sm font-semibold tracking-wide px-6 py-2.5 rounded-lg shadow-[0_4px_14px_-4px_rgba(176,138,66,0.5)] hover:shadow-[0_6px_18px_-4px_rgba(176,138,66,0.6)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 transition-all duration-150"
            >
              Book Room
            </button>
          </div>
        </form>
      </Card>

      <SectionHeader eyebrow="Facilities · 02" title="Current Bookings" />
      <Card className="overflow-x-auto">
        {paged.length === 0 ? (
          <EmptyState text="No bookings yet." />
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <Th>Room</Th>
                <Th>Member</Th>
                <Th>Date</Th>
                <Th>Slot</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {paged.map((b) => (
                <tr key={b.id} className="hover:bg-gold/[0.04]">
                  <Td>{b.roomNo}</Td>
                  <Td>{b.memberName}</Td>
                  <Td mono>{fmt(b.date)}</Td>
                  <Td mono>{b.slot}</Td>
                  <Td><Stamp status="Booked" /></Td>
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
