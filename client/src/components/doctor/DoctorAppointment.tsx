"use client";

import React, { useEffect, useState } from "react";
import Header from "../landing/Header";
import { userAuthStore } from "@/store/authStore";
import { Appointment, useAppointmentStore } from "@/store/appointmentStore";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Calendar,
  Clock,
  FileText,
  MapPin,
  Phone,
  Star,
  Stethoscope,
  Video,
  XCircle,
  CalendarCheck,
  CalendarX,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { emptyStates, getStatusColor } from "@/lib/constant";
import PrescriptionViewModel from "./PrescriptionViewModel";
import { motion } from "framer-motion";

const DoctorAppointmentContent = () => {
  const { user } = userAuthStore();
  const { appointments, fetchAppointments, loading, updateAppointmentStatus } =
    useAppointmentStore();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [tabCounts, setTabCounts] = useState({ upcoming: 0, past: 0 });

  useEffect(() => {
    if (user?.type === "doctor") {
      fetchAppointments("doctor", activeTab);
    }
  }, [user, activeTab, fetchAppointments]);

  useEffect(() => {
    const now = new Date();
    const upcoming = appointments.filter((apt) => {
      const date = new Date(apt.slotStartIso);
      return (
        (date >= now || apt.status === "In Progress") &&
        ["Scheduled", "In Progress"].includes(apt.status)
      );
    });
    const past = appointments.filter((apt) => {
      const date = new Date(apt.slotStartIso);
      return date < now || ["Completed", "Cancelled"].includes(apt.status);
    });

    setTabCounts({ upcoming: upcoming.length, past: past.length });
  }, [appointments]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isToday = (date: string) =>
    new Date(date).toDateString() === new Date().toDateString();

  const canJoinCall = (apt: Appointment) => {
    const diff = (new Date(apt.slotStartIso).getTime() - Date.now()) / 60000;
    return (
      isToday(apt.slotStartIso) &&
      diff <= 15 &&
      diff >= -120 &&
      ["Scheduled", "In Progress"].includes(apt.status)
    );
  };

  const canCancel = (apt: Appointment) =>
    apt.status === "Scheduled" && new Date(apt.slotStartIso) > new Date();

  const handleCancel = async (id: string) => {
    if (confirm("Cancel this appointment?")) {
      await updateAppointmentStatus(id, "Cancelled");
      fetchAppointments("doctor", activeTab);
    }
  };

  if (!user) return null;

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const PrescriptionModal = PrescriptionViewModel as any;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="group relative overflow-hidden bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />

          <CardContent className="p-8 relative z-10">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Patient Avatar */}
              <div className="relative">
                <Avatar className="w-24 h-24 ring-4 ring-white shadow-2xl border-4 border-blue-100">
                  <AvatarImage src={appointment.patientId?.profileImage} />
                  <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                    {appointment.patientId?.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                {isToday(appointment.slotStartIso) && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    TODAY
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {appointment.patientId?.name}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Age: {appointment.patientId?.age} •{" "}
                      {appointment.patientId?.gender}
                    </p>
                  </div>
                  <Badge
                    className={`${getStatusColor(
                      appointment.status
                    )} text-lg px-4 py-1 font-semibold`}
                  >
                    {appointment.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">
                        {formatDate(appointment.slotStartIso)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {appointment.consultationType === "Video Consultation" ? (
                        <Video className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Phone className="w-5 h-5 text-green-600" />
                      )}
                      <span className="font-medium">
                        {appointment.consultationType}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <span className="text-sm line-clamp-2">
                        {appointment.symptoms || "No symptoms mentioned"}
                      </span>
                    </div>
                    <p className="text-xl font-bold text-gray-800">
                      ₹{appointment.doctorId?.fees}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-200">
                  {canJoinCall(appointment) && (
                    <Link href={`/call/${appointment._id}`}>
                      <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg text-lg px-8 h-12 rounded-2xl font-semibold">
                        <Video className="w-5 h-5 mr-3" />
                        Start Consultation
                      </Button>
                    </Link>
                  )}

                  {canCancel(appointment) && (
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50 shadow-md"
                      onClick={() => handleCancel(appointment._id)}
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Cancel Appointment
                    </Button>
                  )}

                  {appointment.status === "Completed" &&
                    appointment.prescription && (
                      <PrescriptionModal
                        appointment={appointment}
                        userType="doctor"
                        trigger={
                          <Button
                            variant="outline"
                            className="border-green-300 text-green-700 hover:bg-green-50"
                          >
                            <Stethoscope className="w-5 h-5 mr-2" />
                            View Prescription
                          </Button>
                        }
                      />
                    )}

                  {appointment.status === "Completed" && (
                    <div className="flex items-center gap-1 ml-auto">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-6 h-6 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="ml-2 text-lg font-medium text-gray-700">
                        Excellent
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const EmptyState = ({ tab }: { tab: string }) => {
    const state =
      tab === "upcoming"
        ? {
            icon: CalendarX,
            title: "No Upcoming Appointments",
            description: "Your schedule is free. Patients can book anytime!",
          }
        : {
            icon: CalendarCheck,
            title: "No Past Appointments",
            description: "Start consulting to see history here",
          };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >
        <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-8">
          <state.icon className="w-16 h-16 text-blue-600" />
        </div>
        <h3 className="text-3xl font-bold text-gray-800 mb-3">{state.title}</h3>
        <p className="text-lg text-gray-600 max-w-md mx-auto">
          {state.description}
        </p>
      </motion.div>
    );
  };

  return (
    <>
      <Header showDashBoardNav={true} />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  My Appointments
                </h1>
                <p className="text-xl text-gray-600 mt-3">
                  Manage and consult with your patients seamlessly
                </p>
              </div>
              <Link href="/doctor/profile">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-xl text-lg px-8 h-14 rounded-2xl font-semibold"
                >
                  <Calendar className="w-6 h-6 mr-3" />
                  Update Availability
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-10 flex flex-col items-center"
          >
            <TabsList
              className="
    bg-white/80 backdrop-blur-xl shadow-2xl 
    rounded-2xl p-2 
    w-full max-w-md 
    flex justify-between
  "
            >
              <TabsTrigger
                value="upcoming"
                className="
        flex items-center justify-center w-full
        data-[state=active]:bg-gradient-to-r 
        data-[state=active]:from-blue-600 
        data-[state=active]:to-indigo-700 
        data-[state=active]:text-white 
        rounded-xl text-lg py-4 font-semibold 
        transition-all
      "
              >
                <Clock className="w-5 h-5 mr-3" />
                Upcoming ({tabCounts.upcoming})
              </TabsTrigger>

              <TabsTrigger
                value="past"
                className="
        flex items-center justify-center w-full
        data-[state=active]:bg-gradient-to-r 
        data-[state=active]:from-purple-600 
        data-[state=active]:to-pink-600 
        data-[state=active]:text-white 
        rounded-xl text-lg py-4 font-semibold 
        transition-all
      "
              >
                <CalendarCheck className="w-5 h-5 mr-3" />
                Past ({tabCounts.past})
              </TabsTrigger>
            </TabsList>

            {/* UPCOMING */}
            <TabsContent value="upcoming" className="mt-10 w-full">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-64 bg-white/70 backdrop-blur rounded-3xl animate-pulse shadow-xl"
                    />
                  ))}
                </div>
              ) : appointments.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {appointments.map((apt) => (
                    <AppointmentCard key={apt._id} appointment={apt} />
                  ))}
                </div>
              ) : (
                <EmptyState tab="upcoming" />
              )}
            </TabsContent>

            {/* PAST */}
            <TabsContent value="past" className="mt-10 w-full">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="h-64 bg-white/70 backdrop-blur rounded-3xl animate-pulse shadow-xl"
                    />
                  ))}
                </div>
              ) : appointments.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {appointments.map((apt) => (
                    <AppointmentCard key={apt._id} appointment={apt} />
                  ))}
                </div>
              ) : (
                <EmptyState tab="past" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default DoctorAppointmentContent;
