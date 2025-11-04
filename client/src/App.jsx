import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Books from "./pages/Books";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ToggleTheme from "./components/ThemeToggle";

export default function App() {
  return (
    <Router>
      <nav className="flex justify-between items-center px-6 py-3 bg-indigo-600 text-white shadow-md">
        {/* Left section */}
        <div className="space-x-4">
          <Link to="/" className="hover:text-indigo-200 transition-colors">
            Books
          </Link>
          <Link to="/login" className="hover:text-indigo-200 transition-colors">
            Login
          </Link>
          <Link
            to="/signup"
            className="hover:text-indigo-200 transition-colors"
          >
            Signup
          </Link>
        </div>

        {/* Right section [the dark mode button will be here]*/}
        <div className="flex items-center gap-3">
          <ToggleTheme />
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
