import { useActionState, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { User, Mail, Lock, MapPin, Loader2, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import API from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  // Signup action for useActionState
  const signupAction = async (previousState, formData) => {
    const signupData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      address: formData.get("address"),
    };

    try {
      await API.post("/auth/signup", signupData);
      toast.success("Account created! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
      return { error: null };
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Signup failed";
      toast.error(errorMessage);
      return { error: errorMessage };
    }
  };

  const [, formAction, isPending] = useActionState(signupAction, { error: null });

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
    <Toaster position="bottom-right" />

    {/* Center Divider Line */}
    <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3/5 w-px bg-gradient-to-b from-transparent via-zinc-800 to-transparent z-20" />

    {/* Left Pane: Form */}
    <div className="flex-1 flex items-center justify-center p-8 relative z-10">
      {/* Vibrant Background blobs for form side */}
      <div className="absolute top-0 -left-12 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-vibrant-blob" />
      <div className="absolute -bottom-12 -left-12 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-[128px] opacity-10 animate-vibrant-blob animation-delay-4000" />
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10 scale-90 md:scale-100 origin-center"
      >
        <div className="bg-white/10 dark:bg-zinc-900/40 backdrop-blur-2xl border border-white/20 dark:border-zinc-800/50 rounded-[2.5rem] p-6 shadow-2xl">
          <div className="text-center mb-6">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-accent to-brand-500 rounded-2xl shadow-xl shadow-brand-500/20 mb-4"
            >
              <User className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white font-serif tracking-tight">
              Join the Hub
            </h2>
            <p className="mt-2 text-zinc-400 max-w-xs mx-auto text-base font-light italic">
              "Every great reader has a story."
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-brand-400 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 transition-all focus:ring-4 focus:ring-brand-500/10"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300 ml-1">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-brand-400 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-black/40 border border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 transition-all focus:ring-4 focus:ring-brand-500/10"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Secure Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500 group-focus-within:text-brand-400 transition-colors" />
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 transition-all focus:ring-4 focus:ring-brand-500/10"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300 ml-1">Delivery Address <span className="text-zinc-500 text-xs">(Optional)</span></label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-zinc-500 group-focus-within:text-brand-400 transition-colors" />
                <textarea
                  rows={2}
                  name="address"
                  className="w-full bg-black/40 border border-zinc-800 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-zinc-600 focus:outline-none focus:border-brand-500 transition-all resize-none focus:ring-4 focus:ring-brand-500/10"
                  placeholder="Where should we send your physical copies?"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-accent to-brand-500 hover:from-brand-600 hover:to-accent text-white font-bold py-3 rounded-2xl shadow-xl shadow-brand-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2 group"
            >
              {isPending ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Start Your Story <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Already part of the community?{" "}
            <Link
              to="/login"
              className="font-bold text-accent hover:text-brand-400 transition-colors underline underline-offset-4 decoration-accent/30"
            >
              Log in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>

    {/* Right Pane: Quote */}
    <div className="hidden lg:flex relative items-center justify-center p-12 bg-zinc-900 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]">
      {/* Quote Pane Micro-interactions (Shifting Gradients & Blobs) */}
      <div className="absolute top-0 -right-12 w-96 h-96 bg-brand-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-vibrant-blob" />
      <div className="absolute -bottom-12 -right-12 w-96 h-96 bg-accent rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-vibrant-blob animation-delay-4000" />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-accent/10 pointer-events-none" />

      <div className="relative z-10 max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center"
        >
          <span className="text-8xl text-accent/20 font-serif absolute -top-16 -left-8 pointer-events-none">"</span>
          <h3 className="text-3xl font-serif italic text-white mb-10 relative z-10 leading-snug tracking-tight">
            {quote.text}
          </h3>
          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-12 bg-accent/40" />
            <p className="text-accent font-bold tracking-[0.25em] text-sm uppercase">
              {quote.author}
            </p>
            <div className="h-px w-12 bg-accent/40" />
          </div>
        </motion.div>
      </div>
    </div>
  </div>
);
}
