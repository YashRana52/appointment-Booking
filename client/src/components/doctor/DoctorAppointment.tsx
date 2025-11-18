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
  Stethoscope,
  Video,
  XCircle,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { emptyStates, getStatusColor } from "@/lib/constant";
import PrescriptionViewModal from "./PrescriptionViewModal";

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

    const upcomingAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.slotStartIso);
      return (
        (aptDate >= now || apt.status === "In Progress") &&
        (apt.status === "Scheduled" || apt.status === "In Progress")
      );
    });

    const pastAppointments = appointments.filter((apt) => {
      const aptDate = new Date(apt.slotStartIso);
      return (
        aptDate < now ||
        apt.status === "Completed" ||
        apt.status === "Cancelled"
      );
    });

    setTabCounts({
      upcoming: upcomingAppointments.length,
      past: pastAppointments.length,
    });
  }, [appointments]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const appointmentDate = new Date(dateString);
    return appointmentDate.toDateString() === today.toDateString();
  };

  const canJoinCall = (appointment: any) => {
    const appointmentTime = new Date(appointment.slotStartIso);
    const now = new Date();
    const diffMintues =
      (appointmentTime.getTime() - now.getTime()) / (1000 * 60);

    return (
      isToday(appointment.slotStartIso) &&
      diffMintues <= 15 &&
      diffMintues >= -120 &&
      (appointment.status === "Scheduled" ||
        appointment.status === "In Progress")
    );
  };

  const canMarkCancelled = (appointment: any) => {
    const appointmentTime = new Date(appointment.slotStartIso);
    const now = new Date();
    return appointment.status === "Scheduled" && now < appointmentTime;
  };

  const handleMarkCancelled = async (appointmentId: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await updateAppointmentStatus(appointmentId, "Cancelled");
        fetchAppointments("doctor", activeTab);
      } catch (error) {
        console.error("Failed to cancel appointment", error);
      }
    }
  };

  if (!user) return null;

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const PrescriptionModal =
      PrescriptionViewModal as unknown as React.ComponentType<{
        appointment: Appointment;
        userType: string;
        trigger: React.ReactElement;
      }>;

    return (
      <Card className="hover:shadow-xl transition-all border border-gray-200 rounded-2xl bg-white">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <Avatar className="w-20 h-20 shadow">
              <AvatarImage
                src={appointment.patientId?.profileImage}
                alt={appointment.patientId?.name}
              />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-3xl font-bold">
                {appointment.patientId?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Details */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {appointment.patientId?.name}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Age: {appointment.patientId?.age}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {appointment.patientId?.email}
                  </p>
                </div>

                <div className="text-right">
                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                  {isToday(appointment.slotStartIso) && (
                    <p className="text-xs text-blue-500 mt-1 font-semibold">
                      TODAY
                    </p>
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {formatDate(appointment.slotStartIso)}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600">
                    {appointment.consultationType === "Video Consultation" ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <Phone className="w-4 h-4" />
                    )}
                    <span className="text-sm">
                      {appointment.consultationType}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Fee:</span> ₹
                    {appointment.doctorId?.fees}
                  </p>
                  {appointment.symptoms && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      <span className="font-medium">Symptoms: </span>
                      {appointment.symptoms}
                    </p>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-3">
                  {canJoinCall(appointment) && (
                    <Link href={`/call/${appointment._id}`}>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <Video className="w-4 h-4 mr-2" />
                        Start Consultation
                      </Button>
                    </Link>
                  )}

                  {canMarkCancelled(appointment) && (
                    <Button
                      variant="outline"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleMarkCancelled(appointment._id)}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Cancel
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
                            className="border-green-300 text-green-700"
                          >
                            <Stethoscope className="w-4 h-4 mr-2" />
                            View Report
                          </Button>
                        }
                      />
                    )}
                </div>

                {appointment.status === "Completed" && (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const EmptyState = ({ tab }: { tab: string }) => {
    const state = emptyStates[tab as keyof typeof emptyStates];
    const Icon = state.icon;

    return (
      <Card className="p-10 text-center bg-white rounded-2xl shadow-md">
        <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold">{state.title}</h3>
        <p className="text-gray-600">{state.description}</p>
      </Card>
    );
  };

  return (
    <>
      <Header showDashboardNav={true} />

      <div className="min-h-screen bg-[#f6f8fc] pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                My Appointments
              </h1>
              <p className="text-gray-600">
                Manage all your patient consultations
              </p>
            </div>

            <Link href="/doctor/profile">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="w-4 h-4 mr-2" />
                Update Availability
              </Button>
            </Link>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-2 bg-white shadow rounded-xl p-1">
              <TabsTrigger value="upcoming" className="rounded-lg">
                <Clock className="w-4 h-4 mr-2" /> Upcoming (
                {tabCounts.upcoming})
              </TabsTrigger>
              <TabsTrigger value="past" className="rounded-lg">
                <Calendar className="w-4 h-4 mr-2" /> Past ({tabCounts.past})
              </TabsTrigger>
            </TabsList>

            {/* Upcoming */}
            <TabsContent value="upcoming">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Card
                      key={i}
                      className="animate-pulse h-40 bg-gray-200 rounded-xl"
                    />
                  ))}
                </div>
              ) : appointments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {appointments.map((apt) => (
                    <AppointmentCard key={apt._id} appointment={apt} />
                  ))}
                </div>
              ) : (
                <EmptyState tab="upcoming" />
              )}
            </TabsContent>

            {/* Past */}
            <TabsContent value="past">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <Card
                      key={i}
                      className="animate-pulse h-40 bg-gray-200 rounded-xl"
                    />
                  ))}
                </div>
              ) : appointments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
