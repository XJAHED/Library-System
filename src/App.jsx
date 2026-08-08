import { useState } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar.jsx";
import Topbar from "./components/layout/Topbar.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";

import SignIn from "./pages/SignIn/SignIn.jsx";
import SignUp from "./pages/SignUp/SignUp.jsx";
import AddMember from "./pages/AddMember/AddMember.jsx";
import ViewMembers from "./pages/ViewMembers/ViewMembers.jsx";
import AddBook from "./pages/AddBook/AddBook.jsx";
import ViewBooks from "./pages/ViewBooks/ViewBooks.jsx";
import IssueBook from "./pages/IssueBook/IssueBook.jsx";
import ReturnBook from "./pages/ReturnBook/ReturnBook.jsx";
import BookHistory from "./pages/BookHistory/BookHistory.jsx";
import StudyRoom from "./pages/StudyRoom/StudyRoom.jsx";
import ComposeEmail from "./pages/ComposeEmail/ComposeEmail.jsx";
import EmailHistory from "./pages/EmailHistory/EmailHistory.jsx";

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-paper">
      <Topbar open={sidebarOpen} onToggle={() => setSidebarOpen((s) => !s)} />
      <div className="flex">
        <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
        <main className="relative flex-1 w-full px-5 py-8 lg:px-14 lg:py-12 overflow-hidden">
          <div
            className="pointer-events-none absolute -top-24 right-0 w-[420px] h-[420px] rounded-full opacity-[0.07] blur-3xl"
            style={{ background: "radial-gradient(circle, #B08A42 0%, transparent 70%)" }}
          />
          <div className="relative">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/add-member" replace />} />
        <Route path="/add-member" element={<AddMember />} />
        <Route path="/edit-member/:id" element={<AddMember />} />
        <Route path="/view-members" element={<ViewMembers />} />
        <Route path="/add-book" element={<AddBook />} />
        <Route path="/edit-book/:id" element={<AddBook />} />
        <Route path="/view-books" element={<ViewBooks />} />
        <Route path="/issue-book" element={<IssueBook />} />
        <Route path="/return-book" element={<ReturnBook />} />
        <Route path="/history" element={<BookHistory />} />
        <Route path="/study-room" element={<StudyRoom />} />
        <Route path="/compose-email" element={<ComposeEmail />} />
        <Route path="/email-history" element={<EmailHistory />} />
        <Route path="*" element={<Navigate to="/add-member" replace />} />
      </Route>
    </Routes>
  );
}
