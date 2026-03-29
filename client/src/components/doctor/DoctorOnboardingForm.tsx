"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { userAuthStore } from "@/store/authStore";
import { DoctorFormData, HospitalInfo } from "@/lib/types";
import { healthcareCategoriesList, specializations } from "@/lib/constant";

import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { MotionConfig, motion } from "framer-motion";

function DoctorOnboardingForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<DoctorFormData>({
    specialization: "",
    categories: [],
    qualification: "",
    experience: "",
    fees: "",
    about: "",
    hospitalInfo: { name: "", address: "", city: "" },
    availabilityRange: {
      startDate: "",
      endDate: "",
      excludedWeekdays: [],
    },
    dailyTimeRanges: [
      { start: "09:00", end: "12:00" },
      { start: "14:00", end: "17:00" },
    ],
    slotDurationMinutes: 30,
  });

  const { updateProfile, loading } = userAuthStore();
  const router = useRouter();

  // Same logic handlers (unchanged)
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleHospitalInfo = (field: keyof HospitalInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      hospitalInfo: { ...prev.hospitalInfo, [field]: value },
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateProfile({
        ...formData,
        availabilityRange: {
          startDate: new Date(formData.availabilityRange.startDate),
          endDate: new Date(formData.availabilityRange.endDate),
          excludedWeekdays: formData.availabilityRange.excludedWeekdays,
        },
      });
      router.push("/doctor/dashboard");
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };

  const handleNext = () => currentStep < 3 && setCurrentStep(currentStep + 1);
  const handlePrevious = () =>
    currentStep > 1 && setCurrentStep(currentStep - 1);

  const handleExcludedDaysChange = (dayValue: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      availabilityRange: {
        ...prev.availabilityRange,
        excludedWeekdays: checked
          ? [...prev.availabilityRange.excludedWeekdays, dayValue]
          : prev.availabilityRange.excludedWeekdays.filter(
              (d) => d !== dayValue
            ),
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Premium Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur-xl rounded-3xl">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2" />

            <CardContent className="p-8 lg:p-12">
              {/* Modern Step Progress Bar */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-6">
                  {["Professional Info", "Clinic Details", "Availability"].map(
                    (label, i) => (
                      <div key={i} className="flex items-center">
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{ scale: currentStep > i ? 1.1 : 1 }}
                          className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all duration-500 ${
                            currentStep > i
                              ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                              : currentStep === i + 1
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl ring-4 ring-purple-200"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {currentStep > i ? "✓" : i + 1}
                        </motion.div>
                        <span className="hidden sm:block ml-3 text-sm font-medium text-gray-600">
                          {label}
                        </span>
                        {i < 2 && (
                          <div className="w-24 sm:w-32 h-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: currentStep > i + 1 ? "100%" : "0%",
                              }}
                              transition={{ duration: 0.6 }}
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                            />
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
                <p className="text-center text-sm text-gray-500">
                  Step {currentStep} of 3
                </p>
              </div>

              <MotionConfig transition={{ duration: 0.4, ease: "easeOut" }}>
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                >
                  {/* Step 1 */}
                  {currentStep === 1 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Professional Information
                        </h2>
                        <p className="text-gray-500 mt-2">
                          Let patients know your expertise
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative">
                          <Label className="text-gray-700 font-medium">
                            Specialization
                          </Label>
                          <Select
                            value={formData.specialization}
                            onValueChange={(v) =>
                              setFormData((prev) => ({
                                ...prev,
                                specialization: v,
                              }))
                            }
                          >
                            <SelectTrigger className="mt-2 h-12 bg-gray-50/50 border-gray-200 focus:ring-4 focus:ring-purple-200">
                              <SelectValue placeholder="Choose specialization" />
                            </SelectTrigger>
                            <SelectContent>
                              {specializations.map((spec) => (
                                <SelectItem key={spec} value={spec}>
                                  {spec}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Years of Experience</Label>
                          <Input
                            name="experience"
                            type="number"
                            value={formData.experience}
                            onChange={handleInputChange}
                            placeholder="e.g. 8"
                            className="mt-2 h-12 bg-gray-50/50 border-gray-200 focus:ring-4 focus:ring-blue-200"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Healthcare Categories</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                          {healthcareCategoriesList.map((cat) => (
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              key={cat}
                              onClick={() => handleCategoryToggle(cat)}
                              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                formData.categories.includes(cat)
                                  ? "border-purple-500 bg-purple-50 shadow-md"
                                  : "border-gray-200 bg-white hover:border-purple-300"
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  checked={formData.categories.includes(cat)}
                                />
                                <span className="font-medium text-gray-700">
                                  {cat}
                                </span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label>Qualification</Label>
                          <Input
                            name="qualification"
                            value={formData.qualification}
                            onChange={handleInputChange}
                            placeholder="MBBS, MD, etc."
                            className="mt-2 h-12"
                          />
                        </div>
                        <div>
                          <Label>Consultation Fees (₹)</Label>
                          <Input
                            name="fees"
                            type="number"
                            value={formData.fees}
                            onChange={handleInputChange}
                            placeholder="800"
                            className="mt-2 h-12"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>About You</Label>
                        <Textarea
                          name="about"
                          value={formData.about}
                          onChange={handleInputChange}
                          placeholder="Share your journey, approach, and passion for healing..."
                          rows={5}
                          className="mt-2 resize-none bg-gray-50/50"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2 */}
                  {currentStep === 2 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Clinic / Hospital Details
                        </h2>
                        <p className="text-gray-500 mt-2">
                          Where patients can meet you
                        </p>
                      </div>

                      <div className="space-y-6">
                        <Input
                          value={formData.hospitalInfo.name}
                          onChange={(e) =>
                            handleHospitalInfo("name", e.target.value)
                          }
                          placeholder="Hospital / Clinic Name"
                          className="h-14 text-lg bg-gray-50/70"
                        />
                        <Textarea
                          value={formData.hospitalInfo.address}
                          onChange={(e) =>
                            handleHospitalInfo("address", e.target.value)
                          }
                          placeholder="Full address (street, area, landmark)"
                          rows={3}
                          className="resize-none"
                        />
                        <Input
                          value={formData.hospitalInfo.city}
                          onChange={(e) =>
                            handleHospitalInfo("city", e.target.value)
                          }
                          placeholder="City"
                          className="h-14"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3 */}
                  {currentStep === 3 && (
                    <div className="space-y-8">
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Set Your Availability
                        </h2>
                        <p className="text-gray-500 mt-2">
                          Manage your schedule effortlessly
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <Label>Available From</Label>
                          <Input
                            type="date"
                            value={formData.availabilityRange.startDate}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                availabilityRange: {
                                  ...prev.availabilityRange,
                                  startDate: e.target.value,
                                },
                              }))
                            }
                            className="mt-2 h-12"
                          />
                        </div>
                        <div>
                          <Label>Available Until</Label>
                          <Input
                            type="date"
                            value={formData.availabilityRange.endDate}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                availabilityRange: {
                                  ...prev.availabilityRange,
                                  endDate: e.target.value,
                                },
                              }))
                            }
                            className="mt-2 h-12"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Slot Duration</Label>
                        <Select
                          value={formData?.slotDurationMinutes?.toString()}
                          onValueChange={(v) =>
                            setFormData((prev) => ({
                              ...prev,
                              slotDurationMinutes: parseInt(v),
                            }))
                          }
                        >
                          <SelectTrigger className="mt-2 h-12">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[15, 20, 30, 45, 60].map((m) => (
                              <SelectItem key={m} value={m.toString()}>
                                {m} minutes
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Off Days</Label>
                        <div className="flex flex-wrap gap-3 mt-3">
                          {[
                            "Sun",
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                          ].map((day, i) => (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              key={i}
                              onClick={() =>
                                handleExcludedDaysChange(
                                  i,
                                  !formData.availabilityRange.excludedWeekdays.includes(
                                    i
                                  )
                                )
                              }
                              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold cursor-pointer transition-all ${
                                formData.availabilityRange.excludedWeekdays.includes(
                                  i
                                )
                                  ? "bg-red-500 text-white shadow-lg"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              {day[0]}
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Daily Sessions</Label>
                        {formData.dailyTimeRanges.map((range, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-end gap-4 p-5 mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border"
                          >
                            <div className="flex-1">
                              <Label>Start</Label>
                              <Input
                                type="time"
                                value={range.start}
                                onChange={(e) => {
                                  const newR = [...formData.dailyTimeRanges];
                                  newR[idx].start = e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    dailyTimeRanges: newR,
                                  }));
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <Label>End</Label>
                              <Input
                                type="time"
                                value={range.end}
                                onChange={(e) => {
                                  const newR = [...formData.dailyTimeRanges];
                                  newR[idx].end = e.target.value;
                                  setFormData((prev) => ({
                                    ...prev,
                                    dailyTimeRanges: newR,
                                  }));
                                }}
                              />
                            </div>
                            {formData.dailyTimeRanges.length > 1 && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    dailyTimeRanges:
                                      prev.dailyTimeRanges.filter(
                                        (_, i) => i !== idx
                                      ),
                                  }))
                                }
                              >
                                Remove
                              </Button>
                            )}
                          </motion.div>
                        ))}
                        <Button
                          variant="outline"
                          className="mt-4 border-purple-300 text-purple-600 hover:bg-purple-50"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              dailyTimeRanges: [
                                ...prev.dailyTimeRanges,
                                { start: "18:00", end: "21:00" },
                              ],
                            }))
                          }
                        >
                          + Add Session
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              </MotionConfig>

              {/* Navigation */}
              <div className="flex justify-between mt-12 pt-8 border-t border-gray-200">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="px-8"
                >
                  Previous
                </Button>

                {currentStep < 3 ? (
                  <Button
                    size="lg"
                    onClick={handleNext}
                    className="px-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                  >
                    Next Step →
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold shadow-xl"
                  >
                    {loading ? "Saving Profile..." : "Complete Setup ✓"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default DoctorOnboardingForm;
