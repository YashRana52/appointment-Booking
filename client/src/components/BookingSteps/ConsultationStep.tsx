import { consultationTypes } from "@/lib/constant";
import React from "react";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface ConsultationStepInterface {
  consultationType: string;
  setConsultationType: (type: string) => void;
  symptoms: string;
  setSymptoms: (symptoms: string) => void;
  doctorFees: number;
  onBack: () => void;
  onContinue: () => void;
}

const ConsultationStep = ({
  consultationType,
  setConsultationType,
  symptoms,
  setSymptoms,
  doctorFees,
  onBack,
  onContinue,
}: ConsultationStepInterface) => {
  const getConsultationPrice = (selectedType = consultationType) => {
    const extraPrice =
      consultationTypes.find((ct) => ct.type === selectedType)?.price || 0;
    return Math.max(0, doctorFees + extraPrice);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-8">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Choose Consultation Method
            </h1>
            <p className="mt-1 text-gray-500 text-sm max-w-lg">
              Select how you want to consult and share your symptoms.
            </p>
          </div>

          <div className="mt-3 md:mt-0 text-right">
            <div className="text-sm text-gray-500">Estimated Fee</div>
            <div className="mt-1 text-2xl font-semibold text-gray-900">
              ₹{getConsultationPrice()}
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Types */}
      <section className="space-y-4">
        <Label className="text-sm font-medium text-gray-700">
          Consultation Method
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {consultationTypes.map(
            ({ type, icon: Icon, description, price, recommended }) => {
              const isSelected = consultationType === type;
              const currentPrice = getConsultationPrice(type);

              return (
                <button
                  key={type}
                  onClick={() => setConsultationType(type)}
                  aria-pressed={isSelected}
                  className={`relative flex items-center gap-5 p-5 rounded-2xl text-left transition-all duration-200
                  ${
                    isSelected
                      ? "bg-blue-50 border border-blue-300 shadow-lg"
                      : "bg-white border border-gray-200 hover:shadow hover:-translate-y-1"
                  }`}
                >
                  {recommended && (
                    <Badge className="absolute -top-3 left-4 bg-emerald-600 text-white px-2 py-1 rounded-md text-xs shadow-md">
                      Recommended
                    </Badge>
                  )}

                  <div
                    className={`flex-none w-16 h-16 rounded-xl flex items-center justify-center shadow-md ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {type}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          {description}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-md font-semibold text-gray-900">
                          ₹{currentPrice}
                        </div>
                        {price !== 0 && (
                          <div className="text-xs text-emerald-600 mt-0.5">
                            Save ₹{Math.abs(price)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* Summary & Symptoms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-blue-50 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 8v8m-4-4h8"
                />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-500 font-medium">
                Selected Consultation
              </div>
              <div className="text-lg text-gray-900 font-semibold">
                {consultationType} • ₹{getConsultationPrice()}
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-auto">
            Secure payment & instant confirmation
          </div>
        </div>

        {/* Symptoms Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <Label
            htmlFor="symptoms"
            className="text-sm font-semibold text-gray-800"
          >
            Describe Your Symptoms
          </Label>
          <Textarea
            id="symptoms"
            placeholder="Fever, sore throat, mild headache…"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={6}
            className="mt-3 w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition-all"
          />
          <div className="mt-2 text-xs text-gray-500">
            Tip: Mention duration, severity, travel, and current medications.
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 px-6 py-3 rounded-2xl border-gray-300 hover:bg-gray-100"
        >
          Back
        </Button>
        <Button
          onClick={onContinue}
          disabled={!symptoms.trim()}
          className={`flex-1 px-6 py-3 rounded-2xl text-white font-semibold shadow ${
            symptoms.trim()
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default ConsultationStep;
