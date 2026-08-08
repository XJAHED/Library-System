import { createContext, useContext, useRef, useState } from "react";
import { todayStr, addDays } from "../utils/helpers.js";

const LibraryContext = createContext(null);

export function LibraryProvider({ children }) {
  const idCounter = useRef(100);
  const nextId = () => ++idCounter.current;

  const [members, setMembers] = useState([
    { id: 1, memberName: "Rafiq Ahmed", memberId: "MEM-1001", position: "Student", department: "CSE", batch: "48", contactNo: "01712345678", email: "rafiq.ahmed@example.com", photo: "" },
    { id: 2, memberName: "Nusrat Jahan", memberId: "MEM-1002", position: "Teacher", department: "EEE", batch: "-", contactNo: "01898765432", email: "nusrat.jahan@example.com", photo: "" },
  ]);

  const [books, setBooks] = useState([
    { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Software Engineering", language: "English", description: "A handbook of agile software craftsmanship.", quantity: 3, cover: "" },
    { id: 2, title: "Discrete Mathematics", author: "Kenneth Rosen", category: "Mathematics", language: "English", description: "Core discrete math for computing.", quantity: 0, cover: "" },
    { id: 3, title: "Bangla Sahitya Parichay", author: "Humayun Ahmed", category: "Literature", language: "Bangla", description: "An introduction to Bengali literature.", quantity: 5, cover: "" },
  ]);

  const [issues, setIssues] = useState([
    { id: 1, memberId: "MEM-1001", memberName: "Rafiq Ahmed", bookId: 1, bookTitle: "Clean Code", issueDate: "2026-07-10", dueDate: "2026-07-24", returnDate: null },
    { id: 2, memberId: "MEM-1002", memberName: "Nusrat Jahan", bookId: 3, bookTitle: "Bangla Sahitya Parichay", issueDate: "2026-06-20", dueDate: "2026-07-04", returnDate: "2026-07-02" },
  ]);

  const [rooms] = useState([
    { id: 1, roomNo: "Study Room A", capacity: 4 },
    { id: 2, roomNo: "Study Room B", capacity: 6 },
    { id: 3, roomNo: "Silent Pod C", capacity: 1 },
  ]);

  const [bookings, setBookings] = useState([
    { id: 1, roomId: 1, roomNo: "Study Room A", memberId: "MEM-1001", memberName: "Rafiq Ahmed", date: "2026-08-06", slot: "10:00 - 12:00" },
  ]);

  const [emails, setEmails] = useState([
    { id: 1, to: "All Students", recipientCount: 1, subject: "Library re-opening hours", body: "The library will resume normal hours from Sunday. Thank you for your patience.", sentAt: "2026-07-15T10:00:00" },
  ]);

  const issueStatus = (rec) => {
    if (rec.returnDate) return "Returned";
    return rec.dueDate < todayStr() ? "Overdue" : "Issued";
  };

  // ---------- Members ----------
  const addMember = (data) => {
    if (members.some((m) => m.memberId === data.memberId)) {
      return { ok: false, message: "This Member ID already exists." };
    }
    setMembers((prev) => [...prev, { id: nextId(), ...data }]);
    return { ok: true, message: "Member added successfully." };
  };

  const updateMember = (id, data) => {
    const conflict = members.some((m) => m.id !== id && m.memberId === data.memberId);
    if (conflict) return { ok: false, message: "This Member ID already exists." };
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
    return { ok: true, message: "Member updated successfully." };
  };

  const deleteMember = (id) => setMembers((prev) => prev.filter((m) => m.id !== id));

  // ---------- Books ----------
  const addBook = (data) => {
    setBooks((prev) => [...prev, { id: nextId(), ...data, quantity: Number(data.quantity) || 0 }]);
    return { ok: true, message: "Book added successfully." };
  };

  const updateBook = (id, data) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...data, quantity: Number(data.quantity) || 0 } : b)));
    return { ok: true, message: "Book updated successfully." };
  };

  const deleteBook = (id) => setBooks((prev) => prev.filter((b) => b.id !== id));

  // ---------- Circulation ----------
  const issueBook = ({ memberId, bookId, issueDate, dueDate }) => {
    const member = members.find((m) => m.memberId === memberId);
    const book = books.find((b) => b.id === Number(bookId));
    if (!member || !book) return { ok: false, message: "Select a member and a book." };
    setIssues((prev) => [
      ...prev,
      { id: nextId(), memberId: member.memberId, memberName: member.memberName, bookId: book.id, bookTitle: book.title, issueDate, dueDate, returnDate: null },
    ]);
    setBooks((prev) => prev.map((b) => (b.id === book.id ? { ...b, quantity: b.quantity - 1 } : b)));
    return { ok: true, message: "Book issued successfully." };
  };

  const returnBook = (issueId) => {
    const rec = issues.find((i) => i.id === issueId);
    if (!rec) return;
    setIssues((prev) => prev.map((i) => (i.id === issueId ? { ...i, returnDate: todayStr() } : i)));
    setBooks((prev) => prev.map((b) => (b.id === rec.bookId ? { ...b, quantity: b.quantity + 1 } : b)));
  };

  // ---------- Study Room ----------
  const bookRoom = ({ roomId, memberId, date, slot }) => {
    const room = rooms.find((r) => r.id === Number(roomId));
    const member = members.find((m) => m.memberId === memberId);
    if (!room || !member || !slot) return { ok: false, message: "Fill in all fields." };
    const clash = bookings.some((b) => b.roomId === room.id && b.date === date && b.slot === slot);
    if (clash) return { ok: false, message: "This room is already booked for that date and slot." };
    setBookings((prev) => [...prev, { id: nextId(), roomId: room.id, roomNo: room.roomNo, memberId: member.memberId, memberName: member.memberName, date, slot }]);
    return { ok: true, message: "Study room booked successfully." };
  };

  // ---------- Email ----------
  const sendEmail = ({ recipientType, memberId, subject, body }) => {
    let to = "";
    let recipientCount = 0;

    if (recipientType === "individual") {
      const m = members.find((m) => m.memberId === memberId);
      if (!m) return { ok: false, message: "Select a valid recipient." };
      to = `${m.memberName} <${m.email}>`;
      recipientCount = 1;
    } else if (recipientType === "students") {
      to = "All Students";
      recipientCount = members.filter((m) => m.position.toLowerCase().includes("student")).length;
    } else if (recipientType === "faculty") {
      to = "All Faculty";
      recipientCount = members.filter((m) => /teacher|faculty/i.test(m.position)).length;
    } else {
      to = "All Members";
      recipientCount = members.length;
    }

    if (recipientCount === 0) return { ok: false, message: "No matching recipients found." };

    setEmails((prev) => [...prev, { id: nextId(), to, recipientCount, subject, body, sentAt: new Date().toISOString() }]);
    return { ok: true, message: `Email sent to ${to} (${recipientCount} recipient${recipientCount > 1 ? "s" : ""}).` };
  };

  const value = {
    members, books, issues, rooms, bookings, emails,
    issueStatus,
    addMember, updateMember, deleteMember,
    addBook, updateBook, deleteBook,
    issueBook, returnBook, bookRoom, sendEmail,
    todayStr, addDays,
  };

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within a LibraryProvider");
  return ctx;
}
