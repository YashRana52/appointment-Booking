import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { healthcareCategories } from "@/lib/constant";
import { useRouter } from "next/navigation";
import { userAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { ArrowRight, Stethoscope, Video, Sparkles } from "lucide-react";

function LandingHero() {
  const { isAuthenticated } = userAuthStore();
  const router = useRouter();

  const handleBookNow = () => {
    router.push(isAuthenticated ? "/doctor-list" : "/signup-patient");
  };

  const handleCategory = (title: string) => {
    router.push(
      isAuthenticated ? `/doctor-list?category=${title}` : "/signup-patient"
    );
  };

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-blue-50 to-white">
      {/* Subtle Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 150"
          className="w-full h-32 md:h-48"
          preserveAspectRatio="none"
        >
          <path
            fill="#f8fafc"
            d="M0,0 C360,150 1080,0 1440,100 L1440,150 L0,150 Z"
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-md"
          >
            <Sparkles className="w-4 h-4" />
            Trusted by 50,000+ Patients
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight"
          >
            Consult Top Doctors
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
              Online in Minutes
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Video call • Instant prescription • No waiting room
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
          >
            <Button
              onClick={handleBookNow}
              size="lg"
              className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
            >
              <Video className="w-5 h-5" />
              Book Video Consultation
              <ArrowRight className="w-5 h-5" />
            </Button>

            <Link href="/login/doctor">
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 text-lg font-medium border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-xl"
              >
                <Stethoscope className="w-5 h-5 mr-2" />
                Doctor Login
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Full Width Specialties Section */}
      <div className="mt-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Consult Specialists Instantly
            </h2>
            <p className="text-gray-600 mt-2">
              Choose from top verified doctors
            </p>
          </motion.div>

          {/* Full Width Horizontal Scroll - No Scrollbar */}
          {/* Full Width Specialties Section – Perfectly Centered */}
          <div className="mt-20 bg-white">
            <div className="container mx-auto px-6">
              {/* Horizontally Centered Scrollable Row */}
              <div className="flex justify-center">
                <div className="overflow-x-auto scrollbar-hide py-6 px-2 max-w-7xl">
                  <div className="inline-flex gap-10 items-center">
                    {healthcareCategories.map((cat, index) => (
                      <motion.button
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.12, y: -10 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCategory(cat.title)}
                        className="flex flex-col items-center group cursor-pointer flex-shrink-0"
                      >
                        <div
                          className={`w-20 h-20 ${cat.color} rounded-3xl flex items-center justify-center mb-4 shadow-xl group-hover:shadow-2xl transition-all duration-300`}
                        >
                          <svg
                            className="w-10 h-10 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d={cat.icon} />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors whitespace-nowrap px-2">
                          {cat.title}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Minimal Trust Line */}
      <div className="container mx-auto px-6 mt-12 text-center">
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm font-medium text-gray-600">
          {[
            "50,000+ Happy Patients",
            "500+ Expert Doctors",
            "24/7 Support",
            "100% Secure & Private",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingHero;
