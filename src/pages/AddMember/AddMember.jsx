import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SectionHeader, Field, Card, Msg, inputCls } from "../../components/ui/UI.jsx";
import axios from "axios";

const EMPTY = { Member_name: "", member_id: "", postion: "", department: "", batch: "", contact_no: "", email: "" };

export default function AddMember() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (isEdit) {
      const getMember = async () => {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/member/${id}/`);
          setForm(response.data);
        } catch (error) {
          console.error("Error fetching member:", error);
          setMsg("error:Failed to load member details.");
        }
      };
      getMember();
    } else {
      setForm(EMPTY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await axios.put(`http://127.0.0.1:8000/member/${id}/`, form);
        navigate("/view-members");
      } else {
        await axios.post("http://127.0.0.1:8000/member/", form);
        setForm(EMPTY);
        setMsg("ok:Member added successfully!");
        setTimeout(() => setMsg(""), 3000);
      }
    } catch (error) {
      console.error("Error saving member:", error);
      setMsg("error:Failed to save member. Please check the data and try again.");
    }
  };

  return (
    <section>
      <SectionHeader
        eyebrow={isEdit ? "Membership · Edit" : "Membership · 01"}
        title={isEdit ? "Edit Member" : "Add Member"}
        subtitle={isEdit ? "Update this member's details." : "Register a new library member."}
      />
      <Card className="p-7 lg:p-9">
        <Msg value={msg} />
        <form onSubmit={submit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Field label="Member Name" required>
            <input required className={inputCls} value={form.Member_name} onChange={(e) => setForm({ ...form, Member_name: e.target.value })} placeholder="e.g. Rafiq Ahmed" />
          </Field>
          <Field label="Member ID" required>
            <input required className={inputCls} style={{ fontFamily: "'JetBrains Mono', monospace" }} value={form.member_id} onChange={(e) => setForm({ ...form, member_id: e.target.value })} placeholder="e.g. MEM-1003" />
          </Field>
          <Field label="Position" required>
            <input required className={inputCls} value={form.postion} onChange={(e) => setForm({ ...form, postion: e.target.value })} placeholder="e.g. Student, Teacher" />
          </Field>
          <Field label="Department" required>
            <input required className={inputCls} value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. CSE" />
          </Field>
          <Field label="Batch" required>
            <input required className={inputCls} value={form.batch} onChange={(e) => setForm({ ...form, batch: e.target.value })} placeholder="e.g. 48" />
          </Field>
          <Field label="Contact No" required>
            <input required type="tel" className={inputCls} value={form.contact_no} onChange={(e) => setForm({ ...form, contact_no: e.target.value.replace(/[^0-9]/g, "") })} placeholder="e.g. 01712345678" />
          </Field>
          <Field label="Email" required>
            <input required type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@example.com" />
          </Field>
          <div className="sm:col-span-2 lg:col-span-3 pt-2 flex items-center gap-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-gold to-gold-light text-ink text-sm font-semibold tracking-wide px-6 py-2.5 rounded-lg shadow-[0_4px_14px_-4px_rgba(176,138,66,0.5)] hover:shadow-[0_6px_18px_-4px_rgba(176,138,66,0.6)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 transition-all duration-150"
            >
              {isEdit ? "Save Changes" : "Add Member"}
            </button>
            {isEdit && (
              <button type="button" onClick={() => navigate("/view-members")} className="text-sm font-medium text-ink/45 hover:text-ink transition-colors">
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>
    </section>
  );
}