import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layouts & Context
import NavBar from "./components/NavBar";
import PageLoader from "./components/ui/PageLoader";
import { Toaster } from "@/components/ui/sonner";

// Lazy Load Pages (Optimization: Reduces initial bundle size)
const Books = lazy(() => import("./pages/Books"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Profile = lazy(() => import("./pages/Profile"));
const ReadingLists = lazy(() => import("./pages/ReadingLists"));

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 font-sans">
        <NavBar />

        <main>
          {/* Suspense shows the loader while the page chunk is being downloaded */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Books />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reading-lists" element={<ReadingLists />} />
            </Routes>
          </Suspense>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}
