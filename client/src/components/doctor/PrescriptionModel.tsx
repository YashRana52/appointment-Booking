"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileText, Save, X } from "lucide-react";
import { Button } from "../ui/button";
import { AlertTitle } from "../ui/alert";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface PrescriptionModelProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prescription: string, notes: string) => Promise<void>;
  patientName: string;
  loading: boolean;
}

function PrescriptionModel({
  onClose,
  isOpen,
  onSave,
  patientName,
  loading,
}: PrescriptionModelProps) {
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      await onSave(prescription, notes);
      setPrescription("");
      setNotes("");
    } catch (error) {
      console.error("Failed to save prescription");
    }
  };

  const handleClose = () => {
    setPrescription("");
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl rounded-2xl border border-gray-200 animate-slide-up">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-xl font-semibold">
              Complete Consultation
            </CardTitle>
          </div>

          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-5 h-5 text-gray-600" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 py-6">
          {/* CONFIRMATION BOX */}
          <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-100 rounded-xl">
            <AlertTitle className="w-5 h-5 text-blue-600 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-900 text-base">
                Confirm Consultation Completion
              </h3>
              <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                Are you sure you want to mark the consultation with{" "}
                <strong className="font-bold">{patientName}</strong> as
                completed?
              </p>
            </div>
          </div>

          {/* PRESCRIPTION FIELD */}
          <div className="space-y-2">
            <Label htmlFor="prescription" className="text-sm font-medium">
              Prescription <span className="text-red-500">*</span>
            </Label>

            <Textarea
              required
              rows={6}
              id="prescription"
              className="border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="Enter medication, dosage, frequency, and instructions..."
            />

            <p className="text-xs text-gray-500">
              Include dosage, frequency, special instructions, or restrictions.
            </p>
          </div>

          {/* NOTES FIELD */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional Notes (optional)
            </Label>

            <Textarea
              rows={4}
              id="notes"
              className="border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add follow-up advice or consultation notes..."
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end space-x-4 pt-5 border-t">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>

            <Button
              disabled={!prescription.trim() || loading}
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save & Complete</span>
                </div>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PrescriptionModel;
