"use client";

import AppointmentCall from "@/components/calling/AppointmentCall";
import { useAppointmentStore } from "@/store/appointmentStore";
import { userAuthStore } from "@/store/authStore";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

import React, { use, useCallback, useEffect, useState } from "react";

function page() {
  const params = useParams();
  const router = useRouter();
  const appointmentId = params.appointmentId as string;
  const { currentAppointment, fetchAppointmentById, joinConsultation } =
    useAppointmentStore();
  const { user } = userAuthStore();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentById(appointmentId);
    }
  }, [appointmentId, fetchAppointmentById]);
  //jaise call end ho usko handle krna
  const handleCallEnd = useCallback(async () => {
    if (isNavigating) return;
    try {
      setIsNavigating(true);
      if (user?.type === "doctor") {
        router.push(`/doctor/dashboard/completedCall=${appointmentId}`);
      } else {
        router.push("/patient/dashboard");
      }
    } catch (error) {
      console.error("Error navigating after call end:", error);
      router.push("/");
    } finally {
      setIsNavigating(false);
    }
  }, [user?.type, router, appointmentId, isNavigating]);

  if (!currentAppointment || !user) {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading call room...</p>
        </div>
      </div>
    );
  }

  const currentUserData = {
    id: user.id,
    name: user.name,
    role: user.type as "doctor" | "patient",
  };
  return (
    <AppointmentCall
      appointment={currentAppointment}
      currentUser={currentUserData}
      onCallEnd={handleCallEnd}
      joinConsultation={joinConsultation}
    />
  );
}

export default page;
