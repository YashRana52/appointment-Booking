"use client";
import React, { useEffect, useState } from "react";
import Header from "../landing/Header";
import { userAuthStore } from "@/store/authStore";
import { Appointment, useAppointmentStore } from "@/store/appointmentStore";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";
import {
  Calendar,
  Clock,
  FileText,
  MapPin,
  Phone,
  Star,
  Video,
  CalendarDays,
  Stethoscope,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { getStatusColor } from "@/lib/constant";
import PrescriptionViewModal from "../doctor/PrescriptionViewModel";
import { format } from "date-fns";

const PatientDashboardContent = () => {
  const { user } = userAuthStore();
  const { appointments, fetchAppointments, loading } = useAppointmentStore();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [tabCounts, setTabCounts] = useState({ upcoming: 0, past: 0 });

  useEffect(() => {
    if (user?.type === "patient") {
      fetchAppointments("patient", activeTab);
    }
  }, [user, activeTab, fetchAppointments]);

  useEffect(() => {
    const now = new Date();
    const upcoming = appointments.filter((apt) => {
      const aptDate = new Date(apt.slotStartIso);
      return (
        (aptDate >= now || apt.status === "In Progress") &&
        (apt.status === "Scheduled" || apt.status === "In Progress")
      );
    });

    const past = appointments.filter((apt) => {
      const aptDate = new Date(apt.slotStartIso);
      return (
        aptDate < now ||
        apt.status === "Completed" ||
        apt.status === "Cancelled"
      );
    });

    setTabCounts({ upcoming: upcoming.length, past: past.length });
  }, [appointments]);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE, MMMM d, yyyy 'at' h:mm a");
  };

  const isToday = (dateString: string) => {
    return (
      format(new Date(dateString), "yyyy-MM-dd") ===
      format(new Date(), "yyyy-MM-dd")
    );
  };

  const canJoinCall = (appointment: Appointment) => {
    const appointmentTime = new Date(appointment.slotStartIso);
    const now = new Date();
    const diffMinutes =
      (appointmentTime.getTime() - now.getTime()) / (1000 * 60);
    return (
      isToday(appointment.slotStartIso) &&
      diffMinutes <= 15 &&
      diffMinutes >= -120 &&
      (appointment.status === "Scheduled" ||
        appointment.status === "In Progress")
    );
  };

  if (!user) return null;

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/90 backdrop-blur-xl rounded-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardContent className="p-8 relative">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Doctor Avatar */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="w-24 h-24 ring-4 ring-white shadow-xl">
                <AvatarImage src={appointment.doctorId?.profileImage} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl font-bold">
                  {appointment.doctorId?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              {canJoinCall(appointment) && (
                <div className="absolute -top-2 -right-2 animate-ping">
                  <div className="w-5 h-5 bg-green-500 rounded-full" />
                </div>
              )}
            </div>
            {isToday(appointment.slotStartIso) && (
              <span className="mt-3 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                TODAY
              </span>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Dr. {appointment.doctorId?.name}
                </h3>
                <p className="text-lg text-gray-600 mt-1">
                  {appointment.doctorId?.specialization}
                </p>
                <div className="flex items-center gap-2 text-gray-500 mt-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">
                    {appointment.doctorId?.hospitalInfo?.name}
                  </span>
                </div>
              </div>

              <Badge
                className={`text-sm font-medium px-4 py-2 ${getStatusColor(
                  appointment.status
                )}`}
              >
                {appointment.status === "In Progress"
                  ? "Live Now"
                  : appointment.status}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Appointment</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(appointment.slotStartIso)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-xl ${
                      appointment.consultationType.includes("Video")
                        ? "bg-purple-100"
                        : "bg-green-100"
                    }`}
                  >
                    {appointment.consultationType.includes("Video") ? (
                      <Video className="w-5 h-5 text-purple-600" />
                    ) : (
                      <Phone className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <span className="font-medium">
                    {appointment.consultationType}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Consultation Fee</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ₹{appointment.doctorId?.fees}
                  </span>
                </div>
                {appointment.symptoms && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Symptoms</p>
                    <p className="text-gray-700 bg-gray-50 px-4 py-2 rounded-lg text-sm">
                      {appointment.symptoms}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4">
              {canJoinCall(appointment) && (
                <Link href={`/call/${appointment._id}`}>
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    <Video className="w-5 h-5 mr-2" />
                    Join Video Call
                  </Button>
                </Link>
              )}

              {appointment.status === "Completed" &&
                appointment.prescription && (
                  <PrescriptionViewModal
                    appointment={appointment}
                    userType="patient"
                    trigger={
                      <Button
                        variant="outline"
                        className="border-2 hover:bg-gray-50 font-medium"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Prescription
                      </Button>
                    }
                  />
                )}

              {appointment.status === "Completed" && (
                <div className="flex items-center ml-auto">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 fill-amber-400 text-amber-400"
                    />
                  ))}
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    Thank you!
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = ({ tab }: { tab: string }) => {
    const config = {
      upcoming: {
        icon: Stethoscope,
        title: "No Upcoming Appointments",
        description:
          "You're all caught up! Book your next consultation when needed.",
        gradient: "from-blue-500 to-purple-600",
      },
      past: {
        icon: FileText,
        title: "No Past Appointments Yet",
        description:
          "Your completed consultations and prescriptions will appear here.",
        gradient: "from-gray-400 to-gray-600",
      },
    };

    const {
      icon: Icon,
      title,
      description,
      gradient,
    } = config[tab as keyof typeof config];

    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div
          className={`p-8 rounded-full bg-gradient-to-br ${gradient} shadow-2xl mb-8`}
        >
          <Icon className="w-16 h-16 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-lg text-gray-600 max-w-md text-center mb-10">
          {description}
        </p>
        {tab === "upcoming" && (
          <Link href="/doctor-list">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg px-10 py-7 shadow-xl"
            >
              <Calendar className="w-6 h-6 mr-3" />
              Book Your First Appointment
            </Button>
          </Link>
        )}
      </div>
    );
  };

  return (
    <>
      <Header showDashBoardNav={true} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-20">
        <div className="container mx-auto px-6 py-5">
          {/* Header Section */}
          <div className="text-center md:text-left mb-2">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              My Appointments
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Manage your health journey with ease
            </p>
          </div>

          <div className="flex justify-end mb-8">
            <Link href="/doctor-list">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-bold shadow-xl"
              >
                <Calendar className="w-5 h-5 mr-2" />
                Book New Appointment
              </Button>
            </Link>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-5"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-16 rounded-2xl bg-white/80 backdrop-blur-xl shadow-xl p-2">
              <TabsTrigger
                value="upcoming"
                className="rounded-xl text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-300"
              >
                <Clock className="w-5 h-5 mr-2" />
                Upcoming ({tabCounts.upcoming})
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="rounded-xl text-lg font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600 data-[state=active]:to-gray-800 data-[state=active]:text-white transition-all duration-300"
              >
                <CalendarDays className="w-5 h-5 mr-2" />
                Past ({tabCounts.past})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-10">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <Card
                      key={i}
                      className="animate-pulse bg-white/50 backdrop-blur"
                    >
                      <CardContent className="p-8">
                        <div className="flex gap-8">
                          <div className="w-24 h-24 bg-gray-300 rounded-full" />
                          <div className="flex-1 space-y-4">
                            <div className="h-8 bg-gray-300 rounded w-3/4" />
                            <div className="h-5 bg-gray-200 rounded w-1/2" />
                            <div className="h-20 bg-gray-100 rounded-xl" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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

            <TabsContent value="past">
              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <Card
                      key={i}
                      className="animate-pulse bg-white/50 backdrop-blur"
                    >
                      <CardContent className="p-8">
                        <div className="flex gap-8">
                          <div className="w-24 h-24 bg-gray-300 rounded-full" />
                          <div className="flex-1 space-y-4">
                            <div className="h-8 bg-gray-300 rounded w-3/4" />
                            <div className="h-5 bg-gray-200 rounded w-1/2" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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

export default PatientDashboardContent;
