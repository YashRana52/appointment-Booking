import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { healthcareCategories } from "@/lib/constant";
import { useRouter } from "next/navigation";
import { userAuthStore } from "@/store/authStore";

function LandingHero() {
  const { isAuthenticated } = userAuthStore();

  const router = useRouter();

  const handleBookConsultation = () => {
    if (isAuthenticated) {
      router.push("/doctor-list");
    } else {
      router.push("/signup-patient");
    }
  };

  const handleCategoryClick = (categoryTitle: string) => {
    if (isAuthenticated) {
      router.push(`/doctor-list?category=${categoryTitle}`);
    } else {
      router.push("/signup-patient");
    }
  };

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-blue-50 via-white to-blue-100">
      <div className="container mx-auto text-center">
        {/* Hero Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-900 leading-tight mb-6">
          <span className="block">Your Health,</span>
          <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Our Priority.
          </span>
        </h1>

        <p className="text-gray-600 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Consult expert doctors online, anytime and anywhere. Get
          prescriptions, medical advice, and care — all from the comfort of your
          home.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button
            onClick={handleBookConsultation}
            size="lg"
            className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white shadow-lg shadow-blue-200 transition-all duration-300 transform hover:-translate-y-1"
          >
            Book a Video Visit
          </Button>

          <Link href="/login/doctor">
            <Button
              variant="outline"
              size="lg"
              className="text-blue-700 border-2 border-blue-700 bg-white hover:bg-blue-50 transition-all duration-300 transform hover:-translate-y-1"
            >
              Login as a Doctor
            </Button>
          </Link>
        </div>

        {/* Categories */}
        <section className="py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center overflow-x-auto gap-6 pb-2 scrollbar-hide">
              {healthcareCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.title)}
                  className="flex flex-col items-center min-w-[90px] group transition-all duration-300 hover:scale-105"
                >
                  <div
                    className={`w-12 h-12 ${category.color} rounded-2xl flex items-center justify-center mb-2 group-hover:shadow-lg group-hover:brightness-110 transition-all duration-300`}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={category.icon} />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-blue-900 text-center leading-tight group-hover:text-blue-700">
                    {category.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600 mt-8">
          {[
            "10+ Certified Doctors",
            "5,000+ Happy Patients",
            "24/7 Medical Support",
          ].map((item, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LandingHero;
