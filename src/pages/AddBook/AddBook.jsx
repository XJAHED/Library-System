import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SectionHeader, Field, Card, Msg, inputCls, ImageUpload } from "../../components/ui/UI.jsx";

const API_BASE = "http://127.0.0.1:8000";

const EMPTY = {
  book_name: "",
  isbn_number: "",
  purchase_date: "",
  description: "",
  book_quantity: 1,
  book_price: "",
  image: "",
  author_post: "",
  category_post: "",
};

// ImageUpload gives back a base64 dataURL string, but Django's ImageField
// needs an actual file in the multipart request — convert it here.
function dataUrlToFile(dataUrl, filename = "cover.jpg") {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename, { type: mime });
}

export default function AddBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [msg, setMsg] = useState("");

  // load dropdown data
  useEffect(() => {
    fetch(`${API_BASE}/author/`)
      .then((res) => res.json())
      .then((data) => setAuthors(Array.isArray(data) ? data : data.results || []))
      .catch(() => setAuthors([]));

    fetch(`${API_BASE}/category/`)
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : data.results || []))
      .catch(() => setCategories([]));
  }, []);

  // load existing book when editing
  useEffect(() => {
    if (!isEdit) {
      setForm(EMPTY);
      return;
    }
    fetch(`${API_BASE}/book/${id}/`)
      .then((res) => res.json())
      .then((data) =>
        setForm({
          book_name: data.book_name || "",
          isbn_number: data.isbn_number || "",
          purchase_date: data.purchase_date || "",
          description: data.description || "",
          book_quantity: data.book_quantity ?? 1,
          book_price: data.book_price || "",
          image: data.image || "",
          author_post: data.author?.author_id ?? data.author?.id ?? "",
          category_post: data.category?.category_id ?? data.category?.id ?? "",
        })
      )
      .catch((err) => console.log("Failed to load book:", err));
  }, [id, isEdit]);

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("book_name", form.book_name);
    fd.append("isbn_number", form.isbn_number);
    fd.append("purchase_date", form.purchase_date);
    fd.append("description", form.description);
    fd.append("book_quantity", form.book_quantity);
    fd.append("book_price", form.book_price);
    fd.append("author_post", form.author_post);
    fd.append("category_post", form.category_post);
    // only attach the image if it's a new upload (base64 dataURL).
    // if it's still the existing http(s) URL from edit mode, leave it out
    // so the backend keeps the current image.
    if (typeof form.image === "string" && form.image.startsWith("data:")) {
      fd.append("image", dataUrlToFile(form.image));
    }
    return fd;
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.author_post || !form.category_post) {
      setMsg("err:Please select an author and a category");
      return;
    }

    try {
      const url = isEdit ? `${API_BASE}/book/${id}/` : `${API_BASE}/book/`;
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, { method, body: buildFormData() });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        setMsg(`err:${JSON.stringify(errData)}`);
        return;
      }

      if (isEdit) {
        navigate("/view-books");
        return;
      }

      setForm(EMPTY);
      setMsg("ok:Book added successfully");
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg(`err:${err.message}`);
    }
  };

  return (
    <section>
      <SectionHeader
        eyebrow={isEdit ? "Catalogue · Edit" : "Catalogue · 01"}
        title={isEdit ? "Edit Book" : "Add Book"}
        subtitle={isEdit ? "Update this title's details." : "Add a new title to the catalogue."}
      />
      <Card className="p-7 lg:p-9">
        <Msg value={msg} />
        <form onSubmit={submit} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="sm:col-span-2 lg:col-span-3">
            <ImageUpload
              label="Book Cover"
              value={form.image}
              onChange={(v) => setForm({ ...form, image: v })}
              shape="square"
            />
          </div>
          <Field label="Title" required>
            <input
              required
              className={inputCls}
              value={form.book_name}
              onChange={(e) => setForm({ ...form, book_name: e.target.value })}
              placeholder="e.g. Clean Code"
            />
          </Field>
          <Field label="ISBN Number" required>
            <input
              required
              className={inputCls}
              value={form.isbn_number}
              onChange={(e) => setForm({ ...form, isbn_number: e.target.value })}
              placeholder="e.g. 9780132350884"
            />
          </Field>
          <Field label="Purchase Date" required>
            <input
              required
              type="date"
              className={inputCls}
              value={form.purchase_date}
              onChange={(e) => setForm({ ...form, purchase_date: e.target.value })}
            />
          </Field>
          <Field label="Author" required>
            <select
              required
              className={inputCls}
              value={form.author_post}
              onChange={(e) => setForm({ ...form, author_post: e.target.value })}
            >
              <option value="">Select author</option>
              {authors.map((a) => (
                <option key={a.author_id ?? a.id} value={a.author_id ?? a.id}>
                  {a.name || a.author_name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Category" required>
            <select
              required
              className={inputCls}
              value={form.category_post}
              onChange={(e) => setForm({ ...form, category_post: e.target.value })}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.category_id ?? c.id} value={c.category_id ?? c.id}>
                  {c.name || c.category_name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Quantity" required>
            <input
              required
              type="number"
              min="0"
              className={inputCls}
              value={form.book_quantity}
              onChange={(e) => setForm({ ...form, book_quantity: e.target.value })}
            />
          </Field>
          <Field label="Price" required>
            <input
              required
              type="number"
              min="0"
              step="0.01"
              className={inputCls}
              value={form.book_price}
              onChange={(e) => setForm({ ...form, book_price: e.target.value })}
              placeholder="e.g. 450.00"
            />
          </Field>
          <div className="sm:col-span-2 lg:col-span-3">
            <Field label="Description">
              <textarea
                rows={3}
                className={inputCls}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description (optional)"
              />
            </Field>
          </div>
          <div className="sm:col-span-2 lg:col-span-3 pt-2 flex items-center gap-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-gold to-gold-light text-ink text-sm font-semibold tracking-wide px-6 py-2.5 rounded-lg shadow-[0_4px_14px_-4px_rgba(176,138,66,0.5)] hover:shadow-[0_6px_18px_-4px_rgba(176,138,66,0.6)] hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gold/40 focus:ring-offset-2 transition-all duration-150"
            >
              {isEdit ? "Save Changes" : "Add Book"}
            </button>
            {isEdit && (
              <button
                type="button"
                onClick={() => navigate("/view-books")}
                className="text-sm font-medium text-ink/45 hover:text-ink transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </Card>
    </section>
  );
}