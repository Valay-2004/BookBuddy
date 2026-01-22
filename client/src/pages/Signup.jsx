import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { User, Mail, Lock, MapPin, Loader2, ArrowRight } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import API from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/signup", formData);
      toast.success("Account created! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-2">
      <Toaster position="top-right" />

      <div className="flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-6"
        >
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-serif">
              Join the Library
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Create an account to start curating your collections.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="label-style">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="input-field !pl-10"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="label-style">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="input-field !pl-10"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="label-style">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className="input-field !pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="label-style">Address (Optional)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-zinc-400" />
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="input-field !pl-10 resize-none py-2"
                    placeholder="Where should we send your books?"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center gap-2 py-3 mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Create Account <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-brand-600 hover:text-brand-700"
            >
              Log in
            </Link>
          </p>
        </motion.div>
      </div>

      <div className="hidden lg:flex relative bg-zinc-900 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black opacity-90" />
        <div className="relative z-10 max-w-md text-center px-8">
          <h3 className="text-2xl font-serif italic text-zinc-200 mb-6">
            "Reading gives us someplace to go when we have to stay where we
            are."
          </h3>
          <p className="text-brand-500 font-medium tracking-widest text-sm uppercase">
            — Mason Cooley
          </p>
        </div>
      </div>
    </div>
  );
}
