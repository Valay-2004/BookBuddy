import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import { BookOpen, Library, User, LogOut, ChevronRight } from "lucide-react";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 text-sm font-medium transition-all duration-200 px-3 py-1.5 rounded-md ${
      isActive
        ? "text-brand-600 bg-brand-50 dark:bg-brand-500/10 dark:text-brand-100"
        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center">
        {/* Brand Area */}
        <div className="flex items-center gap-8">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="bg-brand-600 text-white p-1.5 rounded-lg group-hover:bg-brand-700 transition-colors">
              <BookOpen size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">
              BookBuddy
            </span>
          </NavLink>

          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" className={linkClass}>
              <Library size={16} />
              Library
            </NavLink>
          </div>
        </div>

        {/* Actions Area */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800" />

          {user ? (
            <div className="flex items-center gap-3">
              <NavLink to="/profile" className={linkClass}>
                <User size={16} />
                <span className="hidden sm:inline">Profile</span>
              </NavLink>

              <button
                onClick={handleLogout}
                className="text-zinc-500 hover:text-red-600 dark:text-zinc-400 dark:hover:text-red-400 transition-colors p-2"
                title="Logout"
              >
                <LogOut size={18} />
              </button>

              <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-bold uppercase border border-brand-200 dark:border-brand-800">
                {user.name.charAt(0)}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink
                to="/login"
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                Sign in
              </NavLink>
              <NavLink
                to="/signup"
                className="btn-primary flex items-center gap-1 text-sm"
              >
                Get Started <ChevronRight size={14} />
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
