import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login as loginService } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { Mail, Lock, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = await loginService({ email, password });
      login(data.user, data.token);
      navigate("/profile", { replace: true });
    } catch (err) {
      // Better error handling for different scenarios
      if (err.response?.status === 400) {
        setError(err.response.data.error || "Invalid email or password");
      } else if (err.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (err.message === "Network Error") {
        setError("Unable to connect to server. Check your connection.");
      } else {
        setError(
          err.response?.data?.error || "Login failed. Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quotes = [
    { text: "A room without books is like a body without a soul.", author: "Cicero" },
    { text: "Reading gives us someplace to go when we have to stay where we are.", author: "Mason Cooley" },
    { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
    { text: "Books are a uniquely portable magic.", author: "Stephen King" },
    { text: "I have always imagined that Paradise will be a kind of library.", author: "Jorge Luis Borges" },
    { text: "So many books, so little time.", author: "Frank Zappa" },
    { text: "A book is a dream that you hold in your hand.", author: "Neil Gaiman" },
  ];

  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  return (
  <div className="h-[calc(100vh-64px)] flex lg:grid lg:grid-cols-2 bg-zinc-950 overflow-hidden relative">
    {/* Center Divider Line */}
    <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3/5 w-px bg-gradient-to-b from-transparent via-zinc-800 to-transparent z-20" />
    
    {/* Left Pane: Form */}
    <div className="flex-1 flex items-center justify-center p-8 relative z-10">
      {/* Vibrant Background blobs for form side */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-vibrant-blob" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-vibrant-blob animation-delay-4000" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="bg-white/10 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]">
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl shadow-lg shadow-brand-500/20 mb-4"
            >
              <Mail className="w-6 h-6 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white font-serif tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Your library awaits.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-brand-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-brand-400 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition-all"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-brand-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-brand-400 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500 transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 text-sm text-red-400 bg-red-950/20 border border-red-500/20 rounded-xl text-center"
              >
                {error}
              </motion.div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-bold text-brand-400 hover:text-brand-300 transition-colors underline underline-offset-4"
            >
              Start for free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
    
    {/* Right Pane: Quote */}
    <div className="hidden lg:flex relative items-center justify-center p-12 bg-zinc-900 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
      {/* Quote Pane Micro-interactions (Shifting Gradients & Blobs) */}
      <div className="absolute top-0 -right-4 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-vibrant-blob animation-delay-2000" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-accent/10 pointer-events-none" />
      
      <div className="relative z-10 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center"
        >
          <span className="text-8xl text-brand-500/20 font-serif absolute -top-12 -left-4 pointer-events-none">"</span>
          <h3 className="text-3xl font-serif italic text-white mb-8 relative z-10 leading-snug">
            {quote.text}
          </h3>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-10 bg-brand-500/50" />
            <p className="text-brand-400 font-bold tracking-[0.2em] text-sm uppercase">
              {quote.author}
            </p>
            <div className="h-px w-10 bg-brand-500/50" />
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);
}
