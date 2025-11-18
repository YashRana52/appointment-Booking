import { Doctor } from "@/lib/types";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Award, Heart, MapPin, Star } from "lucide-react";
import { Badge } from "../ui/badge";

interface DoctorProfileInterface {
  doctor: Doctor;
}

function DoctorProfile({ doctor }: DoctorProfileInterface) {
  return (
    <Card className="sticky top-8 shadow-xl border rounded-2xl overflow-hidden">
      <CardContent className="p-8 space-y-8">
        <div className="text-center">
          <Avatar className="w-32 h-32 mx-auto ring-4 ring-blue-200">
            {doctor.profileImage ? (
              <AvatarImage src={doctor.profileImage} alt={doctor.name} />
            ) : (
              <AvatarFallback className="bg-blue-600 text-white font-bold text-5xl">
                {doctor.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>

          <h2 className="text-3xl font-extrabold text-gray-900 mt-5">
            {doctor.name}
          </h2>

          <p className="text-blue-700 font-medium text-md">
            {doctor.specialization}
          </p>

          <p className="text-gray-500 text-sm">{doctor.qualification}</p>

          <p className="text-gray-600 text-sm mt-1">
            {doctor.experience} years experience
          </p>

          {/* Ratings */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="w-4 h-4 fill-orange-400 text-orange-400"
              />
            ))}
            <span className="text-sm text-gray-500">New Doctor</span>
          </div>

          {/* Badges */}
          <div className="flex justify-center flex-wrap gap-2 mt-4">
            {doctor.isVerified && (
              <Badge className="bg-green-100 text-green-800">
                <Award className="w-3 h-3 mr-1" /> Verified
              </Badge>
            )}

            {doctor.category?.map((cat, idx) => (
              <Badge
                key={idx}
                className="bg-blue-100 text-blue-800 flex items-center"
              >
                <Award className="w-3 h-3 mr-1" />
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* About */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-2">About</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {doctor.about}
          </p>
        </div>

        {/* Hospital Info */}
        {doctor.hospitalInfo && (
          <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-2">
              Hospital / Clinic
            </h3>

            <div className="space-y-1 text-sm text-gray-600">
              <p className="font-medium text-gray-800">
                {doctor.hospitalInfo.name}
              </p>
              <p>{doctor.hospitalInfo.address}</p>

              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>{doctor.hospitalInfo.city}</span>
              </div>
            </div>
          </div>
        )}

        {/* Fees */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm">
          <div>
            <p className="text-sm text-green-700 font-medium">
              Consultation Fees
            </p>

            <p className="text-3xl text-green-800 font-extrabold leading-tight">
              ₹{doctor.fees}
            </p>

            <p className="text-xs text-green-600 mt-1">
              {doctor.slotDurationMinutes} minutes session
            </p>
          </div>

          <div className="p-3 bg-green-200 rounded-full shadow-inner">
            <Heart className="w-7 h-7 text-green-800" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default DoctorProfile;
