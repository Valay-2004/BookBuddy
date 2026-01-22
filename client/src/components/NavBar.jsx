import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { BookOpen, User, LogIn, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/Core";

export default function NavBar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Reviews", path: "/" },
    { name: "Reading Lists", path: "/reading-lists" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b-0 border-zinc-200/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo - Serif & Bold */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-accent text-white p-1.5 rounded-lg group-hover:rotate-[-5deg] transition-transform">
            <BookOpen size={20} fill="currentColor" />
          </div>
          <span className="font-serif text-2xl font-black tracking-tight text-ink dark:text-white">
            Book<span className="text-accent">.buddy</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? "text-accent font-semibold"
                  : "text-zinc-500 hover:text-ink dark:text-zinc-400 dark:hover:text-zinc-100"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-4">
          {/* <ThemeToggle /> */}
          {user ? (
            <Link to="/profile">
              <Button variant="secondary" className="pl-3 pr-4 py-2">
                <User size={16} />
                <span>Profile</span>
              </Button>
            </Link>
          ) : (
            <div className="flex gap-2">
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-zinc-600"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-zinc-950 border-b border-zinc-200 p-6 flex flex-col gap-4 shadow-xl"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="text-lg font-serif font-medium text-zinc-800 dark:text-zinc-200"
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-zinc-100 w-full my-2" />
          {user ? (
            <Link to="/profile" onClick={() => setIsOpen(false)}>
              <Button className="w-full">My Profile</Button>
            </Link>
          ) : (
            <Link to="/login" onClick={() => setIsOpen(false)}>
              <Button className="w-full">Log In</Button>
            </Link>
          )}
        </motion.div>
      )}
    </header>
  );
}
