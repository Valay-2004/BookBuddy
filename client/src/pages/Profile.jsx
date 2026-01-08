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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
        setLoading(true);
        const response = await API.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
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

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 text-center max-w-md mx-auto border border-zinc-200 dark:border-zinc-800"
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center mx-auto mb-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <User className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Access Denied
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Please log in to view your profile
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              asChild
              className="bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-lg hover:shadow-xl"
            >
              <a href="/login">Go to Login</a>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="h-12 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-64 mb-4 animate-pulse"></div>
            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-96 animate-pulse"></div>
          </motion.div>
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="break-inside-avoid"
              >
                <Card className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
                      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <motion.h1
            className="text-5xl font-black tracking-tight bg-gradient-to-r from-zinc-900 via-brand-700 to-zinc-900 dark:from-zinc-100 dark:via-brand-300 dark:to-zinc-100 bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Welcome back, {profile.name}
          </motion.h1>
          <motion.p
            className="text-zinc-600 dark:text-zinc-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Your personal reading dashboard and profile overview.
          </motion.p>
        </motion.div>

        {/* Bento Grid Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {/* Profile Card - Large */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            className="break-inside-avoid col-span-1 md:col-span-2"
          >
            <Card className="bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 border-2 border-transparent hover:border-brand-200 dark:hover:border-brand-800 shadow-lg hover:shadow-xl transition-all duration-500">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <motion.div
                      className="w-16 h-16 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center shadow-lg shrink-0"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <User className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-2xl text-zinc-900 dark:text-zinc-100 truncate">
                        {profile.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 mt-1">
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm truncate">
                          {profile.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-shrink-0"
                  >
                    <Button
                      variant="outline"
                      onClick={handleLogout}
                      className="text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300 whitespace-nowrap"
                    >
                      <LogOut className="w-4 h-4 flex" />
                      Logout
                    </Button>
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                      {profile.reviews?.length || 0}
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Reviews
                    </div>
                  </div>
                  <div className="text-center p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                      {profile.role === "admin" ? "Admin" : "User"}
                    </div>
                    <div className="text-sm text-zinc-600 dark:text-zinc-400">
                      Role
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Details */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="break-inside-avoid"
          >
            <Card className="bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-brand-600" />
                  Account Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600 dark:text-zinc-400">Role</span>
                  <Badge
                    variant={profile.role === "admin" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {profile.role || "user"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Member Since
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">
                    {profile.created_at
                      ? new Date(profile.created_at).getFullYear()
                      : "N/A"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Reading Stats */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
            className="break-inside-avoid"
          >
            <Card className="bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="w-5 h-5 text-brand-600" />
                  Reading Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-1">
                    {profile.reviews?.length || 0}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    Books Reviewed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-600 dark:text-brand-400 mb-1">
                    {profile.reviews?.reduce(
                      (acc, review) => acc + review.rating,
                      0
                    ) / (profile.reviews?.length || 1) || 0}
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    Avg Rating
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Reviews - Large */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            className="break-inside-avoid col-span-1 md:col-span-2 lg:col-span-3"
          >
            <Card className="bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MessageCircle className="w-6 h-6 text-brand-600" />
                  Your Recent Reviews
                  <Badge variant="outline" className="ml-auto">
                    {profile.reviews?.length || 0} total
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {profile.reviews && profile.reviews.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <BookOpen className="w-16 h-16 text-zinc-400 dark:text-zinc-600 mx-auto mb-4" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-400">
                        Start reviewing books to build your reading history!
                      </p>
                    </motion.div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                      {profile.reviews?.slice(0, 4).map((review, index) => (
                        <motion.div
                          key={review.review_id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4 border border-zinc-200 dark:border-zinc-700 hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                              {review.book_title}
                            </h4>
                            <div className="flex items-center gap-1 ml-2">
                              {[...Array(5)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: index * 0.1 + i * 0.05 }}
                                >
                                  <Star
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-zinc-300 dark:text-zinc-600"
                                    }`}
                                  />
                                </motion.div>
                              ))}
                            </div>
                          </div>
                          <p className="text-zinc-600 dark:text-zinc-300 text-sm italic line-clamp-2 mb-2">
                            "{review.review_text}"
                          </p>
                          {review.created_at && (
                            <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                              <Calendar className="w-3 h-3" />
                              {new Date(review.created_at).toLocaleDateString()}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
