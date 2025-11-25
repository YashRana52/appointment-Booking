"use client";
import DoctorProfile from "@/components/BookingSteps/DoctorProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Video,
  Phone,
  Calendar,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppointmentStore } from "@/store/appointmentStore";
import { useDoctorStore } from "@/store/doctorStore";
import CalenderStep from "@/components/BookingSteps/CalenderStep";
import ConsultationStep from "@/components/BookingSteps/ConsultationStep";
import PayementStep from "@/components/BookingSteps/PaymentStep";
import { toLocalYMD, convertTo24Hour, minutesToTime } from "@/lib/dateUtills";

const steps = [
  { id: 1, name: "Select Slot", icon: Calendar },
  { id: 2, name: "Patient Details", icon: Clock },
  { id: 3, name: "Payment", icon: CreditCard },
];

const BookingPage = () => {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.doctorId as string;

  const { currentDoctor, fetchDoctorById } = useDoctorStore();
  const { bookAppointment, loading, fetchBookedSlots, bookedSlots } =
    useAppointmentStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState("");
  const [consultationType, setConsultationType] =
    useState("Video Consultation");
  const [symptoms, setSymptoms] = useState("");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [createdAppointmentId, setCreatedAppointmentId] = useState<
    string | null
  >(null);
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    if (doctorId) fetchDoctorById(doctorId);
  }, [doctorId]);

  useEffect(() => {
    if (selectedDate && doctorId) {
      fetchBookedSlots(doctorId, toLocalYMD(selectedDate));
    }
  }, [selectedDate, doctorId]);

  // Generate available dates
  useEffect(() => {
    if (!currentDoctor?.availabilityRange) return;
    const { startDate, endDate } = currentDoctor.availabilityRange;
    const start = new Date(
      Math.max(new Date().setHours(0, 0, 0, 0), new Date(startDate).getTime())
    );
    const end = new Date(endDate);
    const dates: string[] = [];

    for (
      let d = new Date(start);
      d <= end && dates.length < 90;
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(toLocalYMD(d));
    }
    setAvailableDates(dates);
  }, [currentDoctor]);

  // Generate slots
  useEffect(() => {
    if (!selectedDate || !currentDoctor?.dailyTimeRanges) return;
    const slotDuration = currentDoctor.slotDurationMinutes || 30;
    const slots: string[] = [];

    currentDoctor.dailyTimeRanges.forEach((range: any) => {
      const startMins = timeToMinutes(range.start);
      const endMins = timeToMinutes(range.end);

      for (let m = startMins; m < endMins; m += slotDuration) {
        slots.push(minutesToTime(m));
      }
    });
    setAvailableSlots(slots);
  }, [selectedDate, currentDoctor]);

  const timeToMinutes = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedSlot || symptoms.trim().length === 0)
      return alert("Fill all fields");

    setIsPaymentProcessing(true);
    const dateStr = toLocalYMD(selectedDate);
    const start = new Date(`${dateStr}T${convertTo24Hour(selectedSlot)}`);
    const end = new Date(
      start.getTime() + (currentDoctor!.slotDurationMinutes || 30) * 60000
    );

    const baseFee = currentDoctor!.fees || 0;
    const fee = consultationType === "Voice Call" ? baseFee - 100 : baseFee;
    const platformFee = Math.round(fee * 0.1);
    const total = fee + platformFee;

    try {
      const appointment = await bookAppointment({
        doctorId,
        slotStartIso: start.toISOString(),
        slotEndIso: end.toISOString(),
        consultationType,
        symptoms,
        date: dateStr,
        consultationFees: fee,
        platformFees: platformFee,
        totalAmount: total,
      });

      if (appointment?._id) {
        setCreatedAppointmentId(appointment._id);
        setPatientName(appointment.patientId?.name || "You");
      }
    } catch (err) {
      console.error(err);
      setIsPaymentProcessing(false);
    }
  };

  const progress = (currentStep / 3) * 100;

  if (!currentDoctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <p className="text-lg text-gray-700">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <Link
              href="/doctor-list"
              className="flex items-center text-gray-700 hover:text-blue-600 transition"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-medium">Back to Doctors</span>
            </Link>
            <div className="flex-1 max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-3">
                {steps.map((step, i) => (
                  <div key={step.id} className="flex items-center">
                    <div
                      className={`flex items-center ${
                        currentStep >= step.id
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
                        ${
                          currentStep > step.id
                            ? "bg-green-500 text-white"
                            : currentStep === step.id
                            ? "bg-blue-600 text-white ring-4 ring-blue-100"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {currentStep > step.id ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <span className="ml-3 font-medium hidden sm:block">
                        {step.name}
                      </span>
                    </div>
                    {i < steps.length - 1 && (
                      <div
                        className={`w-24 h-1 mx-4 ${
                          currentStep > step.id + 1
                            ? "bg-green-500"
                            : currentStep > step.id
                            ? "bg-blue-600"
                            : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="w-24" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Doctor Card (Sticky) */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="sticky top-28"
            >
              <Card className="overflow-hidden shadow-xl border-0 bg-white/90 backdrop-blur">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-600" />
                <div className="relative px-8 pt-0 pb-8 -mt-16">
                  <DoctorProfile doctor={currentDoctor} />

                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        {consultationType === "Video Consultation" ? (
                          <Video className="w-6 h-6 text-blue-600" />
                        ) : (
                          <Phone className="w-6 h-6 text-green-600" />
                        )}
                        <span className="font-semibold">
                          {consultationType}
                        </span>
                      </div>
                      <Badge variant="secondary" className="bg-white">
                        {consultationType === "Voice Call"
                          ? "₹100 less"
                          : "Most Popular"}
                      </Badge>
                    </div>

                    {selectedDate && selectedSlot && (
                      <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                        <p className="text-sm text-gray-600 mb-2">
                          Your Appointment
                        </p>
                        <p className="font-bold text-lg text-gray-900">
                          {new Date(selectedDate).toLocaleDateString("en-IN", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                          {selectedSlot}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right: Steps */}
          <div className="lg:col-span-8">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl">
              <CardContent className="p-10">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="calendar"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Choose Date & Time
                      </h2>
                      <p className="text-gray-600 mb-8">
                        Select a convenient slot for your consultation
                      </p>
                      <CalenderStep
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        selectedSlot={selectedSlot}
                        setSelectedSlot={setSelectedSlot}
                        availableDates={availableDates}
                        availableSlots={availableSlots}
                        excludedWeekdays={
                          currentDoctor.availabilityRange?.excludedWeekdays ||
                          []
                        }
                        bookedSlots={bookedSlots}
                        onContinue={() => setCurrentStep(2)}
                      />
                    </motion.div>
                  )}

                  {currentStep === 2 && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                    >
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Tell us about your concern
                      </h2>
                      <p className="text-gray-600 mb-8">
                        This helps the doctor prepare better
                      </p>
                      <ConsultationStep
                        consultationType={consultationType}
                        setConsultationType={setConsultationType}
                        symptoms={symptoms}
                        setSymptoms={setSymptoms}
                        doctorFees={currentDoctor.fees}
                        onBack={() => setCurrentStep(1)}
                        onContinue={() => setCurrentStep(3)}
                      />
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="payment"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                    >
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Review & Pay
                      </h2>
                      <p className="text-gray-600 mb-8">
                        Complete your booking securely
                      </p>
                      <PayementStep
                        selectedDate={selectedDate}
                        selectedSlot={selectedSlot}
                        consultationType={consultationType}
                        doctorName={currentDoctor.name}
                        slotDuration={currentDoctor.slotDurationMinutes}
                        consultationFee={
                          consultationType === "Voice Call"
                            ? currentDoctor.fees - 100
                            : currentDoctor.fees
                        }
                        isProcessing={isPaymentProcessing}
                        onBack={() => setCurrentStep(2)}
                        onConfirm={handleBooking}
                        onPaymentSuccess={() =>
                          router.push("/patient/dashboard")
                        }
                        loading={loading}
                        appointmentId={createdAppointmentId || undefined}
                        patientName={patientName}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
