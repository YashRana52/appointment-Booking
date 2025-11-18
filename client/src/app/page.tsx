"use client";
import Brand from "@/components/landing/Brand";
import FAQ from "@/components/landing/FAQ";
import Footer from "@/components/landing/Footer";
import Header from "@/components/landing/Header";
import LandingHero from "@/components/landing/LandingHero";
import Testimonial from "@/components/landing/Testimonial";
import { userAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function Home() {
  const user = userAuthStore();

  const router = useRouter();

  useEffect(() => {
    if (user?.type === "doctor") {
      router.replace("/doctor/dashboard");
    }
  }, [user, router]);

  if (user?.type === "doctor") {
    return null;
  }

  return (
    <div className="min-h-screen bg-white ">
      <Header showDashBoardNav={false} />
      <main className="pt-16 ">
        <LandingHero />

        <Testimonial />
        <Brand />
        <FAQ />
        <Footer />
      </main>
    </div>
  );
}

export default Home;
