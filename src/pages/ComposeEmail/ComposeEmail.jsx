import { useState } from "react";
import { Send } from "lucide-react";
import { useLibrary } from "../../context/LibraryContext.jsx";
import { SectionHeader, Field, Card, Msg, inputCls } from "../../components/ui/UI.jsx";

const EMPTY = { recipientType: "individual", memberId: "", subject: "", body: "" };

const RECIPIENT_OPTIONS = [
  { value: "individual", label: "Individual Member" },
  { value: "students", label: "All Students" },
  { value: "faculty", label: "All Faculty" },
  { value: "all", label: "All Members" },
];

export default function ComposeEmail() {
  const { members, sendEmail } = useLibrary();
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const result = sendEmail(form);
    if (!result.ok) {
      setMsg(`error:${result.message}`);
      return;
    }
    setForm({ ...EMPTY, recipientType: form.recipientType });
    setMsg(`ok:${result.message}`);
    setTimeout(() => setMsg(""), 4000);
  };

  return (
    <section>
      <SectionHeader eyebrow="Communication · 01" title="Compose Email" subtitle="Send an email to members, students or faculty." />
      <Card className="p-7 lg:p-9">
        <Msg value={msg} />
        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-6">
          <Field label="Recipient" required>
            <select
              required
              className={inputCls}
              value={form.recipientType}
              onChange={(e) => setForm({ ...form, recipientType: e.target.value, memberId: "" })}
            >
              {RECIPIENT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </Field>

          {form.recipientType === "individual" && (
            <Field label="Select Member" required>
              <select required className={inputCls} value={form.memberId} onChange={(e) => setForm({ ...form, memberId: e.target.value })}>
                <option value="">Select member</option>
                {members.map((m) => (
                  <option key={m.id} value={m.memberId}>{m.memberName} — {m.email}</option>
                ))}
              </select>
            </Field>
          )}

          <div className="sm:col-span-2">
            <Field label="Subject" required>
              <input required className={inputCls} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Library re-opening hours" />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Message" required>
              <textarea required rows={8} className={inputCls} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Write your message here…" />
            </Field>
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-gold to-gold-light text-ink text-sm font-semibold tracking-wide px-6 py-2.5 rounded-lg shadow-[0_4px_14px_-4px_rgba(176,138,66,0.5)] hover:shadow-[0_6px_18px_-4px_rgba(176,138,66,0.6)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 transition-all duration-150"
            >
              <Send size={15} /> Send Email
            </button>
          </div>
        </form>
      </Card>
    </section>
  );
}
