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
import { Separator } from "../ui/separator";

function DoctorOnboardingForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<DoctorFormData>({
    specialization: "",
    categories: [],
    qualification: "",
    experience: "",
    fees: "",
    about: "",
    hospitalInfo: {
      name: "",
      address: "",
      city: "",
    },
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

  // Handlers
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
    <div className="w-full max-w-3xl mx-auto py-10 px-4">
      <Card className="border border-gray-200 shadow-lg rounded-2xl bg-white/90 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
        <CardContent className="p-8 space-y-10">
          {/* Step indicator */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex items-center space-x-2 ${
                    currentStep >= step ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-full border-2 flex items-center justify-center font-semibold ${
                      currentStep >= step
                        ? "bg-green-600 text-white border-green-600"
                        : "border-gray-300"
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div className="h-[2px] w-12 bg-gray-200 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-500">
              Step {currentStep} of 3
            </span>
          </div>

          <Separator />

          {/* Step 1 - Professional Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Professional Information
              </h2>
              <p className="text-gray-500 text-sm">
                Provide details about your specialization, qualifications, and
                expertise.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Medical Specialization</Label>
                  <Select
                    value={formData.specialization}
                    onValueChange={(value: string) =>
                      setFormData((prev) => ({
                        ...prev,
                        specialization: value,
                      }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select specialization" />
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
                    min={0}
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g. 5"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Healthcare Categories</Label>
                <p className="text-sm text-gray-500 mb-2">
                  Select the healthcare areas you provide services for.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {healthcareCategoriesList.map((category) => (
                    <div
                      key={category}
                      className="flex items-center space-x-2 rounded-md border p-2 hover:bg-gray-50 transition"
                    >
                      <Checkbox
                        id={category}
                        checked={formData.categories.includes(category)}
                        onCheckedChange={() => handleCategoryToggle(category)}
                      />
                      <label
                        htmlFor={category}
                        className="text-sm cursor-pointer"
                      >
                        {category}
                      </label>
                    </div>
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
                    placeholder="e.g., MBBS, MD"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Consultancy Fees (₹)</Label>
                  <Input
                    name="fees"
                    type="number"
                    min={0}
                    value={formData.fees}
                    onChange={handleInputChange}
                    placeholder="e.g. 500"
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>About You</Label>
                <Textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  placeholder="Tell patients about your expertise..."
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Step 2 - Hospital Info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Hospital / Clinic Information
              </h2>
              <p className="text-gray-500 text-sm">
                Provide accurate details of your practice location.
              </p>

              <div className="space-y-4">
                <div>
                  <Label>Hospital Name</Label>
                  <Input
                    value={formData.hospitalInfo.name}
                    onChange={(e) => handleHospitalInfo("name", e.target.value)}
                    placeholder="e.g. Apollo Hospital"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Address</Label>
                  <Textarea
                    value={formData.hospitalInfo.address}
                    onChange={(e) =>
                      handleHospitalInfo("address", e.target.value)
                    }
                    placeholder="Enter full address"
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>City</Label>
                  <Input
                    value={formData.hospitalInfo.city}
                    onChange={(e) => handleHospitalInfo("city", e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3 - Availability */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Availability Settings
              </h2>
              <p className="text-gray-500 text-sm">
                Set your availability, appointment slots, and daily working
                hours.
              </p>

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
                    className="mt-1"
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
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Appointment Slot Duration</Label>
                <Select
                  value={(formData.slotDurationMinutes ?? 30).toString()}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      slotDurationMinutes: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select slot duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {[15, 20, 30, 45, 60, 90, 120].map((val) => (
                      <SelectItem key={val} value={val.toString()}>
                        {val} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Unavailable Days</Label>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-2 mt-2">
                  {[
                    { day: "Sun", value: 0 },
                    { day: "Mon", value: 1 },
                    { day: "Tue", value: 2 },
                    { day: "Wed", value: 3 },
                    { day: "Thu", value: 4 },
                    { day: "Fri", value: 5 },
                    { day: "Sat", value: 6 },
                  ].map(({ day, value }) => (
                    <div
                      key={value}
                      className="flex items-center space-x-2 border rounded-md p-2 hover:bg-gray-50 transition"
                    >
                      <Checkbox
                        id={`day-${value}`}
                        checked={formData.availabilityRange.excludedWeekdays.includes(
                          value
                        )}
                        onCheckedChange={(checked) =>
                          handleExcludedDaysChange(value, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`day-${value}`}
                        className="text-sm cursor-pointer"
                      >
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Daily Working Hours</Label>
                {formData.dailyTimeRanges.map((range, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 border rounded-xl mt-3 bg-gray-50"
                  >
                    <div className="flex-1">
                      <Label>Session {index + 1} - Start</Label>
                      <Input
                        type="time"
                        value={range.start}
                        onChange={(e) => {
                          const newRanges = [...formData.dailyTimeRanges];
                          newRanges[index].start = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            dailyTimeRanges: newRanges,
                          }));
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <Label>Session {index + 1} - End</Label>
                      <Input
                        type="time"
                        value={range.end}
                        onChange={(e) => {
                          const newRanges = [...formData.dailyTimeRanges];
                          newRanges[index].end = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            dailyTimeRanges: newRanges,
                          }));
                        }}
                      />
                    </div>

                    {formData.dailyTimeRanges.length > 1 && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const newRanges = formData.dailyTimeRanges.filter(
                            (_, i) => i !== index
                          );
                          setFormData((prev) => ({
                            ...prev,
                            dailyTimeRanges: newRanges,
                          }));
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      dailyTimeRanges: [
                        ...prev.dailyTimeRanges,
                        { start: "18:00", end: "20:00" },
                      ],
                    }))
                  }
                >
                  + Add Another Session
                </Button>
              </div>
            </div>
          )}

          <Separator />

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={currentStep === 1 && formData.categories.length === 0}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                {loading ? "Completing Setup..." : "Complete Profile"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DoctorOnboardingForm;
