import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { SectionHeader, Field, Card, Msg, EmptyState, Th, Td, Stamp, inputCls, Pagination } from "../../components/ui/UI.jsx";
import { fmt, todayStr } from "../../utils/helpers.js";

const PAGE_SIZE = 8;
const ROOM_URL = "https://library-system-3x9t.onrender.com/room/";
const STUDYROOM_URL = "https://library-system-3x9t.onrender.com/studyroom/";
const MEMBER_URL = "https://library-system-3x9t.onrender.com/member/";

export default function StudyRoom() {
  const [rooms, setRooms] = useState([]);
  const [members, setMembers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // Forms
  const [roomForm, setRoomForm] = useState({ roomNo: "" });
  const [bookForm, setBookForm] = useState({ memberId: "", roomId: "", date: todayStr(), time: "" });

  // Messages
  const [roomMsg, setRoomMsg] = useState("");
  const [bookMsg, setBookMsg] = useState("");

  // Pagination
  const [page, setPage] = useState(1);

  const fetchRooms = async () => {
    try {
      const res = await fetch(ROOM_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRooms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load rooms:", err);
      setApiError(`Failed to load rooms: ${err.message}`);
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

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(STUDYROOM_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
      setApiError("");
    } catch (err) {
      setApiError(`Failed to load study room bookings: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchMembers();
    fetchBookings();
  }, []);

  // ---------- Room management ----------
  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!roomForm.roomNo.trim()) {
      setRoomMsg("error:Room number is required.");
      return;
    }
    try {
      const res = await fetch(ROOM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_no: roomForm.roomNo.trim() }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setRoomMsg(`error:${JSON.stringify(errData)}`);
        return;
      }
      setRoomForm({ roomNo: "" });
      setRoomMsg("ok:Room added successfully.");
      setTimeout(() => setRoomMsg(""), 3000);
      fetchRooms();
    } catch (err) {
      setRoomMsg(`error:${err.message}`);
    }
  };

  const handleDeleteRoom = async (room) => {
    if (!window.confirm(`Delete room "${room.room_no}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${ROOM_URL}${room.id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setRoomMsg("ok:Room deleted successfully.");
      setTimeout(() => setRoomMsg(""), 3000);
      fetchRooms();
      fetchBookings();
    } catch (err) {
      setRoomMsg(`error:${err.message}`);
    }
  };

  // ---------- Book a room ----------
  const handleBookRoom = async (e) => {
    e.preventDefault();
    if (!bookForm.memberId || !bookForm.roomId || !bookForm.date || !bookForm.time) {
      setBookMsg("error:Fill in all fields.");
      return;
    }
    try {
      const res = await fetch(STUDYROOM_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          member_name_post: Number(bookForm.memberId),
          room_no_post: Number(bookForm.roomId),
          date: bookForm.date,
          time: bookForm.time,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setBookMsg(`error:${JSON.stringify(errData)}`);
        return;
      }
      setBookForm({ memberId: "", roomId: "", date: todayStr(), time: "" });
      setBookMsg("ok:Study room booked successfully.");
      setTimeout(() => setBookMsg(""), 3000);
      setPage(1);
      fetchBookings();
    } catch (err) {
      setBookMsg(`error:${err.message}`);
    }
  };

  const totalPages = Math.max(1, Math.ceil(bookings.length / PAGE_SIZE));
  const paged = bookings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section>
      <SectionHeader eyebrow="Facilities · 01" title="Study Room" subtitle="Manage study rooms and reserve a room for a member." />

      {/* ---------- Manage Rooms ---------- */}
      <SectionHeader eyebrow="Facilities · 02" title="Manage Rooms" subtitle="Add new rooms or remove existing ones." />
      <Card className="p-7 lg:p-9 mb-8">
        <Msg value={roomMsg} />
        <form onSubmit={handleAddRoom} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end">
          <Field label="Room Number" required>
            <input
              required
              className={inputCls}
              placeholder="e.g. 103"
              value={roomForm.roomNo}
              onChange={(e) => setRoomForm({ roomNo: e.target.value })}
            />
          </Field>
          <div className="pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-gold to-gold-light text-ink text-sm font-semibold tracking-wide px-6 py-2.5 rounded-lg shadow-[0_4px_14px_-4px_rgba(176,138,66,0.5)] hover:shadow-[0_6px_18px_-4px_rgba(176,138,66,0.6)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 transition-all duration-150"
            >
              <Plus size={15} /> Add Room
            </button>
          </div>
        </form>

        <div className="overflow-x-auto mt-6">
          {rooms.length === 0 ? (
            <EmptyState text="No rooms yet. Add your first room above." />
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <Th>Room Number</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr key={r.id} className="hover:bg-gold/[0.04]">
                    <Td mono>{r.room_no}</Td>
                    <Td>
                      <button
                        onClick={() => handleDeleteRoom(r)}
                        className="p-1.5 rounded-md border border-ink/12 text-ink/50 hover:text-rust hover:border-rust/40 transition-colors focus:outline-none focus:ring-2 focus:ring-rust/30"
                        aria-label={`Delete room ${r.room_no}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* ---------- Book a Room ---------- */}
      <SectionHeader eyebrow="Facilities · 03" title="Book a Room" subtitle="Reserve a study room for a member." />
      <Card className="p-7 lg:p-9 mb-8">
        <Msg value={bookMsg} />
        {members.length === 0 || rooms.length === 0 ? (
          <EmptyState text="Add at least one member and one room before booking." />
        ) : (
          <form onSubmit={handleBookRoom} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Field label="Member" required>
              <select required className={inputCls} value={bookForm.memberId} onChange={(e) => setBookForm({ ...bookForm, memberId: e.target.value })}>
                <option value="">Select member</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>{m.Member_name} ({m.member_id})</option>
                ))}
              </select>
            </Field>
            <Field label="Room" required>
              <select required className={inputCls} value={bookForm.roomId} onChange={(e) => setBookForm({ ...bookForm, roomId: e.target.value })}>
                <option value="">Select room</option>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>Room {r.room_no}</option>
                ))}
              </select>
            </Field>
            <Field label="Date" required>
              <input required type="date" className={inputCls} value={bookForm.date} onChange={(e) => setBookForm({ ...bookForm, date: e.target.value })} />
            </Field>
            <Field label="Time" required>
              <input required type="time" className={inputCls} value={bookForm.time} onChange={(e) => setBookForm({ ...bookForm, time: e.target.value })} />
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
        )}
      </Card>

      {/* ---------- Current Bookings ---------- */}
      <SectionHeader eyebrow="Facilities · 04" title="Current Bookings" subtitle="Bookings fetched from the study room API." />
      <Card className="overflow-x-auto">
        {loading ? (
          <EmptyState text="Loading bookings..." />
        ) : apiError ? (
          <EmptyState text={apiError} />
        ) : paged.length === 0 ? (
          <EmptyState text="No bookings yet." />
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <Th>Room</Th>
                <Th>Member</Th>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {paged.map((b) => (
                <tr key={b.id} className="hover:bg-gold/[0.04]">
                  <Td mono>{b.room_no?.room_no ?? "—"}</Td>
                  <Td>{b.member_name?.Member_name ?? "—"}</Td>
                  <Td mono>{fmt(b.date)}</Td>
                  <Td mono>{b.time}</Td>
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