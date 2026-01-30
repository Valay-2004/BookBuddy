import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts & Context
import NavBar from "./components/NavBar";

// --- FIX START ---
// We must use curly braces { } because Core.jsx has multiple exports
import { PageLoader, Toaster } from "./components/ui/Core";
// --- FIX END ---

// Lazy Load Pages
const Books = lazy(() => import("./pages/Books"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const ReadingLists = lazy(() => import("./pages/ReadingLists"));
const BookDetails = lazy(() => import("./pages/BookDetails"));

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-paper dark:bg-dark-paper transition-colors duration-300 font-sans text-ink dark:text-gray-200">
        <NavBar />

        <main>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Books />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reading-lists" element={<ReadingLists />} />
              <Route path="/book/:id" element={<BookDetails />} />
            </Routes>
          </Suspense>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}
