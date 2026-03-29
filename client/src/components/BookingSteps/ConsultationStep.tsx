import { consultationTypes } from "@/lib/constant";
import React from "react";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, Stethoscope } from "lucide-react";

interface ConsultationStepInterface {
  consultationType: string;
  setConsultationType: (type: string) => void;
  symptoms: string;
  setSymptoms: React.Dispatch<React.SetStateAction<string>>;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-gray-900"
        >
          How would you like to consult?
        </motion.h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Choose your preferred consultation method and tell us about your
          health concern
        </p>
      </div>

      {/* Consultation Types - Premium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {consultationTypes.map((item, index) => {
          const { type, icon: Icon, description, price, recommended } = item;
          const isSelected = consultationType === type;
          const currentPrice = getConsultationPrice(type);

          return (
            <motion.button
              key={type}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setConsultationType(type)}
              className={`relative group`}
            >
              <div
                className={`h-full p-8 rounded-3xl border-2 transition-all duration-300 backdrop-blur-xl
                  ${
                    isSelected
                      ? "bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500 shadow-2xl ring-4 ring-blue-500/20"
                      : "bg-white/70 border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-2"
                  }`}
              >
                {recommended && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-1.5 font-semibold shadow-lg">
                      <Sparkles className="w-4 h-4 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                )}

                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <CheckCircle2 className="w-8 h-8 text-blue-600" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center space-y-5">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300
                      ${
                        isSelected
                          ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-2xl"
                          : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 shadow-lg group-hover:from-blue-100 group-hover:to-cyan-100"
                      }`}
                  >
                    <Icon className="w-10 h-10" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{type}</h3>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                      {description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-gray-200 w-full">
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className={`text-2xl font-bold ${
                            isSelected ? "text-blue-600" : "text-gray-900"
                          }`}
                        >
                          ₹{currentPrice}
                        </p>
                        {price < 0 && (
                          <p className="text-sm text-emerald-600 font-medium">
                            Save ₹{Math.abs(price)}
                          </p>
                        )}
                      </div>
                      {price < 0 && !isSelected && (
                        <Badge
                          variant="secondary"
                          className="bg-emerald-100 text-emerald-700"
                        >
                          Best Value
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Symptoms Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Describe Your Symptoms
            </h2>
            <p className="text-gray-600">
              This helps the doctor prepare better for your consultation
            </p>
          </div>
        </div>

        <Textarea
          placeholder="e.g. I've had a persistent cough for 3 days, mild fever in the evenings, feeling fatigued..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={6}
          className="w-full rounded-2xl border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 text-base resize-none transition-all"
        />

        <div className="mt-4 flex flex-wrap gap-3">
          {[
            "Fever",
            "Cough",
            "Headache",
            "Fatigue",
            "Sore Throat",
            "Body Pain",
          ].map((tag) => (
            <button
              key={tag}
              onClick={() =>
                setSymptoms((prev) => (prev ? `${prev}, ${tag}` : tag))
              }
              className="px-4 py-2 rounded-full bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 font-medium text-sm transition-all hover:shadow-md"
            >
              + {tag}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Bottom Action Bar */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Button
          variant="outline"
          size="lg"
          onClick={onBack}
          className="w-full sm:w-auto px-8 rounded-2xl border-2"
        >
          ← Back
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-1">Total Amount</p>
          <p className="text-3xl font-bold text-gray-900">
            ₹{getConsultationPrice()}
          </p>
        </div>

        <Button
          size="lg"
          onClick={onContinue}
          disabled={!symptoms.trim()}
          className={`w-full sm:w-auto px-10 rounded-2xl font-bold text-lg shadow-xl transition-all
            ${
              symptoms.trim()
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:shadow-2xl hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Continue to Payment
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  );
};

export default ConsultationStep;
