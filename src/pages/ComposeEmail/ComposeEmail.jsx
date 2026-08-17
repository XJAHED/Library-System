import { useState } from "react";
import { Send } from "lucide-react";
import axios from "axios";
import { SectionHeader, Field, Card, Msg, inputCls } from "../../components/ui/UI.jsx";

const EMPTY = { subject: "", message: "" };

export default function ComposeEmail() {
  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) {
      setMsg("error:Subject and message are required.");
      return;
    }

    setSending(true);
    setMsg("");

    try {
      const res = await axios.post(
        "https://library-system-3x9t.onrender.com/book/mail/",
        
        // "http://127.0.0.1:8000/book/mail/",
        { subject: form.subject, message: form.message },
        { headers: { "Content-Type": "application/json" } }
      );

      setForm(EMPTY);
      setMsg(`ok:${res.data?.message || "Notification sent successfully."}`);
      setTimeout(() => setMsg(""), 4000);
    } catch (err) {
      const data = err.response?.data;
      const errorText =
        (data && (data.error || data.message)) ||
        err.response?.statusText ||
        "Network error. Please try again.";
      setMsg(`error:${errorText}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <section>
      <SectionHeader eyebrow="Communication · 01" title="Compose Email" subtitle="Send a notification to all library members." />
      <Card className="p-7 lg:p-9">
        <Msg value={msg} />
        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <Field label="Subject" required>
              <input required className={inputCls} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="e.g. Library re-opening hours" />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <Field label="Message" required>
              <textarea required rows={8} className={inputCls} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Write your message here…" />
            </Field>
          </div>

          <div className="sm:col-span-2 pt-2">
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 bg-gradient-to-r from-gold to-gold-light text-ink text-sm font-semibold tracking-wide px-6 py-2.5 rounded-lg shadow-[0_4px_14px_-4px_rgba(176,138,66,0.5)] hover:shadow-[0_6px_18px_-4px_rgba(176,138,66,0.6)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <Send size={15} /> {sending ? "Sending…" : "Send Email"}
            </button>
          </div>
        </form>
      </Card>
    </section>
  );
}