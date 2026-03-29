"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toLocalReadableDate } from "@/lib/dateUtills";
import { PaymentRecord } from "@/lib/types";
import { getWithAuth, putWithAuth } from "@/service/httpService";

import {
  CreditCard,
  TrendingUp,
  Calendar,
  Stethoscope,
  User,
  IndianRupee,
  Wallet,
  BadgeCheck,
  Clock,
  XCircle,
  X,
  CheckCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

function Payments() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalPlatformFees, setTotalPlatformFees] = useState(0);

  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(
    null,
  );

  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchPayments = async () => {
    try {
      const res = await getWithAuth("admin/payment");

      const paymentData = res.data?.payments || [];

      setPayments(paymentData);

      const revenue = paymentData.reduce(
        (acc: number, payment: PaymentRecord) =>
          acc + (payment.totalAmount || 0),
        0,
      );

      setTotalRevenue(revenue);

      const platformFees = paymentData.reduce(
        (acc: number, payment: PaymentRecord) =>
          acc + (payment.platformFees || 0),
        0,
      );

      setTotalPlatformFees(platformFees);
    } catch (error) {
      console.error("Error fetching payments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleProcessPayout = async (
    appointmentId: string,
    payoutStatus: string,
  ) => {
    try {
      setProcessing(true);

      await putWithAuth(`admin/payment/${appointmentId}/payout`, {
        payoutStatus,
      });

      if (payoutStatus === "Paid") {
        toast.success("Payout processed successfully");
      } else {
        toast.success("Payout cancelled successfully");
      }

      await fetchPayments();

      setShowPayoutModal(false);
      setSelectedPayment(null);
    } catch (error) {
      toast.error("Error processing payout");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancelPayout = async () => {
    if (!selectedPayment) return;

    await handleProcessPayout(selectedPayment._id, "Cancelled");
  };

  const openPayoutModal = (payment: PaymentRecord) => {
    setSelectedPayment(payment);
    setShowPayoutModal(true);
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Revenue */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl bg-white dark:bg-gray-900">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Total Revenue
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                {formatCurrency(totalRevenue)}
              </h2>

              <p className="text-xs text-muted-foreground">
                From {payments.length} consultations
              </p>
            </div>

            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <IndianRupee className="text-emerald-600" size={22} />
            </div>
          </CardContent>
        </Card>

        {/* Completed Consultations */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl bg-white dark:bg-gray-900">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Completed Consultations
              </p>

              <h2 className="text-3xl font-bold tracking-tight">
                {payments.length}
              </h2>

              <p className="text-xs text-muted-foreground">
                Total appointments completed
              </p>
            </div>

            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
              <CheckCircle className="text-blue-600" size={22} />
            </div>
          </CardContent>
        </Card>

        {/* Platform Fees */}
        <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl bg-white dark:bg-gray-900">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">
                Platform Fees
              </p>

              <h2 className="text-3xl font-bold text-orange-600">
                {formatCurrency(totalPlatformFees)}
              </h2>

              <p className="text-xs text-muted-foreground">Total fees earned</p>
            </div>

            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
              <CreditCard className="text-orange-600" size={22} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
        {/* Header */}
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="text-lg font-semibold">
            Payment Records
          </CardTitle>
          <CardDescription>All completed consultation payments</CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="max-h-[600px] overflow-y-auto">
              <table className="w-full text-sm">
                {/* Table Head */}
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-900 border-b">
                  <tr className="text-left text-gray-500 dark:text-gray-400">
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">Doctor</th>
                    <th className="px-6 py-4 font-medium">Patient</th>
                    <th className="px-6 py-4 font-medium">Consultation</th>
                    <th className="px-6 py-4 font-medium">Platform Fee</th>
                    <th className="px-6 py-4 font-medium">Total</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium">Action</th>
                  </tr>
                </thead>

                {/* Table Body */}
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {payments.length > 0 ? (
                    payments.map((payment) => (
                      <tr
                        key={payment._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition"
                      >
                        {/* Date */}
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                          {toLocalReadableDate(new Date(payment.date))}
                        </td>

                        {/* Doctor */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-semibold">
                              {payment.doctorName?.charAt(0)}
                            </div>

                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {payment.doctorName}
                              </span>
                              <span className="text-xs text-gray-500">
                                {payment.doctorEmail}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Patient */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-semibold">
                              {payment.patientName?.charAt(0)}
                            </div>

                            <span className="font-medium text-gray-900 dark:text-white">
                              {payment.patientName}
                            </span>
                          </div>
                        </td>

                        {/* Consultation */}
                        <td className="px-6 py-4 font-medium">
                          {formatCurrency(payment.consultationFees)}
                        </td>

                        {/* Platform Fee */}
                        <td className="px-6 py-4 text-orange-600 font-medium">
                          {formatCurrency(payment.platformFees)}
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(payment.totalAmount)}
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          {payment.payoutStatus === "Paid" && (
                            <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                              Paid
                            </span>
                          )}

                          {payment.payoutStatus === "Pending" && (
                            <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 font-medium">
                              Pending
                            </span>
                          )}

                          {payment.payoutStatus === "Cancelled" && (
                            <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700 font-medium">
                              Cancelled
                            </span>
                          )}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4">
                          {payment.payoutStatus === "Pending" ? (
                            <Button
                              size="sm"
                              onClick={() => openPayoutModal(payment)}
                              className="flex items-center gap-1"
                            >
                              <CreditCard size={14} />
                              Actions
                            </Button>
                          ) : payment.paymentStatus === "Paid" &&
                            payment.payoutDate ? (
                            <Badge className="bg-gray-100 text-gray-700">
                              Paid On{" "}
                              {toLocalReadableDate(
                                new Date(payment.payoutDate),
                              )}
                            </Badge>
                          ) : null}

                          {payment.payoutStatus === "Cancelled" && (
                            <Badge variant="destructive">
                              Payout Cancelled
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="text-center py-16 text-gray-500"
                      >
                        No payment records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {showPayoutModal && selectedPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={() =>
            !processing && (setShowPayoutModal(false), setSelectedPayment(null))
          }
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <IndianRupee className="text-emerald-600 dark:text-emerald-400" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Process Payout
                  </h3>
                  <p className="text-xs text-gray-500">
                    Confirm doctor payout for this consultation
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowPayoutModal(false);
                  setSelectedPayment(null);
                }}
                disabled={processing}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Doctor + Patient */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-gray-500">Doctor</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedPayment.doctorName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedPayment.doctorEmail}
                  </p>
                </div>

                <div className="space-y-1 text-right">
                  <p className="text-gray-500">Patient</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedPayment.patientName}
                  </p>
                  <p className="text-xs text-gray-400">
                    {selectedPayment.patientEmail}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 dark:border-gray-800" />

              {/* Payment Breakdown */}
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Consultation Fee</span>
                  <span className="font-medium">
                    {formatCurrency(selectedPayment.consultationFees)}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Platform Fee</span>
                  <span className="font-medium text-rose-500">
                    - {formatCurrency(selectedPayment.platformFees)}
                  </span>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">
                    Doctor Payout
                  </span>

                  <span className="text-xl font-semibold text-emerald-600">
                    {formatCurrency(selectedPayment.consultationFees)}
                  </span>
                </div>
              </div>

              {/* Highlight Box */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-xl p-4 text-sm">
                <p className="text-emerald-700 dark:text-emerald-400">
                  Doctor will receive{" "}
                  <span className="font-semibold">
                    {formatCurrency(selectedPayment.consultationFees)}
                  </span>{" "}
                  after platform fees deduction.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  onClick={() =>
                    handleProcessPayout(selectedPayment._id, "Paid")
                  }
                  disabled={processing}
                  className="w-full py-6 text-base bg-emerald-600 hover:bg-emerald-700"
                >
                  {processing ? "Processing..." : "Confirm & Process Payout"}
                </Button>

                {/* Cancel Payout */}
                <Button
                  variant="destructive"
                  disabled={processing}
                  onClick={handleCancelPayout}
                  className="w-full py-6 text-base"
                >
                  Cancel Payout
                </Button>

                {/* Close Modal */}
                <Button
                  variant="outline"
                  disabled={processing}
                  onClick={() => {
                    setShowPayoutModal(false);
                    setSelectedPayment(null);
                  }}
                  className="w-full py-6 text-base"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payments;
