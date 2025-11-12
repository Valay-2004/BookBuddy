import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Books from "./pages/Books";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ToggleTheme from "./components/ThemeToggle";
import { useAuth } from "./context/AuthContext";

function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-indigo-600 text-white shadow-md">
      <div className="flex items-center gap-4">
        <Link
          to="/"
          className="font-semibold text-lg hover:text-indigo-200 transition-colors"
        >
          BookBuddy
        </Link>
        <Link to="/" className="hover:text-indigo-200 transition-colors">
          Books
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              to="/profile"
              className="hover:text-indigo-200 transition-colors"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm bg-indigo-700/30 px-3 py-1 rounded-md hover:bg-indigo-700/40 transition"
            >
              Logout
            </button>
            <span className="px-3 py-1 text-sm rounded-full bg-indigo-800/20">
              {user.name}
            </span>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-indigo-200 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="hover:text-indigo-200 transition-colors"
            >
              Signup
            </Link>
          </>
        )}

        <ToggleTheme />
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <NavBar />

      <Routes>
        <Route path="/" element={<Books />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
