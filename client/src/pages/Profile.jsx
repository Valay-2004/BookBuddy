import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Mail,
  Star,
  BookOpen,
  MessageCircle,
  Calendar,
  Shield,
  LogOut,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
} from "@/components/ui/Core";

export default function Profile() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await API.get("/users/me");
        setProfile(response.data);
      } catch (error) {
        console.error("Profile fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [token]);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (loading)
    return (
      <div className="p-20 text-center text-zinc-500">
        Loading your library...
      </div>
    );

  if (!token)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Card className="max-w-md text-center p-6 border-zinc-200 dark:border-zinc-800">
          <User className="w-12 h-12 mx-auto text-brand-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Login Required</h2>
          <p className="text-zinc-500 mb-6">
            Please sign in to access your personal dashboard.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="btn-primary w-full"
          >
            Go to Login
          </Button>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 lg:p-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-zinc-900 dark:text-zinc-100 font-serif">
              Reader Profile
            </h1>
            <p className="text-zinc-500 mt-1">
              Manage your account and view your reading activity.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="text-red-500 border-red-200 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main User Info */}
          <Card className="md:col-span-2 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900/30 rounded-2xl flex items-center justify-center text-brand-600">
                  <User size={40} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{profile?.name}</h2>
                  <div className="flex items-center text-zinc-500 gap-2 mt-1">
                    <Mail size={16} /> {profile?.email}
                  </div>
                  <Badge className="mt-3 bg-brand-500 hover:bg-brand-600">
                    {profile?.role}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-brand-600 text-white border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white/90">
                <TrendingUp size={20} /> Reading Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 p-4 rounded-xl">
                <div className="text-3xl font-bold">
                  {profile?.reviews?.length || 0}
                </div>
                <div className="text-xs text-white/70 uppercase tracking-wider">
                  Reviews
                </div>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <div className="text-3xl font-bold">
                  {profile?.reviews?.length > 0
                    ? (
                        profile.reviews.reduce((a, b) => a + b.rating, 0) /
                        profile.reviews.length
                      ).toFixed(1)
                    : "0.0"}
                </div>
                <div className="text-xs text-white/70 uppercase tracking-wider">
                  Avg Star
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reviews List */}
          <Card className="md:col-span-3 border-zinc-200 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="text-brand-500" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile?.reviews?.length === 0 ? (
                <div className="text-center py-12 text-zinc-400">
                  <BookOpen className="mx-auto mb-2 opacity-20" size={48} />
                  <p>You haven't written any reviews yet.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {profile?.reviews?.map((r) => (
                    <div
                      key={r.review_id}
                      className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 flex justify-between items-center"
                    >
                      <div>
                        <h4 className="font-bold">{r.book_title}</h4>
                        <p className="text-sm text-zinc-500 italic mt-1">
                          "{r.review_text}"
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-brand-500">
                        <Star size={16} fill="currentColor" />
                        <span className="font-bold">{r.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
