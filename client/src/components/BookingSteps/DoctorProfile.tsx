import { Doctor } from "@/lib/types";
import React from "react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  MapPin,
  Star,
  Award,
  HeartHandshake,
  Stethoscope,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

interface DoctorProfileProps {
  doctor: Doctor;
  showRating?: boolean;
}

function DoctorProfile({ doctor, showRating = false }: DoctorProfileProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="overflow-hidden border-0 shadow-2xl bg-white/95 backdrop-blur-xl">
        {/* Gradient Header */}
        <div className="h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 relative">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="relative px-6 pb-8 -mt-20">
          {/* Avatar with Ring & Online Indicator */}
          <div className="flex justify-center">
            <div className="relative">
              <Avatar className="w-32 h-32 ring-8 ring-white shadow-2xl border-4 border-white">
                <AvatarImage
                  src={doctor.profileImage}
                  alt={doctor.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-4xl font-bold">
                  {doctor.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full ring-4 ring-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* Name & Specialization */}
          <div className="text-center mt-6">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
              Dr. {doctor.name}
              {doctor.isVerified && (
                <Badge className="bg-blue-600 text-white px-2 py-0.5 text-xs">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </h2>

            <p className="text-xl font-semibold text-blue-600 mt-2 flex items-center justify-center gap-2">
              <Stethoscope className="w-5 h-5" />
              {doctor.specialization}
            </p>

            <p className="text-sm text-gray-600 mt-1 font-medium">
              {doctor.qualification} • {doctor.experience}+ years experience
            </p>
          </div>

          {/* Rating */}
          {showRating && (
            <div className="flex items-center justify-center gap-3 mt-5">
              <div className="flex items-center bg-orange-50 px-4 py-2 rounded-full">
                <Star className="w-5 h-5 fill-orange-400 text-orange-400" />
                <span className="ml-1 font-bold text-orange-600">5.0</span>
              </div>
              <span className="text-sm text-gray-500">
                Based on 200+ reviews
              </span>
            </div>
          )}

          {/* Category Badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {doctor.category?.slice(0, 3).map((cat, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 font-medium border-0"
              >
                <Award className="w-3.5 h-3.5 mr-1" />
                {cat}
              </Badge>
            ))}
            {doctor.category && doctor.category.length > 3 && (
              <Badge variant="secondary" className="bg-gray-100">
                +{doctor.category.length - 3} more
              </Badge>
            )}
          </div>

          {/* About Section */}
          <div className="mt-8 p-6 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-blue-600" />
              About Doctor
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {doctor.about ||
                "Experienced and compassionate doctor providing personalized care with latest treatment methods."}
            </p>
          </div>

          {/* Clinic Info */}
          {doctor.hospitalInfo && (
            <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
              <h3 className="font-bold text-gray-900 mb-3">Clinic Location</h3>
              <div className="space-y-3">
                <p className="font-semibold text-gray-800">
                  {doctor.hospitalInfo.name}
                </p>
                <p className="text-sm text-gray-600">
                  {doctor.hospitalInfo.address}
                </p>
                <div className="flex items-center gap-2 text-emerald-700">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">
                    {doctor.hospitalInfo.city}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Fees Card */}
          <div className="mt-8 p-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">
                  Consultation Fee
                </p>
                <p className="text-4xl font-extrabold mt-1">₹{doctor.fees}</p>
                <p className="text-green-100 text-sm mt-2 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {doctor.slotDurationMinutes || 30} minutes session
                </p>
              </div>
              <div className="p-4 bg-white/20 backdrop-blur rounded-2xl">
                <HeartHandshake className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 grid grid-cols-2 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">500+</p>
              <p className="text-xs text-gray-600 mt-1">Patients Treated</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-xl">
              <p className="text-2xl font-bold text-purple-600">98%</p>
              <p className="text-xs text-gray-600 mt-1">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default DoctorProfile;
