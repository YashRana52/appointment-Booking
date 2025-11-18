"use client";
import React, { useEffect, useState } from "react";
import Header from "../landing/Header";
import { userAuthStore } from "@/store/authStore";
import { useAppointmentStore, Appointment } from "@/store/appointmentStore";

import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { Button } from "../ui/button";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

import {
  Badge,
  Calendar,
  Clock,
  FileText,
  MapPin,
  Phone,
  Star,
  Video,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import PrescriptionViewModal from "../doctor/PrescriptionViewModal";
import { getStatusColor } from "@/lib/constant";

function PatientDashBoardContent() {
  const { user } = userAuthStore();
  const { appointments, fetchAppointments, loading } = useAppointmentStore();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const [tabCounts, setTabCounts] = useState({ upcoming: 0, past: 0 });

  /** Fetch appointments */
  useEffect(() => {
    if (user?.type === "patient") {
      fetchAppointments("patient", activeTab);
    }
  }, [user, activeTab, fetchAppointments]);

  /** Count tabs */
  useEffect(() => {
    const now = new Date();

    const upcoming = appointments.filter((apt) => {
      const date = new Date(apt.slotStartIso);
      return (
        (date >= now && apt.status === "Scheduled") ||
        apt.status === "In Progress"
      );
    });

    const past = appointments.filter((apt) => {
      const date = new Date(apt.slotStartIso);
      return (
        date < now || apt.status === "Completed" || apt.status === "Cancelled"
      );
    });

    setTabCounts({ upcoming: upcoming.length, past: past.length });
  }, [appointments]);

  /** Helpers */
  const formatDate = (date: string) =>
    new Date(date).toLocaleString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const isToday = (date: string) => {
    const today = new Date();
    return today.toDateString() === new Date(date).toDateString();
  };

  const canJoinCall = (apt: Appointment) => {
    const now = new Date();
    const aptTime = new Date(apt.slotStartIso);
    const diff = (aptTime.getTime() - now.getTime()) / (1000 * 60);

    return (
      isToday(apt.slotStartIso) &&
      diff <= 15 &&
      diff >= -120 &&
      (apt.status === "Scheduled" || apt.status === "In Progress")
    );
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="hover:shadow-xl transition-all duration-200 rounded-2xl border-gray-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <Avatar className="w-20 h-20 mx-auto md:mx-0 shadow">
            <AvatarImage src={appointment.doctorId?.profileImage} />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
              {appointment.doctorId?.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {appointment.doctorId?.name}
                </h2>
                <p className="text-gray-600 text-sm">
                  {appointment.doctorId?.specialization}
                </p>
                <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{appointment.doctorId?.hospitalInfo?.name}</span>
                </div>
              </div>

              <div className="text-right">
                <Badge className={getStatusColor(appointment.status)}>
                  {appointment.status}
                </Badge>
                {isToday(appointment.slotStartIso) && (
                  <p className="text-xs text-blue-600 font-semibold mt-1">
                    TODAY
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <p className="flex items-center text-gray-700 text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(appointment.slotStartIso)}
                </p>

                <p className="flex items-center text-gray-700 text-sm">
                  {appointment.consultationType === "Video Consultation" ? (
                    <Video className="w-4 h-4 mr-2" />
                  ) : (
                    <Phone className="w-4 h-4 mr-2" />
                  )}
                  {appointment.consultationType}
                </p>
              </div>

              <div className="text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Fee: </span>₹
                  {appointment.doctorId?.fees}
                </p>

                {appointment.symptoms && (
                  <p className="text-xs mt-1 line-clamp-2">
                    <span className="font-semibold">Symptoms: </span>
                    {appointment.symptoms}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex justify-between items-center">
              <div className="flex gap-2">
                {canJoinCall(appointment) && (
                  <Link href={`/call/${appointment._id}`}>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Join Call
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
                          size="sm"
                          className="text-green-700 border-green-200 hover:bg-green-50"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          View Prescription
                        </Button>
                      }
                    />
                  )}
              </div>

              {appointment.status === "Completed" && (
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
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

  /** Empty State */
  const EmptyState = ({ type }: { type: "upcoming" | "past" }) => {
    const Info = {
      upcoming: {
        icon: Clock,
        title: "No Upcoming Appointments",
        desc: "You have no upcoming appointments scheduled.",
        book: true,
      },
      past: {
        icon: FileText,
        title: "No Past Appointments",
        desc: "Your completed appointments will appear here.",
        book: false,
      },
    }[type];

    return (
      <Card className="p-10 text-center rounded-2xl">
        <Info.icon className="w-16 h-16 text-gray-300 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-800">{Info.title}</h2>
        <p className="text-gray-600 mt-1 mb-4">{Info.desc}</p>

        {Info.book && (
          <Link href="/doctor-list">
            <Button>
              <Calendar className="w-4 h-4 mr-2" />
              Book Appointment
            </Button>
          </Link>
        )}
      </Card>
    );
  };

  return (
    <>
      <Header showDashBoardNav={true} />

      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                My Appointments
              </h1>
              <p className="text-gray-600 text-sm md:text-base">
                Manage your healthcare appointments
              </p>
            </div>

            <Link href="/doctor-list">
              <Button className="shadow">
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
            </Link>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 w-full rounded-xl">
              <TabsTrigger value="upcoming">
                <Clock className="w-4 h-4 mr-2" />
                Upcoming ({tabCounts.upcoming})
              </TabsTrigger>
              <TabsTrigger value="past">
                <Calendar className="w-4 h-4 mr-2" />
                Past ({tabCounts.past})
              </TabsTrigger>
            </TabsList>

            {/* UPCOMING */}
            <TabsContent value="upcoming" className="mt-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse p-6 h-40" />
                  ))}
                </div>
              ) : appointments.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {appointments.map((apt) => (
                    <AppointmentCard key={apt._id} appointment={apt} />
                  ))}
                </div>
              ) : (
                <EmptyState type="upcoming" />
              )}
            </TabsContent>

            {/* PAST */}
            <TabsContent value="past" className="mt-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse p-6 h-40" />
                  ))}
                </div>
              ) : appointments.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {appointments.map((apt) => (
                    <AppointmentCard key={apt._id} appointment={apt} />
                  ))}
                </div>
              ) : (
                <EmptyState type="past" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default PatientDashBoardContent;
