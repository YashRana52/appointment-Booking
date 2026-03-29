"use client";

import React, { useEffect, useState } from "react";
import Header from "../landing/Header";
import { useSearchParams } from "next/navigation";
import { userAuthStore } from "@/store/authStore";
import { useDoctorStore } from "@/store/doctorStore";
import { useAppointmentStore } from "@/store/appointmentStore";
import {
  Activity,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  IndianRupee,
  MapPin,
  Phone,
  Plus,
  Star,
  TrendingUp,
  User,
  Users,
  Video,
} from "lucide-react";
import PrescriptionModel from "./PrescriptionModel";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { getStatusColor } from "@/lib/constant";
import { motion } from "framer-motion";

export default function DoctorDashboardContent() {
  const searchParams = useSearchParams();
  const { user } = userAuthStore();
  const {
    dashboard: dashboardData,
    fetchDashboard,
    loading,
  } = useDoctorStore();
  const { endConsultation, fetchAppointmentById, currentAppointment } =
    useAppointmentStore();

  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [completingAppointmentId, setCompletingAppointmentId] = useState<
    string | null
  >(null);
  const [modelLoading, setModelLoading] = useState(false);

  useEffect(() => {
    if (user?.type === "doctor") fetchDashboard(user?.type);
  }, [user, fetchDashboard]);

  useEffect(() => {
    const completedCallId = searchParams.get("completedCall");
    if (completedCallId) {
      setCompletingAppointmentId(completedCallId);
      fetchAppointmentById(completedCallId);
      setShowPrescriptionModal(true);
    }
  }, [searchParams, fetchAppointmentById]);

  const handleSavePrescription = async (
    prescription: string,
    notes: string
  ) => {
    if (!completingAppointmentId) return;
    setModelLoading(true);
    try {
      await endConsultation(completingAppointmentId, prescription, notes);
      setShowPrescriptionModal(false);
      setCompletingAppointmentId(null);
      if (user?.type) {
        fetchDashboard(user?.type);
      }

      window.history.replaceState({}, "", window.location.pathname);
    } catch (error) {
      console.error("Failed to complete consultation", error);
    } finally {
      setModelLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowPrescriptionModal(false);
    setCompletingAppointmentId(null);
    window.history.replaceState({}, "", window.location.pathname);
  };

  const formatTime = (date: string) =>
    new Date(date).toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const canJoinCall = (apt: any) => {
    const diff = (new Date(apt.slotStartIso).getTime() - Date.now()) / 60000;
    return (
      diff <= 15 &&
      diff >= -120 &&
      ["Scheduled", "In Progress"].includes(apt.status)
    );
  };

  if (loading || !dashboardData) {
    return (
      <>
        <Header showDashBoardNav={true} />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20">
          <div className="container mx-auto px-6">
            <div className="animate-pulse space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 bg-gray-300 rounded-full"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-300 rounded w-96"></div>
                  <div className="h-6 bg-gray-200 rounded w-64"></div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-40 bg-white/70 backdrop-blur rounded-3xl"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const stats = [
    {
      title: "Total Patients",
      value: dashboardData?.stats?.totalPatients?.toLocaleString() || "0",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
      accent: "bg-blue-500",
    },
    {
      title: "Today's Appointments",
      value: dashboardData?.stats?.todayAppointments || "0",
      icon: Calendar,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      accent: "bg-emerald-500",
    },
    {
      title: "Total Revenue",
      value: `₹${(dashboardData?.stats?.totalRevenue || 0).toLocaleString()}`,
      icon: IndianRupee,
      color: "text-purple-600",
      bg: "bg-purple-50",
      accent: "bg-purple-500",
    },
    {
      title: "Completed Sessions",
      value: dashboardData?.stats?.completedAppointments || "0",
      icon: Activity,
      color: "text-orange-600",
      bg: "bg-orange-50",
      accent: "bg-orange-500",
    },
  ];

  return (
    <>
      <Header showDashBoardNav={true} />

      {/* Animated Gradient Background */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-20 overflow-hidden relative">
        <div className="absolute inset-0 bg-grid-white/5 pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-8">
                <div className="relative">
                  <Avatar className="w-32 h-32 ring-8 ring-white/50 shadow-2xl border-4 border-white">
                    <AvatarImage src={dashboardData?.user?.profileImage} />
                    <AvatarFallback className="text-5xl font-bold bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                      {dashboardData?.user?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 bg-green-500 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-full animate-pulse" />
                  </div>
                </div>

                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                    Welcome back,{" "}
                    <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                      Dr. {dashboardData?.user?.name?.split(" ").pop()}
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 mt-2 font-medium">
                    {dashboardData?.user?.specialization}
                  </p>
                  <div className="flex flex-wrap items-center gap-6 mt-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">
                        {dashboardData?.user?.hospitalInfo?.name},{" "}
                        {dashboardData?.user?.hospitalInfo?.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold text-gray-800">
                        {dashboardData?.stats?.averageRating || "4.9"}
                      </span>
                      <span className="text-sm text-gray-500">Excellent</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/doctor/profile">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-2xl text-lg px-8 h-14 rounded-2xl font-semibold"
                >
                  <Plus className="w-6 h-6 mr-3" />
                  Update Availability
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats Grid - Glassmorphic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="group"
              >
                <Card className="relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white rounded-2xl">
                  {/* Subtle Top Accent Border */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 ${stat.accent}`}
                  />

                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-5">
                      {/* Icon with Background */}
                      <div className={`p-3 rounded-xl ${stat.bg} shadow-sm`}>
                        <stat.icon className={`w-7 h-7 ${stat.color}`} />
                      </div>
                    </div>

                    {/* Title */}
                    <p className="text-sm font-medium text-gray-600 tracking-tight">
                      {stat.title}
                    </p>

                    {/* Value */}
                    <p className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">
                      {stat.value}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Appointments Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Today's Schedule */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Card className="overflow-hidden bg-white/80 backdrop-blur-2xl border-0 shadow-2xl rounded-3xl">
                <CardHeader className="">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Calendar className="w-8 h-8" />
                      <CardTitle className="text-2xl font-bold">
                        Today's Schedule
                      </CardTitle>
                      <Badge className="bg-white/20 text-white border-0 text-lg px-4">
                        {dashboardData.todayAppointments?.length || 0} Active
                      </Badge>
                    </div>
                    <Link href="/doctor/appointments">
                      <Button
                        variant="secondary"
                        className="bg-white/20 hover:bg-white/30 border-0"
                      >
                        View All <ChevronRight className="w-5 h-5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-6 max-h-96 overflow-y-auto">
                  {dashboardData.todayAppointments?.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.todayAppointments.map((apt: any) => (
                        <div
                          key={apt._id}
                          className="group relative p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-3">
                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                  {apt.patientId.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900">
                                    {apt.patientId.name}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {formatTime(apt.slotStartIso)}
                                  </p>
                                </div>
                                <Badge
                                  className={`${getStatusColor(
                                    apt.status
                                  )} font-semibold`}
                                >
                                  {apt.status}
                                </Badge>
                              </div>
                              <p className="text-gray-600 text-sm mt-2">
                                Age: {apt.patientId.age} •{" "}
                                {apt.symptoms.substring(0, 80)}...
                              </p>
                              <div className="flex items-center gap-6 mt-4">
                                {apt.consultationType ===
                                "Video Consultation" ? (
                                  <span className="flex items-center gap-2 text-blue-700 font-medium">
                                    <Video className="w-5 h-5" /> Video Call
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2 text-green-700 font-medium">
                                    <Phone className="w-5 h-5" /> Audio Call
                                  </span>
                                )}
                                <span className="text-lg font-bold text-gray-800">
                                  ₹{apt.doctorId.fees}
                                </span>
                              </div>
                            </div>

                            {canJoinCall(apt) && (
                              <Link href={`/call/${apt._id}`}>
                                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl text-lg px-8 h-12 rounded-2xl font-semibold">
                                  <Video className="w-5 h-5 mr-2" />
                                  Start Now
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-xl text-gray-500 font-medium">
                        No appointments today
                      </p>
                      <p className="text-gray-400 mt-2">
                        Enjoy your free time!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Appointments */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <Card className="h-full bg-white/70 backdrop-blur-2xl border border-white/30 shadow-xl rounded-3xl">
                <CardHeader className="px-6 pt-6 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-md">
                        <Clock className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-2xl font-extrabold text-gray-800 tracking-tight">
                        Upcoming
                      </CardTitle>
                    </div>

                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg border-none px-4 py-1 rounded-2xl shadow-md">
                      {dashboardData.upcommingAppointments?.length || 0}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="p-6 max-h-96 overflow-y-auto">
                  {dashboardData.upcommingAppointments?.length > 0 ? (
                    <div className="space-y-5">
                      {dashboardData.upcommingAppointments.map((apt: any) => (
                        <div
                          key={apt._id}
                          className="p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-purple-100 
              hover:shadow-[0_8px_25px_-5px_rgba(128,0,255,0.2)] transition-all duration-200 cursor-pointer
              hover:-translate-y-1"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-xl font-semibold text-gray-900">
                                {apt.patientId.name}
                              </h4>

                              <p className="text-sm text-gray-500 mt-1">
                                {formatTime(apt.slotStartIso)}
                              </p>

                              <p className="text-sm text-gray-500/80 mt-3 line-clamp-2">
                                {apt.symptoms}
                              </p>
                            </div>

                            <div className="text-right space-y-2">
                              <Badge
                                variant="outline"
                                className="border-purple-400 text-purple-600 bg-purple-50 px-3 py-1 rounded-xl"
                              >
                                {apt.consultationType === "Video Consultation"
                                  ? "Video"
                                  : "Audio"}
                              </Badge>

                              <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                                ₹{apt.doctorId.fees}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 mx-auto mb-6 bg-white/70 border border-gray-200 rounded-full shadow-inner flex items-center justify-center">
                        <Clock className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-xl text-gray-600 font-semibold">
                        All clear! ✨
                      </p>
                      <p className="text-gray-400 mt-2">
                        No upcoming appointments
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <PrescriptionModel
        isOpen={showPrescriptionModal}
        onClose={handleCloseModal}
        onSave={handleSavePrescription}
        patientName={currentAppointment?.patientId?.name || "Patient"}
        loading={modelLoading}
      />
    </>
  );
}
