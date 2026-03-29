"use client";
import { userAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Phone, User, HeartPulse } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Textarea } from "../ui/textarea";

interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

interface MedicalHistory {
  allergies: string;
  currentMedications: string;
  chronicConditions: string;
}

interface PatientOnboardingData {
  phone: string;
  dob: string;
  gender: string;
  bloodGroup?: string;
  emergencyContact: EmergencyContact;
  medicalHistory: MedicalHistory;
}

function PatientOnboardingForm() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<PatientOnboardingData>({
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    medicalHistory: {
      allergies: "",
      currentMedications: "",
      chronicConditions: "",
    },
  });

  const { updateProfile, user, loading } = userAuthStore();
  const router = useRouter();

 
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmergencyContactChange = (
    field: keyof EmergencyContact,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [field]: value },
    }));
  };

  const handleMedicalHistoryChange = (
    field: keyof MedicalHistory,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: { ...prev.medicalHistory, [field]: value },
    }));
  };

  // 🔹 Form Submission
  const handleSubmit = async (): Promise<void> => {
    try {
      await updateProfile({
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        emergencyContact: formData.emergencyContact,
        medicalHistory: formData.medicalHistory,
      });

      router.push("/");
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };

  //  Navigation Between Steps
  const handleNext = (): void => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };
  const handlePrevious = (): void => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome {user?.name || "User"} to Medicare
        </h1>
        <p className="text-gray-600">
          Complete your profile to start booking appointments
        </p>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mt-8">
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold transition-colors duration-200 ${
                  currentStep >= step
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {step}
              </div>
              {step < 3 && (
                <div
                  className={`w-20 h-1 ${
                    currentStep > step ? "bg-blue-600" : "bg-gray-300"
                  }`}
                ></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Card */}
      <Card className="shadow-lg border border-gray-200">
        <CardContent className="p-8">
          {/* Step 1 - Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Basic Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    placeholder="+91 9596633102"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input
                    id="dob"
                    name="dob"
                    type="date"
                    value={formData.dob}
                    required
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleSelectChange("gender", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) =>
                      handleSelectChange("bloodGroup", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Blood Group" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                        (group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 - Emergency Contact */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Phone className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Emergency Contact</h2>
              </div>
              <Alert>
                <AlertDescription>
                  This information will be used to contact someone on your
                  behalf in case of emergency.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="emergencyName">Contact Name</Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyContact.name}
                    onChange={(e) =>
                      handleEmergencyContactChange("name", e.target.value)
                    }
                    placeholder="Full name"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="emergencyPhone">Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyContact.phone}
                    onChange={(e) =>
                      handleEmergencyContactChange("phone", e.target.value)
                    }
                    placeholder="+91 9569633102"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Select
                    value={formData.emergencyContact.relationship}
                    onValueChange={(value) =>
                      handleEmergencyContactChange("relationship", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Spouse",
                        "Parent",
                        "Child",
                        "Sibling",
                        "Friend",
                        "Relative",
                        "Other",
                      ].map((rel) => (
                        <SelectItem key={rel} value={rel.toLowerCase()}>
                          {rel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 - Medical Info */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <HeartPulse className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Medical Information</h2>
              </div>
              <Alert>
                <AlertDescription>
                  This information helps doctors provide better care. Your data
                  remains secure and confidential.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="allergies">Known Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={formData.medicalHistory.allergies}
                    onChange={(e) =>
                      handleMedicalHistoryChange("allergies", e.target.value)
                    }
                    placeholder="E.g. Penicillin, Dust, None"
                  />
                </div>
                <div>
                  <Label htmlFor="currentMedications">
                    Current Medications
                  </Label>
                  <Textarea
                    id="currentMedications"
                    value={formData.medicalHistory.currentMedications}
                    onChange={(e) =>
                      handleMedicalHistoryChange(
                        "currentMedications",
                        e.target.value
                      )
                    }
                    placeholder="E.g. List any medications you're currently taking"
                  />
                </div>
                <div>
                  <Label htmlFor="chronicConditions">Chronic Conditions</Label>
                  <Textarea
                    id="chronicConditions"
                    value={formData.medicalHistory.chronicConditions}
                    onChange={(e) =>
                      handleMedicalHistoryChange(
                        "chronicConditions",
                        e.target.value
                      )
                    }
                    placeholder="E.g. Diabetes, Hypertension, Asthma"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8">
            <Button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              variant="outline"
            >
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={
                  (currentStep === 1 &&
                    (!formData.phone || !formData.dob || !formData.gender)) ||
                  (currentStep === 2 &&
                    (!formData.emergencyContact.name ||
                      !formData.emergencyContact.phone ||
                      !formData.emergencyContact.relationship))
                }
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={
                  loading ||
                  !formData.medicalHistory.allergies ||
                  !formData.medicalHistory.currentMedications ||
                  !formData.medicalHistory.chronicConditions
                }
                className="bg-green-500 hover:bg-green-600 text-white"
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

export default PatientOnboardingForm;
