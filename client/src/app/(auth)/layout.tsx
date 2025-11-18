"use client";

import { useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import React from "react";
import { userAuthStore } from "@/store/authStore";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, user } = userAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (!user.isVerified) {
        redirect(`/onboarding/${user.type}`);
      } else {
        if (user.type === "doctor") {
          redirect("/doctor/dashboard");
        } else {
          redirect("/patient/dashboard");
        }
      }
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
        {children}
      </div>
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        {/* Background Layers */}
        <div
          className="absolute inset-0 bg-gradient-to-tr from-blue-400 via-cyan-400 to-teal-500
animate-gradient-x z-0"
        ></div>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-md z-10"></div>

        {/* Floating soft circles */}
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-white/10 rounded-full blur-3xl animate-pulse-slow z-0"></div>
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-pink-300/20 rounded-full blur-2xl animate-pulse-slow z-0"></div>

        {/* Content */}
        <div className="relative z-20 flex flex-col items-center justify-center w-full h-full p-10 text-center space-y-6">
          {/* Logo/Icon */}
          <div className="w-28 h-28 bg-white/10 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm hover:scale-105 transition-transform duration-500">
            <svg
              className="w-14 h-14 text-white animate-bounce"
              fill="pink"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>

          {/* Headline */}
          <h2
            className="text-5xl font-extrabold bg-gradient-to-r from-teal-300 via-green-300 to-lime-400
 bg-clip-text text-transparent"
          >
            Your Health, Our Mission
          </h2>

          {/* Subheading */}
          <p className="text-xl opacity-90 tracking-wide max-w-lg">
            MediCare connects patients and doctors seamlessly with secure online
            consultations.
          </p>

          {/* Extra info / tagline */}
          <p className="text-lg opacity-80 leading-relaxed max-w-md">
            Book appointments, consult from home, and manage your health
            anytime, anywhere.
          </p>

          {/* Optional call-to-action / badges */}
          <div className="flex gap-4 mt-4">
            <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium active:scale-95">
              Trusted Doctors
            </span>
            <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium active:scale-95">
              24/7 Support
            </span>
            <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm font-medium active:scale-95">
              Secure & Easy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
