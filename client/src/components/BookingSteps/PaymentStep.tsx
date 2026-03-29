import { httpService } from "@/service/httpService";
import { userAuthStore } from "@/store/authStore";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Lock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Loader2,
  XCircle,
  Phone,
  Video,
  Calendar,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentStepInterface {
  selectedDate: Date | undefined;
  selectedSlot: string;
  consultationType: string;
  doctorName: string;
  slotDuration: number;
  consultationFee: number;
  isProcessing: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onPaymentSuccess?: (appointment: any) => void;
  loading: boolean;
  appointmentId?: string;
  patientName?: string;
}

const PaymentStep = ({
  selectedDate,
  selectedSlot,
  consultationType,
  doctorName,
  slotDuration,
  consultationFee,
  isProcessing,
  onBack,
  onConfirm,
  onPaymentSuccess,
  appointmentId,
  patientName,
  loading,
}: PaymentStepInterface) => {
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");
  const { user } = userAuthStore();
  const [error, setError] = useState("");
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const modelCloseCountRef = useRef(0);

  const platformFees = Math.round(consultationFee * 0.1);
  const totalAmount = consultationFee + platformFees;
  const [shouldAutoOpen, setShouldAutoOpen] = useState(true);

  useEffect(() => {
    if (appointmentId && patientName && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [appointmentId, patientName]);

  useEffect(() => {
    if (
      appointmentId &&
      patientName &&
      paymentStatus === "idle" &&
      !isPaymentLoading &&
      shouldAutoOpen
    ) {
      const timer = setTimeout(() => handlePayment(), 800);
      return () => clearTimeout(timer);
    }
  }, [
    appointmentId,
    patientName,
    paymentStatus,
    isPaymentLoading,
    shouldAutoOpen,
  ]);

  const handlePayment = async () => {
    if (!appointmentId || !patientName) {
      onConfirm();
      return;
    }

    try {
      setIsPaymentLoading(true);
      setError("");
      setPaymentStatus("processing");

      const orderResponse = await httpService.postWithAuth(
        "payment/create-order",
        { appointmentId }
      );
      if (!orderResponse.success)
        throw new Error(orderResponse.message || "Failed to create order");

      const { orderId, amount, currency, key } = orderResponse.data;

      const options = {
        key,
        amount: amount * 100,
        currency,
        name: "MediConnect",
        description: `Consultation with Dr. ${doctorName}`,
        image: "/logo.png",
        order_id: orderId,
        handler: async (response: any) => {
          try {
            const verifyResponse = await httpService.postWithAuth(
              "payment/verify-payment",
              {
                appointmentId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }
            );

            if (verifyResponse.success) {
              setPaymentStatus("success");
              if (onPaymentSuccess) onPaymentSuccess(verifyResponse.data);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (err: any) {
            setPaymentStatus("failed");
            setError(err.message || "Payment failed. Please try again.");
          }
        },
        prefill: {
          name: patientName,
          email: user?.email,
          contact: user?.phone,
        },
        theme: { color: "#3b82f6" },
        modal: {
          ondismiss: () => {
            modelCloseCountRef.current += 1;
            if (modelCloseCountRef.current === 1) {
              setTimeout(() => handlePayment(), 1500);
            } else {
              setShouldAutoOpen(false);
              setPaymentStatus("idle");
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setPaymentStatus("failed");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handlePayNow = () => {
    modelCloseCountRef.current = 0;
    handlePayment();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-900"
        >
          Complete Your Booking
        </motion.h1>
        <p className="mt-4 text-lg text-gray-600">
          One last step to confirm your appointment
        </p>
      </div>

      {/* Main Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Summary */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
              <h3 className="text-2xl font-bold">Appointment Summary</h3>
              <p className="opacity-90">Dr. {doctorName}</p>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-bold text-gray-900">
                      {selectedDate?.toLocaleDateString("en-IN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                      <br />
                      <span className="text-blue-600 text-xl">
                        {selectedSlot}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-2xl">
                  <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white">
                    {consultationType.includes("Video") ? (
                      <Video className="w-6 h-6" />
                    ) : (
                      <Phone className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Consultation Type</p>
                    <p className="font-bold text-gray-900">
                      {consultationType}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between text-lg">
                  <span>Consultation Fee</span>
                  <span className="font-semibold">₹{consultationFee}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>
                    Platform Fee{" "}
                    <Badge className="ml-2 text-xs">incl. GST</Badge>
                  </span>
                  <span className="font-semibold">₹{platformFees}</span>
                </div>
                <div className="border-t-2 border-dashed border-gray-300 pt-4">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total Amount</span>
                    <span className="text-green-600">₹{totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center gap-2 text-green-700">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-sm font-medium">100% Secure</span>
                </div>
                <div className="flex items-center gap-2 text-blue-700">
                  <Lock className="w-5 h-5" />
                  <span className="text-sm font-medium">Encrypted Payment</span>
                </div>
                <div className="flex items-center gap-2 text-purple-700">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm font-medium">
                    Instant Confirmation
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right: Payment Action */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-24"
          >
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-3xl shadow-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Complete Payment</h3>

              <AnimatePresence mode="wait">
                {paymentStatus === "idle" && (
                  <motion.div
                    key="pay"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <div className="text-5xl font-extrabold">
                        ₹{totalAmount}
                      </div>
                      <p className="mt-2 opacity-90">One-time secure payment</p>
                    </div>

                    <Button
                      size="lg"
                      onClick={handlePayNow}
                      disabled={isPaymentLoading || loading}
                      className="
    relative w-full h-14 text-lg font-bold rounded-2xl
    bg-gradient-to-r from-green-600 to-cyan-500
    text-white shadow-lg hover:shadow-2xl
    transition-all duration-300
    hover:scale-[1.03] active:scale-[0.97]
    disabled:opacity-70 disabled:cursor-not-allowed
    overflow-hidden p-2
  "
                    >
                      {/* Glow Effect */}
                      <span className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-20 transition-opacity duration-300"></span>

                      {isPaymentLoading || loading ? (
                        <>
                          <Loader2 className="mr-3 w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-1 w-6 h-6" />
                          Pay & Confirm
                        </>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={onBack}
                      className="w-full text-white/80 hover:text-white hover:bg-white/20"
                    >
                      ← Back to Details
                    </Button>
                  </motion.div>
                )}

                {paymentStatus === "processing" && (
                  <motion.div key="processing" className="text-center py-10">
                    <Loader2 className="w-16 h-16 mx-auto animate-spin" />
                    <p className="mt-6 text-xl font-semibold">
                      Processing Payment...
                    </p>
                    <p className="text-sm opacity-80 mt-2">
                      Please don't close or refresh
                    </p>
                  </motion.div>
                )}

                {paymentStatus === "success" && (
                  <motion.div key="success" className="text-center py-12">
                    <CheckCircle2 className="w-20 h-20 mx-auto text-white" />
                    <h3 className="mt-6 text-3xl font-bold">
                      Payment Successful!
                    </h3>
                    <p className="mt-3 text-lg opacity-90">
                      Your appointment is confirmed
                    </p>
                  </motion.div>
                )}

                {paymentStatus === "failed" && (
                  <motion.div
                    key="failed"
                    className="text-center py-10 space-y-6"
                  >
                    <XCircle className="w-20 h-20 mx-auto text-red-400" />
                    <div>
                      <h3 className="text-2xl font-bold">Payment Failed</h3>
                      <p className="mt-2 text-sm opacity-80">{error}</p>
                    </div>
                    <Button
                      onClick={handlePayNow}
                      className="w-full bg-white text-blue-600 hover:bg-gray-100"
                    >
                      Try Again
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PaymentStep;
