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
    <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/20 dark:border-gray-700/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="font-black text-2xl bg-linear-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            📚 BookBuddy
          </Link>
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-400 font-semibold hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
          >
            Library
          </Link>
        </div>

        <div className="flex items-center gap-6">
          {user ? (
            <>
              <Link
                to="/profile"
                className="text-gray-600 dark:text-gray-400 font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Logout
              </button>
              <div className="px-4 py-2 rounded-full bg-linear-to-r from-purple-100 to-cyan-100 dark:from-purple-900/30 dark:to-cyan-900/30 border border-purple-200/50 dark:border-purple-700/50">
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                  {user.name}
                </span>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-400 font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 text-white font-medium hover:shadow-lg transition-all"
              >
                Sign Up
              </Link>
            </>
          )}

          <ToggleTheme />
        </div>
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
