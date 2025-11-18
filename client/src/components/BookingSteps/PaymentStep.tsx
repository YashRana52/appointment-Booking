import { httpService } from "@/service/httpService";
import { userAuthStore } from "@/store/authStore";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle,
  CreditCard,
  Loader2,
  Shield,
  XCircle,
} from "lucide-react";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";

const Seperator = () => <div className="border-t border-gray-200 my-4"></div>;

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
  const [error, setError] = useState<string>("");
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const modelCloseCountRef = useRef<number>(0);

  const platformFees = Math.round(consultationFee * 0.1);
  const totalAmount = consultationFee + platformFees;
  const [shouldAutoOpen, setShouldAutoOpen] = useState(true);

  // Load Razorpay script
  useEffect(() => {
    if (appointmentId && patientName && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, [appointmentId, patientName]);

  // Auto-open payment
  useEffect(() => {
    if (
      appointmentId &&
      patientName &&
      paymentStatus === "idle" &&
      !isPaymentLoading &&
      shouldAutoOpen
    ) {
      const timer = setTimeout(() => handlePayment(), 500);
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

      // Create payment order
      const orderResponse = await httpService.postWithAuth(
        "payment/create-order",
        { appointmentId }
      );
      if (!orderResponse.success)
        throw new Error(
          orderResponse.message || "Failed to create payment order"
        );

      const { orderId, amount, currency, key } = orderResponse.data;

      const options = {
        key,
        amount: amount * 100,
        currency,
        name: "Doctor Consultation",
        description: `Consultation with Dr. ${doctorName}`,
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
            setError(err.message || "Payment verification failed");
          }
        },
        prefill: {
          name: patientName,
          email: user?.email,
          contact: user?.phone,
        },
        notes: { appointmentId, doctorName, patientName },
        theme: { color: "#2563EB" },
        modal: {
          ondismiss: () => {
            setPaymentStatus("idle");
            setError("");
            modelCloseCountRef.current += 1;
            if (modelCloseCountRef.current === 1) {
              setTimeout(() => handlePayment(), 1000);
            } else {
              setShouldAutoOpen(false);
            }
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.message || "Payment failed");
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
    <div className="space-y-8">
      <div>
        <h3 className="text-3xl font-semibold text-gray-900 tracking-tight mb-6">
          Confirm & Pay
        </h3>

        {/* Booking Summary */}
        <div className="bg-white shadow-lg border border-gray-100 p-6 rounded-2xl mb-6">
          <h4 className="font-semibold text-gray-900 mb-4 text-lg">
            Booking Summary
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Date & Time</span>
              <span className="font-medium text-gray-800">
                {selectedDate?.toDateString()} • {selectedSlot}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Consultation Type</span>
              <span className="font-medium text-gray-800">
                {consultationType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Doctor</span>
              <span className="font-medium text-gray-800">{doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Duration</span>
              <span className="font-medium text-gray-800">
                {slotDuration} minutes
              </span>
            </div>

            <Seperator />

            <div className="flex justify-between">
              <span className="text-gray-500">Consultation Fee</span>
              <span className="font-semibold">₹{consultationFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Platform Fee</span>
              <span className="font-semibold">₹{platformFees}</span>
            </div>

            <Seperator />

            <div className="flex justify-between text-lg">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-semibold text-green-600">
                ₹{totalAmount}
              </span>
            </div>
          </div>
        </div>

        {/* PAYMENT STATUS UI */}
        <AnimatePresence mode="wait">
          {paymentStatus === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-10"
            >
              <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin" />
              <h4 className="mt-4 text-lg font-semibold text-gray-800">
                Processing your payment…
              </h4>
              <p className="text-sm text-gray-500">
                Please complete the payment in the Razorpay window
              </p>
              <div className="mt-4">
                <Progress value={45} className="w-full" />
              </div>
            </motion.div>
          )}

          {paymentStatus === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-10"
            >
              <CheckCircle className="w-16 h-16 mx-auto text-green-600" />
              <h4 className="mt-4 text-2xl font-semibold text-gray-800">
                Payment Successful!
              </h4>
              <p className="text-gray-500">
                Your appointment is now confirmed.
              </p>
            </motion.div>
          )}

          {paymentStatus === "failed" && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center py-10"
            >
              <XCircle className="w-16 h-16 mx-auto text-red-500" />
              <h4 className="mt-4 text-xl font-semibold text-gray-800">
                Payment Failed
              </h4>
              <p className="text-gray-600">{error}</p>
              <Button
                onClick={() => setPaymentStatus("idle")}
                variant="outline"
                className="mt-6 text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Secure Payment Box */}
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg mt-4">
          <Shield className="w-6 h-6 text-green-700" />
          <div>
            <p className="font-medium text-green-900 text-sm">
              100% Secure Payments
            </p>
            <p className="text-xs text-green-700">
              Your payment details are fully encrypted & safe.
            </p>
          </div>
        </div>
      </div>

      {/* BUTTONS */}
      {paymentStatus === "idle" && (
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            disabled={isProcessing || isPaymentLoading}
            className="px-6"
          >
            Back
          </Button>
          <Button
            onClick={handlePayNow}
            disabled={isProcessing || isPaymentLoading}
            className="px-6 flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Creating
                appointment…
              </>
            ) : isPaymentLoading ? (
              <>
                <CreditCard className="w-4 h-4 animate-spin" /> Processing…
              </>
            ) : (
              <>Pay ₹{totalAmount} & Confirm</>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentStep;
