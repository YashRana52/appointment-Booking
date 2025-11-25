"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { userAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import {
  Shield,
  Clock,
  Stethoscope,
  Users,
  Zap,
  HeartPlus,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, user } = userAuthStore();
  const router = useRouter();

  const [loadingRedirect, setLoadingRedirect] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);

  // ✅ Wait until user is loaded from store
  useEffect(() => {
    if (user !== null || !isAuthenticated) {
      setUserLoaded(true);
    }
  }, [user, isAuthenticated]);

  // ✅ Redirect Logic (runs only when user is fully loaded)
  useEffect(() => {
    if (!userLoaded) return;

    if (isAuthenticated && user) {
      setLoadingRedirect(true);

      setTimeout(() => {
        if (!user.isVerified) {
          router.push(`/onboarding/${user.type}`);
        } else {
          router.push(
            user.type === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"
          );
        }
      }, 800); // shorter delay for smoother UX
    }
  }, [isAuthenticated, userLoaded, user, router]);

  // ✅ Loader UI
  if (loadingRedirect) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-900">
        <div className="relative flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="w-28 h-28 border-t-4 border-b-4 border-cyan-400/60 rounded-full"
          />

          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bg-gradient-to-br from-blue-500 to-cyan-400 p-4 rounded-2xl shadow-2xl"
          >
            <Stethoscope className="w-10 h-10 text-white" />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Left Side */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative z-10 w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16"
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <HeartPlus className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">HealthPlus+</h1>
              <p className="text-sm text-gray-400">Healthcare Reimagined</p>
            </div>
          </motion.div>

          {children}
        </div>
      </motion.div>

      {/* Right Side */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 opacity-80 animate-gradient-shift" />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-2xl" />
        </div>

        {/* Floating Orbs */}
        <motion.div
          animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-cyan-400/30 to-blue-500/30 rounded-full blur-3xl"
        />

        <motion.div
          animate={{ y: [0, 40, 0], x: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-32 w-96 h-96 bg-gradient-to-tr from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"
        />

        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-16 text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center space-y-8 max-w-2xl"
          >
            <h2 className="text-6xl lg:text-7xl font-extrabold">
              <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Healthcare
              </span>
              <br />
              <span className="text-white">That Cares</span>
            </h2>

            <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed">
              Connect with verified doctors instantly. Consult from home with
              secure video calls.
            </p>

            {/* Features */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              {[
                {
                  icon: Shield,
                  title: "100% Secure",
                  color: "from-emerald-400 to-teal-500",
                },
                {
                  icon: Clock,
                  title: "24/7 Available",
                  color: "from-blue-400 to-cyan-500",
                },
                {
                  icon: Users,
                  title: "10K+ Patients",
                  color: "from-purple-400 to-pink-500",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className="group"
                >
                  <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${item.color} p-3 shadow-lg`}
                    >
                      <item.icon className="w-full h-full text-white" />
                    </div>
                    <p className="text-lg font-bold">{item.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex items-center justify-center gap-8 mt-12"
            >
              {["Verified Doctors", "Encrypted Data", "Instant Booking"].map(
                (text, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-gray-300"
                  >
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium">{text}</span>
                  </div>
                )
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Mobile gradient fade */}
      <div className="lg:hidden absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
    </div>
  );
};

export default Layout;
