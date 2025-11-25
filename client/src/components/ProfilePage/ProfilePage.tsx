"use client";
import { healthcareCategories, specializations } from "@/lib/constant";
import { DoctorFormData } from "@/lib/types";
import { userAuthStore } from "@/store/authStore";
import {
  AlertCircle,
  AlertTriangle,
  Briefcase,
  Calendar,
  Clock,
  Droplet,
  Edit3,
  FileText,
  GraduationCap,
  HeartPulse,
  IndianRupee,
  Loader2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Pill,
  Plus,
  Siren,
  Stethoscope,
  Tags,
  User,
  Users,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import Header from "../landing/Header";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";

interface ProfileProps {
  userType: "doctor" | "patient";
}

function ProfilePage({ userType }: ProfileProps) {
  const { user, fetchProfile, updateProfile, loading } = userAuthStore();
  const [activeSection, setActiveSection] = useState("about");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    about: "",
    specialization: "",
    category: [],
    qualification: "",
    experience: 0,
    fees: 0,
    hospitalInfo: {
      name: "",
      address: "",
      city: "",
    },
    medicalHistory: {
      allergies: "",
      currentMedications: "",
      chronicConditions: "",
    },
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },

    availabilityRange: {
      startDate: "",
      endDate: "",
      excludedWeekdays: [],
    },
    dailyTimeRanges: [],
    slotDurationMinutes: 30,
  });

  useEffect(() => {
    fetchProfile(userType);
  }, [fetchProfile, userType]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        dob: user.dob || "",
        gender: user.gender || "",
        bloodGroup: user.bloodGroup || "",
        about: user.about || "",
        specialization: user.specialization || "",
        category: user.category || [],
        qualification: user.qualification || "",
        experience: user.experience || 0,
        fees: user.fees || 0,
        hospitalInfo: {
          name: user.hospitalInfo?.name || "",
          address: user.hospitalInfo?.address || "",
          city: user.hospitalInfo?.city || "",
        },
        medicalHistory: {
          allergies: user.medicalHistory?.allergies || "",
          currentMedications: user.medicalHistory?.currentMedications || "",
          chronicConditions: user.medicalHistory?.chronicConditions || "",
        },
        emergencyContact: {
          name: user.emergencyContact?.name || "",
          phone: user.emergencyContact?.phone || "",
          relationship: user.emergencyContact?.relationship || "",
        },
        availabilityRange: {
          startDate: user.availabilityRange?.startDate || "",
          endDate: user.availabilityRange?.endDate || "",
          excludedWeekdays: user.availabilityRange?.excludedWeekdays || [],
        },
        dailyTimeRanges: user.dailyTimeRanges || [],
        slotDurationMinutes: user.slotDurationMinutes || 30,
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev: any) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [field]: value }));
    }
  };

  const handleArrayChnage = (
    field: string,
    index: number,
    subField: string,
    value: any
  ) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: prev[field].map((item: any, i: number) =>
        i === index ? { ...item, [subField]: value } : item
      ),
    }));
  };
  const handleCategorySelect = (category: any): void => {
    if (!formData.category.includes(category.title)) {
      handleInputChange("category", [...formData.category, category.title]);
    }
  };

  const handleCategoryDelete = (indexToDelete: number) => {
    const currentCategies = [...formData.category];
    const newCategories = currentCategies.filter(
      (_: any, i: number) => i !== indexToDelete
    );
    setFormData((prev: any) => ({
      ...prev,
      category: newCategories,
    }));
  };

  const getAvailableCategories = () => {
    return healthcareCategories.filter(
      (cat) => !formData.category.includes(cat.title)
    );
  };

  const addTimeRange = () => {
    setFormData((prev: any) => ({
      ...prev,
      dailyTimeRanges: [
        ...prev.dailyTimeRanges,
        { start: "09:00", end: "17:00" },
      ],
    }));
  };

  const removeTimeRange = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      dailyTimeRanges: prev.dailyTimeRanges.filter(
        (_: any, i: number) => i !== index
      ),
    }));
  };

  const handleWeekday = (weekday: number) => {
    const excludedWeekdays = [...formData.availabilityRange.excludedWeekdays];
    const index = excludedWeekdays.indexOf(weekday);
    if (index > -1) {
      excludedWeekdays.splice(index, 1);
    } else {
      excludedWeekdays.push(weekday);
    }
    handleInputChange("availabilityRange.excludedWeekdays", excludedWeekdays);
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDateForInput = (isoDate: string): string => {
    if (!isoDate) return "";

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split("T")[0];
  };
  const sidebarItems =
    userType === "doctor"
      ? [
          { id: "about", label: "About", icon: User },
          { id: "professional", label: "Professional Info", icon: Stethoscope },
          { id: "hospital", label: "Hospital Information", icon: MapPin },
          { id: "availability", label: "Availability", icon: Clock },
        ]
      : [
          { id: "about", label: "About", icon: User },
          { id: "contact", label: "Contact Information", icon: Phone },
          { id: "medical", label: "Medical History", icon: FileText },
          { id: "emergency", label: "Emergency Contact", icon: Phone },
        ];

  // About section
  const renderAboutSection = () => (
    <div className="space-y-10">
      {/* Section Header - Modern Style */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex items-center gap-3">
          {userType === "doctor" ? (
            <div className="p-3 bg-blue-100 rounded-xl">
              <Stethoscope className="w-6 h-6 text-blue-700" />
            </div>
          ) : (
            <div className="p-3 bg-indigo-100 rounded-xl">
              <User className="w-6 h-6 text-indigo-700" />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {userType === "doctor"
                ? "Professional Profile"
                : "Personal Information"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {isEditing
                ? "Make changes and save when done."
                : userType === "doctor"
                ? "This information appears on your public doctor profile."
                : "Keep your profile information up to date."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        {/* Legal First Name */}
        <div className="group">
          <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <User className="w-4 h-4 text-gray-500" />
            Legal First Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            disabled={!isEditing}
            placeholder="Enter your first name"
            className="w-full h-12 text-base border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent transition-all duration-200 disabled:bg-gray-50"
          />
        </div>

        {/* Patient-only Fields */}
        {userType === "patient" && (
          <>
            {/* Date of Birth */}
            <div className="group">
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                Date of Birth
              </Label>
              <div className="relative">
                <Input
                  id="dob"
                  type="date"
                  value={
                    formData.dob
                      ? new Date(formData.dob).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  disabled={!isEditing}
                  className="w-full h-12 pl-10 border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:bg-gray-50"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Gender */}
            <div className="group">
              <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                Gender
              </Label>
              <RadioGroup
                value={formData.gender || ""}
                onValueChange={(value) => handleInputChange("gender", value)}
                disabled={!isEditing}
                className="flex gap-6"
              >
                {["Male", "Female", "Other"].map((option) => (
                  <div
                    key={option}
                    className="flex items-center space-x-2.5 cursor-pointer group"
                  >
                    <RadioGroupItem
                      value={option.toLowerCase()}
                      id={option.toLowerCase()}
                      className="w-5 h-5 data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600"
                    />
                    <Label
                      htmlFor={option.toLowerCase()}
                      className="cursor-pointer text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Blood Group */}
            <div className="group">
              <Label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Droplet className="w-4 h-4 text-red-500" />
                Blood Group
              </Label>
              <Select
                value={formData.bloodGroup || ""}
                onValueChange={(value) =>
                  handleInputChange("bloodGroup", value)
                }
                disabled={!isEditing}
              >
                <SelectTrigger className="w-full h-12 border-gray-300 data-[state=open]:ring-2 data-[state=open]:ring-blue-500">
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                    (group) => (
                      <SelectItem
                        key={group}
                        value={group}
                        className="text-base"
                      >
                        <span className="font-medium">{group}</span>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Doctor: About You (Full Width) */}
        {userType === "doctor" && (
          <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-7 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-600 rounded-lg">
                <Edit3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <Label className="text-lg font-bold text-gray-900">
                  About You
                </Label>
                <p className="text-sm text-gray-600">
                  Share your experience and approach — visible on your public
                  profile
                </p>
              </div>
            </div>

            <Textarea
              id="about"
              placeholder="Introduce yourself... e.g., 'Board-certified cardiologist with 12+ years of experience specializing in preventive cardiology and cardiac imaging. Passionate about patient education and holistic care.'"
              value={formData.about || ""}
              onChange={(e) => handleInputChange("about", e.target.value)}
              disabled={!isEditing}
              rows={8}
              className="resize-none w-full text-base bg-white border-gray-300 focus-visible:ring-2 focus-visible:ring-blue-500 disabled:bg-gray-50 placeholder:text-gray-400 rounded-xl"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-gray-500">
                {formData.about?.length || 0}/1000 characters
              </p>
              {isEditing && (
                <span className="text-xs font-medium text-blue-600">
                  Changes will be visible publicly after saving
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Optional Divider for Doctor */}
      {userType === "doctor" && (
        <div className="h-px bg-gray-200 rounded-full" />
      )}
    </div>
  );

  //profesional section
  const renderProfessionalSection = () => (
    <div className="space-y-8">
      {/* Specialization - Modern Select */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-600" />
          Specialization
        </Label>
        <Select
          value={formData.specialization}
          onValueChange={(value) => handleInputChange("specialization", value)}
          disabled={!isEditing}
        >
          <SelectTrigger
            className={`w-full h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all ${
              !isEditing ? "bg-gray-50" : ""
            }`}
          >
            <SelectValue placeholder="Select your specialization" />
          </SelectTrigger>
          <SelectContent>
            {specializations.map((spec) => (
              <SelectItem key={spec} value={spec}>
                <span className="font-medium">{spec}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Categories - Chip Style with Color Dots */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Tags className="w-4 h-4 text-blue-600" />
          Practice Categories
        </Label>
        <div className="flex flex-wrap gap-3">
          {formData.category?.map((cat: string, index: number) => {
            const categoryObj = getAvailableCategories().find(
              (c) => c.title === cat
            );
            return (
              <Badge
                key={index}
                variant="outline"
                className="px-4 py-2 text-sm font-medium border-gray-200 bg-white hover:bg-gray-50 transition-all"
              >
                <div className="flex items-center gap-2">
                  {categoryObj && (
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${categoryObj.color}`}
                    />
                  )}
                  <span>{cat}</span>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCategoryDelete(index);
                      }}
                      className="ml-2 -mr-1 p-0.5 rounded-full hover:bg-gray-200 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </Badge>
            );
          })}

          {/* Add New Category */}
          {isEditing && getAvailableCategories().length > 0 && (
            <Select
              onValueChange={(value) => {
                const selected = getAvailableCategories().find(
                  (c) => c.id === value
                );
                if (selected) handleCategorySelect(selected);
              }}
            >
              <SelectTrigger className="w-56 h-10 border-dashed border-2 border-gray-300 bg-gray-50 hover:bg-gray-100 transition">
                <SelectValue placeholder="+ Add category" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableCategories().map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${category.color}`}
                      />
                      <span className="font-medium">{category.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {isEditing && getAvailableCategories().length === 0 && (
            <p className="text-sm text-gray-500 italic">All categories added</p>
          )}
        </div>
      </div>

      {/* Qualification */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          Qualification
        </Label>
        <Input
          value={formData.qualification}
          onChange={(e) => handleInputChange("qualification", e.target.value)}
          disabled={!isEditing}
          placeholder="e.g., MBBS, MD (Internal Medicine), FACC"
          className="h-12 text-base border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
        />
      </div>

      {/* Experience & Fees - Side by Side on Larger Screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Experience */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            Experience
          </Label>
          <div className="relative">
            <Input
              type="number"
              value={formData.experience || ""}
              onChange={(e) =>
                handleInputChange("experience", parseInt(e.target.value) || 0)
              }
              disabled={!isEditing}
              placeholder="0"
              className="h-12 pl-10 text-base border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
          </div>
        </div>

        {/* Consultation Fees */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-blue-600" />
            Consultation Fee
          </Label>
          <div className="relative">
            <Input
              type="number"
              value={formData.fees || ""}
              onChange={(e) =>
                handleInputChange("fees", parseInt(e.target.value) || 0)
              }
              disabled={!isEditing}
              placeholder="0"
              className="h-12 pl-12 text-base border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium pointer-events-none">
              ₹
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  //hospital info

  const renderHospitalSection = () => (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <div className="w-2 h-6 bg-blue-600 rounded-full" />
          Hospital / Clinic Information
        </h3>

        <div className="grid gap-6">
          {/* Hospital Name */}
          <div className="group">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <span className="text-blue-600">🏥</span>
              Hospital / Clinic Name
            </Label>
            <Input
              value={formData.hospitalInfo?.name || ""}
              onChange={(e) =>
                handleInputChange("hospitalInfo?.name", e.target.value)
              }
              disabled={!isEditing}
              placeholder={isEditing ? "Enter hospital/clinic name" : ""}
              className={`
              w-full px-4 py-3 text-base rounded-xl border transition-all duration-300
              ${
                isEditing
                  ? "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  : "border-gray-200 bg-gray-50"
              }
              disabled:cursor-not-allowed disabled:opacity-70
            `}
            />
          </div>

          {/* Address */}
          <div className="group">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <span className="text-blue-600">📍</span>
              Address
            </Label>
            <Textarea
              rows={3}
              value={formData.hospitalInfo?.address || ""}
              onChange={(e) =>
                handleInputChange("hospitalInfo?.address", e.target.value)
              }
              disabled={!isEditing}
              placeholder={
                isEditing ? "Full address of the hospital/clinic" : ""
              }
              className={`
              w-full px-4 py-3 text-base rounded-xl border resize-none transition-all duration-300
              ${
                isEditing
                  ? "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  : "border-gray-200 bg-gray-50"
              }
              disabled:cursor-not-allowed disabled:opacity-70
            `}
            />
          </div>

          {/* City */}
          <div className="group">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
              <span className="text-blue-600">🏙️</span>
              City
            </Label>
            <Input
              value={formData.hospitalInfo?.city || ""}
              onChange={(e) =>
                handleInputChange("hospitalInfo?.city", e.target.value)
              }
              disabled={!isEditing}
              placeholder={isEditing ? "e.g. Mumbai, Delhi, Bangalore" : ""}
              className={`
              w-full px-4 py-3 text-base rounded-xl border transition-all duration-300
              ${
                isEditing
                  ? "border-gray-300 hover:border-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  : "border-gray-200 bg-gray-50"
              }
              disabled:cursor-not-allowed disabled:opacity-70
            `}
            />
          </div>
        </div>
      </div>
    </div>
  );

  //availability

  const renderAvailability = () => {
    const weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return (
      <div className="space-y-8">
        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="available-from">Available From</Label>
            <Input
              id="available-from"
              type="date"
              value={formatDateForInput(formData.availabilityRange?.startDate)}
              onChange={(e) =>
                handleInputChange("availabilityRange.startDate", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="available-until">Available Until</Label>
            <Input
              id="available-until"
              type="date"
              value={formatDateForInput(formData.availabilityRange?.endDate)}
              onChange={(e) =>
                handleInputChange("availabilityRange.endDate", e.target.value)
              }
              disabled={!isEditing}
            />
          </div>
        </div>

        {/* Excluded Weekdays */}
        <div className="space-y-3">
          <Label>Excluded Weekdays</Label>
          <div className="flex flex-wrap gap-4">
            {weekdays.map((day, index) => (
              <label
                key={day}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <Checkbox
                  checked={
                    formData.availabilityRange?.excludedWeekdays?.includes(
                      index
                    ) ?? false
                  }
                  onCheckedChange={() => handleWeekday(index)}
                  disabled={!isEditing}
                />
                <span className="text-sm font-medium">{day}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Daily Time Ranges */}
        <div className="space-y-4">
          <Label>Daily Available Time Ranges</Label>
          <div className="space-y-3">
            {formData.dailyTimeRanges?.map((range: any, index: any) => (
              <div key={index} className="flex items-center gap-3">
                <Input
                  type="time"
                  value={range.start || ""}
                  onChange={(e) =>
                    handleArrayChnage(
                      "dailyTimeRanges",
                      index,
                      "start",
                      e.target.value
                    )
                  }
                  disabled={!isEditing}
                  className="w-36"
                />
                <span className="text-muted-foreground">to</span>
                <Input
                  type="time"
                  value={range.end || ""}
                  onChange={(e) =>
                    handleArrayChnage(
                      "dailyTimeRanges",
                      index,
                      "end",
                      e.target.value
                    )
                  }
                  disabled={!isEditing}
                  className="w-36"
                />
                {isEditing && formData.dailyTimeRanges.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTimeRange(index)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}

            {isEditing && (
              <Button variant="outline" size="sm" onClick={addTimeRange}>
                <Plus className="w-4 h-4 mr-2" />
                Add Time Range
              </Button>
            )}
          </div>
        </div>

        {/* Slot Duration */}
        <div className="space-y-2 max-w-xs">
          <Label htmlFor="slot-duration">Slot Duration</Label>
          <Select
            value={formData.slotDurationMinutes?.toString()}
            onValueChange={(value) =>
              handleInputChange("slotDurationMinutes", parseInt(value))
            }
            disabled={!isEditing}
          >
            <SelectTrigger id="slot-duration">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {[15, 20, 30, 45, 60].map((minutes) => (
                <SelectItem key={minutes} value={minutes.toString()}>
                  {minutes} minutes
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  const renderContactSection = () => (
    <div className="space-y-8">
      {/* Phone Number */}
      <div className="space-y-2">
        <Label
          htmlFor="phone"
          className="text-sm font-medium text-foreground flex items-center gap-2"
        >
          <Phone className="w-4 h-4 text-muted-foreground" />
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone || ""}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          disabled={!isEditing}
          placeholder={isEditing ? "Enter phone number" : ""}
          className="h-11 text-base font-medium transition-all duration-200
                   focus-visible:ring-2 focus-visible:ring-blue-500 
                   disabled:bg-muted/50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-sm font-medium text-foreground flex items-center gap-2"
        >
          <Mail className="w-4 h-4 text-muted-foreground" />
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ""}
          disabled
          className="h-11 text-base font-medium bg-muted/40 cursor-not-allowed 
                   border-border"
        />
        <p className="text-xs text-muted-foreground -mt-1 pl-1">
          Email is linked to your account and cannot be changed
        </p>
      </div>
    </div>
  );

  //medical section

  const renderMedicalSection = () => (
    <div className="space-y-7">
      {/* Allergies */}
      <div className="space-y-2">
        <Label
          htmlFor="allergies"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <AlertCircle className="w-4 h-4 text-orange-500" />
          Allergies
        </Label>
        <Textarea
          id="allergies"
          rows={3}
          placeholder={
            isEditing
              ? "e.g. Penicillin, Peanuts, Dust, Latex..."
              : "No allergies mentioned"
          }
          value={formData.medicalHistory?.allergies || ""}
          onChange={(e) =>
            handleInputChange("medicalHistory.allergies", e.target.value)
          }
          disabled={!isEditing}
          className="resize-none text-base transition-all duration-200 
                   focus-visible:ring-2 focus-visible:ring-orange-500/30 
                   disabled:bg-muted/40"
        />
        {isEditing && (
          <p className="text-xs text-muted-foreground">
            Mention any known allergies (food, medicine, environmental)
          </p>
        )}
      </div>

      {/* Current Medications */}
      <div className="space-y-2">
        <Label
          htmlFor="medications"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Pill className="w-4 h-4 text-blue-500" />
          Current Medications
        </Label>
        <Textarea
          id="medications"
          rows={3}
          placeholder={
            isEditing
              ? "e.g. Amlodipine 5mg daily, Metformin 500mg twice daily..."
              : "No medications listed"
          }
          value={formData.medicalHistory?.currentMedications || ""}
          onChange={(e) =>
            handleInputChange(
              "medicalHistory.currentMedications",
              e.target.value
            )
          }
          disabled={!isEditing}
          className="resize-none text-base transition-all duration-200 
                   focus-visible:ring-2 focus-visible:ring-blue-500/30 
                   disabled:bg-muted/40"
        />
        {isEditing && (
          <p className="text-xs text-muted-foreground">
            List medicines you take regularly (with dosage if possible)
          </p>
        )}
      </div>

      {/* Chronic Conditions */}
      <div className="space-y-2">
        <Label
          htmlFor="conditions"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <HeartPulse className="w-4 h-4 text-red-500" />
          Chronic Conditions
        </Label>
        <Textarea
          id="conditions"
          rows={3}
          placeholder={
            isEditing
              ? "e.g. Diabetes Type 2, Hypertension, Asthma..."
              : "No chronic conditions mentioned"
          }
          value={formData.medicalHistory?.chronicConditions || ""}
          onChange={(e) =>
            handleInputChange(
              "medicalHistory.chronicConditions",
              e.target.value
            )
          }
          disabled={!isEditing}
          className="resize-none text-base transition-all duration-200 
                   focus-visible:ring-2 focus-visible:ring-red-500/30 
                   disabled:bg-muted/40"
        />
        {isEditing && (
          <p className="text-xs text-muted-foreground">
            Any long-term health conditions (e.g. Diabetes, Thyroid, Arthritis)
          </p>
        )}
      </div>

      {/* Optional: Quick Empty State */}
      {!isEditing &&
        !formData.medicalHistory?.allergies &&
        !formData.medicalHistory?.currentMedications &&
        !formData.medicalHistory?.chronicConditions && (
          <div className="text-center py-8 text-muted-foreground">
            <Stethoscope className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No medical information added yet</p>
          </div>
        )}
    </div>
  );

  const renderEmergencySection = () => (
    <div className="space-y-8 rounded-xl border border-red-200/50 bg-red-50/30 p-6">
      {/* Section Header with Icon */}
      <div className="flex items-center gap-3 mb-4">
        <div className="rounded-full bg-red-100 p-3">
          <Siren className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Emergency Contact
          </h3>
          <p className="text-sm text-muted-foreground">
            Person to contact in case of medical emergency
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="emergency-name" className="flex items-center gap-2">
            <User className="w-4 h-4 text-red-500" />
            Full Name
          </Label>
          <Input
            id="emergency-name"
            value={formData.emergencyContact?.name || ""}
            onChange={(e) =>
              handleInputChange("emergencyContact.name", e.target.value)
            }
            disabled={!isEditing}
            placeholder={isEditing ? "e.g. Rahul Sharma" : "Not added"}
            className="h-11 font-medium transition-all duration-200 
                     focus-visible:ring-2 focus-visible:ring-red-500/30
                     disabled:bg-white/70"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="emergency-phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-500" />
            Phone Number
          </Label>
          <Input
            id="emergency-phone"
            type="tel"
            value={formData.emergencyContact?.phone || ""}
            onChange={(e) =>
              handleInputChange("emergencyContact.phone", e.target.value)
            }
            disabled={!isEditing}
            placeholder={isEditing ? "+91 98765 43210" : "Not added"}
            className="h-11 font-medium transition-all duration-200 
                     focus-visible:ring-2 focus-visible:ring-red-500/30
                     disabled:bg-white/70"
          />
        </div>
      </div>

      {/* Relationship */}
      <div className="space-y-2">
        <Label htmlFor="emergency-relation" className="flex items-center gap-2">
          <Users className="w-4 h-4 text-red-500" />
          Relationship
        </Label>
        <Select
          value={formData.emergencyContact?.relationship || ""}
          onValueChange={(value) =>
            handleInputChange("emergencyContact.relationship", value)
          }
          disabled={!isEditing}
        >
          <SelectTrigger id="emergency-relation" className="h-11">
            <SelectValue
              placeholder={isEditing ? "Select relationship" : "Not specified"}
            />
          </SelectTrigger>
          <SelectContent>
            {[
              "Spouse",
              "Parent",
              "Child",
              "Sibling",
              "Friend",
              "Guardian",
              "Other",
            ].map((rel) => (
              <SelectItem key={rel} value={rel}>
                {rel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Empty State (View Mode Only) */}
      {!isEditing &&
        !formData.emergencyContact?.name &&
        !formData.emergencyContact?.phone &&
        !formData.emergencyContact?.relationship && (
          <div className="text-center py-8 text-muted-foreground/80">
            <AlertTriangle className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No emergency contact added</p>
            <p className="text-xs mt-1">This is important for your safety</p>
          </div>
        )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "about":
        return renderAboutSection();
      case "professional":
        return renderProfessionalSection();
      case "hospital":
        return renderHospitalSection();
      case "availability":
        return renderAvailability();
      case "contact":
        return renderContactSection();
      case "medical":
        return renderMedicalSection();
      case "emergency":
        return renderEmergencySection();
      default:
        renderAboutSection();
    }
  };
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header showDashBoardNav={true} />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 pt-16">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Page Title */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              My Records
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your profile, security, and preferences
            </p>
          </div>

          {/* User Card + Avatar */}
          <div className="mb-12">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center justify-between gap-8 overflow-hidden">
              {/* Left Side - User Profile */}
              <div className="flex items-center gap-8">
                <div className="relative">
                  <Avatar className="w-28 h-28 ring-4 ring-blue-100">
                    <AvatarImage src={user?.profileImage} alt={user?.name} />
                    <AvatarFallback className="text-5xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      {user?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 bg-green-500 w-8 h-8 rounded-full border-4 border-white"></div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user?.name}
                  </h2>
                  <p className="text-gray-500">{user?.email}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Member since {new Date().getFullYear()}
                  </p>
                </div>
              </div>

              {/* Right Side - Premium Doctor Illustration */}
              <div className="hidden md:flex items-center justify-center">
                <div className="relative">
                  {/* Beautiful Doctor with Stethoscope */}
                  <svg
                    width="180"
                    height="180"
                    viewBox="0 0 180 180"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Soft background glow */}
                    <circle
                      cx="90"
                      cy="90"
                      r="80"
                      fill="#DBEAFE"
                      opacity="0.5"
                    />
                    <circle
                      cx="90"
                      cy="90"
                      r="70"
                      fill="#EFF6FF"
                      opacity="0.7"
                    />
                    {/* Doctor Body */}
                    <ellipse cx="90" cy="135" rx="28" ry="35" fill="#3B82F6" />
                    <rect
                      x="62"
                      y="100"
                      width="56"
                      height="50"
                      rx="12"
                      fill="#3B82F6"
                    />
                    {/* Doctor Head */}
                    <circle cx="90" cy="65" r="28" fill="#FDBA8C" />{" "}
                    {/* Skin color */}
                    <circle cx="82" cy="60" r="5" fill="#1F2937" />
                    <circle cx="98" cy="60" r="5" fill="#1F2937" />
                    {/* Hair */}
                    <path d="M62 65 Q90 35, 118 65" fill="#1F2937" />
                    {/* Stethoscope */}
                    <path
                      d="M90 93 L90 110"
                      stroke="#2563EB"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M90 110 Q70 120, 65 140"
                      stroke="#2563EB"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <path
                      d="M90 110 Q110 120, 115 140"
                      stroke="#2563EB"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    <circle cx="65" cy="142" r="10" fill="#DC2626" />
                    <circle cx="115" cy="142" r="10" fill="#DC2626" />
                    <circle cx="90" cy="85" r="12" fill="#1F2937" />
                    <circle cx="90" cy="85" r="7" fill="#94A3B8" />
                    {/* Medical Cross Badge */}
                    <circle cx="130" cy="50" r="20" fill="#10B981" />
                    <text
                      x="130"
                      y="58"
                      textAnchor="middle"
                      className="fill-white text-3xl font-bold"
                    >
                      ✚
                    </text>
                    {/* Floating particles */}
                    <circle
                      cx="40"
                      cy="50"
                      r="6"
                      fill="#60A5FA"
                      opacity="0.5"
                    />
                    <circle
                      cx="140"
                      cy="110"
                      r="8"
                      fill="#A78BFA"
                      opacity="0.4"
                    />
                    <circle
                      cx="50"
                      cy="130"
                      r="5"
                      fill="#F472B6"
                      opacity="0.4"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid: Sidebar + Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sticky top-24">
                <nav className="space-y-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all duration-200 group ${
                        activeSection === item.id
                          ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <item.icon
                        className={`w-5 h-5 transition-colors ${
                          activeSection === item.id
                            ? "text-white"
                            : "text-gray-500 group-hover:text-gray-700"
                        }`}
                      />
                      <span className="font-medium">{item.label}</span>
                      {activeSection === item.id && (
                        <div className="ml-auto w-1.5 h-8 bg-white/30 rounded-l-full"></div>
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="lg:col-span-3">
              <Card className="border-0 shadow-xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pb-10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-3xl font-bold">
                      {
                        sidebarItems.find((item) => item.id === activeSection)
                          ?.label
                      }
                    </CardTitle>

                    {/* Edit / Save Buttons */}
                    <div className="flex gap-3">
                      {isEditing ? (
                        <>
                          <Button
                            variant="secondary"
                            size="lg"
                            onClick={() => setIsEditing(false)}
                            className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur mt-1"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="lg"
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold shadow-lg mt-1"
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              "Save Changes"
                            )}
                          </Button>
                        </>
                      ) : (
                        <Button
                          size="lg"
                          onClick={() => setIsEditing(true)}
                          className="bg-white text-indigo-700 hover:bg-gray-100 font-semibold shadow-lg mt-1"
                        >
                          <Pencil className="mr-2 h-4 w-4 " />
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-10 pb-12 px-10 bg-gray-50/50">
                  {renderContent()}
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfilePage;
