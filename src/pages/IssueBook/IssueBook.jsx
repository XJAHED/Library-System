import { useState } from "react";
import { useLibrary } from "../../context/LibraryContext.jsx";
import { SectionHeader, Field, Card, Msg, EmptyState, inputCls } from "../../components/ui/UI.jsx";

export default function IssueBook() {
  const { members, books, issueBook, todayStr, addDays } = useLibrary();
  const availableBooks = books.filter((b) => b.quantity > 0);
  const EMPTY = { memberId: "", bookId: "", issueDate: todayStr(), dueDate: addDays(todayStr(), 14) };
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const result = issueBook(form);
    if (!result.ok) {
      setMsg(`error:${result.message}`);
      return;
    }
    setForm({ memberId: "", bookId: "", issueDate: todayStr(), dueDate: addDays(todayStr(), 14) });
    setMsg(`ok:${result.message}`);
    setTimeout(() => setMsg(""), 3000);
  };

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
              <select required className={inputCls} value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })}>
                <option value="">Select member</option>
                {members.map((m) => (
                  <option key={m.id} value={m.memberId}>{m.memberName} ({m.memberId})</option>
                ))}
              </select>
            </Field>
            <Field label="Book" required>
              <select required className={inputCls} value={form.bookId} onChange={(e) => setForm({ ...form, bookId: e.target.value })}>
                <option value="">Select book</option>
                {availableBooks.map((b) => (
                  <option key={b.id} value={b.id}>{b.title} ({b.quantity} available)</option>
                ))}
              </select>
            </Field>
            <Field label="Issue Date" required>
              <input required type="date" className={inputCls} value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} />
            </Field>
            <Field label="Due Date" required>
              <input required type="date" className={inputCls} value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            </Field>
            <div className="sm:col-span-2 lg:col-span-4 pt-2">
              <button type="submit" className="bg-gradient-to-r from-gold to-gold-light text-ink text-sm font-semibold tracking-wide px-6 py-2.5 rounded-lg shadow-[0_4px_14px_-4px_rgba(176,138,66,0.5)] hover:shadow-[0_6px_18px_-4px_rgba(176,138,66,0.6)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 transition-all duration-150">
                Issue Book
              </button>
            </div>
          </form>
        )}
      </Card>
    </section>
  );
}
