"use client";

import { motion } from "framer-motion";
import { userAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Shield,
  Stethoscope,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface AuthFormProps {
  type: "login" | "signup";
  userRole: "patient" | "doctor";
}

function AuthForm({ type, userRole }: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const {
    registerDoctor,
    registerpatient,
    loginPatient,
    loginDoctor,
    loading,
    error,
  } = userAuthStore();

  const router = useRouter();
  const isSignup = type === "signup";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup && !agreeTerms) return;

    try {
      if (isSignup) {
        userRole === "doctor"
          ? await registerDoctor(formData)
          : await registerpatient(formData);

        router.push(
          userRole === "doctor" ? "/onboarding/doctor" : "/onboarding/patient"
        );
      } else {
        userRole === "doctor"
          ? await loginDoctor(formData.email, formData.password)
          : await loginPatient(formData.email, formData.password);

        router.push(
          userRole === "doctor" ? "/doctor/dashboard" : "/patient/dashboard"
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-slate-100/50 bg-grid-16 pointer-events-none" />

      <motion.div
        animate={{ y: [-20, 20, -20], rotate: [0, 90, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [20, -30, 20], x: [0, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity }}
        className="absolute bottom-32 right-32 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-xl rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl mb-4"
              >
                {userRole === "doctor" ? (
                  <Stethoscope className="w-10 h-10" />
                ) : (
                  <Users className="w-10 h-10" />
                )}
              </motion.div>
              <h1 className="text-4xl font-bold tracking-tight">HealthPlus</h1>
              <p className="mt-2 text-blue-100 text-lg">
                {isSignup
                  ? userRole === "doctor"
                    ? "Join as a Healthcare Provider"
                    : "Your health, our priority"
                  : userRole === "doctor"
                  ? "Welcome back, Doctor"
                  : "Welcome back"}
              </p>
            </div>
          </div>

          <div className="p-8 pt-6">
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignup && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label className="text-gray-700 font-semibold">
                    Full Name
                  </Label>
                  <Input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                    placeholder={
                      userRole === "doctor" ? "Dr. Sarah Johnson" : "John Doe"
                    }
                  />
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Label className="text-gray-700 font-semibold">
                  Email Address
                </Label>
                <Input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                  placeholder="name@example.com"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <Label className="text-gray-700 font-semibold">Password</Label>
                <Input
                  required
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="mt-2 h-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl pr-12"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </motion.div>

              {isSignup && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-start space-x-3"
                >
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(c) => setAgreeTerms(c as boolean)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 leading-tight"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button
                  disabled={loading || (isSignup && !agreeTerms)}
                  type="submit"
                  className="w-full h-12 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {loading
                    ? "Please wait..."
                    : isSignup
                    ? "Create Account"
                    : "Sign In Securely"}
                  {!loading && <ArrowRight className="ml-2 w-5 h-5" />}
                </Button>
              </motion.div>
            </form>

            {/* Remove Google Section Completely */}

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {isSignup
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <Link
                  href={isSignup ? `/login/${userRole}` : `/signup/${userRole}`}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  {isSignup ? "Sign In" : "Sign Up Free"}
                </Link>
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-10 pt-8 border-t border-gray-200"
            >
              <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>256-bit Encryption</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span>Secure & Private</span>
                </div>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default AuthForm;
