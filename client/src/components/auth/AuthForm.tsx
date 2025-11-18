"use client";

import { motion } from "framer-motion";
import { userAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { Separator } from "../ui/separator";

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
    isAuthenticated,
    user,
  } = userAuthStore();

  const router = useRouter();

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === "signup" && !agreeTerms) return;
    try {
      if (type === "signup") {
        if (userRole === "doctor") {
          await registerDoctor(formData);
          router.push("/doctor/dashboard/onboarding");
        } else {
          await registerpatient(formData);
          router.push(`/onboarding/${userRole}`);
        }
      } else {
        if (userRole === "doctor") {
          await loginDoctor(formData.email, formData.password);
          router.push("/doctor/dashboard");
        } else {
          await loginPatient(formData.email, formData.password);
          router.push("/patient/dashboard");
        }
      }
    } catch (error) {
      console.error(`${type} failed:`, error);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google?type=${userRole}`;
  };

  const isSignup = type === "signup";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4"
    >
      <Card className="w-full max-w-lg border-0 shadow-2xl rounded-3xl p-2 bg-white/90 backdrop-blur-md min-h-[700px] flex flex-col justify-center">
        <CardContent className="p-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-blue-800">Medicare+</h1>
            <p className="text-gray-500 mt-2 text-lg">
              {isSignup
                ? "Create a secure account"
                : "Welcome back! Please sign in"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Full Name
                </Label>
                <Input
                  required
                  id="name"
                  type="text"
                  className="h-12 text-lg border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">
                Email
              </Label>
              <Input
                required
                id="email"
                type="email"
                className="h-12 text-lg border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Input
                required
                id="password"
                type={showPassword ? "text" : "password"}
                className="h-12 text-lg border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 pr-10"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-9 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </Button>
            </div>

            {isSignup && (
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) =>
                    setAgreeTerms(checked as boolean)
                  }
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-600 leading-5"
                >
                  I confirm that I am 18 years old and agree to{" "}
                  <Link className="text-blue-600 hover:underline" href="#">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link className="text-blue-600 hover:underline" href="#">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            )}

            <Button
              disabled={loading || (isSignup && !agreeTerms)}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-lg rounded-full transition-all"
              type="submit"
            >
              {loading
                ? `${type === "signup" ? "Creating..." : "Signing in..."}`
                : isSignup
                ? "Create Account"
                : "Sign In"}
            </Button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <Separator />
              <div className="absolute inset-0 flex justify-center">
                <span className="bg-white px-2 text-gray-500 text-sm">OR</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-full border-gray-300 py-3 text-lg"
                onClick={handleGoogleAuth}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isSignup ? "Signup" : "Sign In"} with Google
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <span className="text-gray-600">
              {isSignup
                ? "Already have an account? "
                : "Don't have an account? "}
            </span>
            <Link
              href={isSignup ? `/login/${userRole}` : `/signup/${userRole}`}
              className="text-blue-600 font-semibold"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default AuthForm;
