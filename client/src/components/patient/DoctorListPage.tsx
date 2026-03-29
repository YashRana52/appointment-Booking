"use client";
import { DoctorFilters } from "@/lib/types";
import { useDoctorStore } from "@/store/doctorStore";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "../landing/Header";
import { Filter, MapPin, Search, Star, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cities, healthcareCategories, specializations } from "@/lib/constant";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

function DoctorListPage() {
  const searchParams = useSearchParams();
  const categoryParams = searchParams.get("category");

  const { doctors, loading, fetchDoctors } = useDoctorStore();

  const [filters, setFilters] = useState<DoctorFilters>({
    search: "",
    specialization: "",
    category: categoryParams || "",
    city: "",
    sortBy: "experience",
    sortOrder: "desc",
  });

  const [showFilters, setShowFilters] = useState(false);

  // Convert "all" to empty string
  const handleFilterChange = (key: keyof DoctorFilters, value: string) => {
    const newValue = value === "all" ? "" : value;
    setFilters((prev) => ({ ...prev, [key]: newValue }));
  };

  useEffect(() => {
    fetchDoctors(filters);
  }, [filters]);

  const clearFilters = () => {
    setFilters({
      search: "",
      specialization: "",
      category: categoryParams || "",
      city: "",
      sortBy: "experience",
      sortOrder: "desc",
    });
  };

  const activeFilterCount = Object.values(filters).filter(
    (v) => v && !["experience", "desc"].includes(v as string)
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Find Your Perfect Doctor
          </motion.h1>
          <p className="text-lg opacity-90">
            Book trusted healthcare professionals in minutes
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        {/* Search & Filter Bar */}
        <Card className="shadow-2xl border-0 backdrop-blur-xl bg-white/95">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search by name, specialty, or condition..."
                  className="pl-12 h-14 text-lg border-0 bg-gray-50/70 focus:bg-white transition-all rounded-2xl shadow-inner"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </div>

              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 rounded-2xl border-2 font-medium"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-5 h-5 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge className="ml-2 bg-blue-600 text-white">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Category Pills */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant={!filters.category ? "default" : "outline"}
                size="sm"
                className="rounded-full font-medium"
                onClick={() => handleFilterChange("category", "all")}
              >
                All
              </Button>
              {healthcareCategories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={
                    filters.category === cat.title ? "default" : "outline"
                  }
                  size="sm"
                  className="rounded-full font-medium flex items-center gap-2"
                  onClick={() => handleFilterChange("category", cat.title)}
                >
                  <div
                    className={`w-8 h-8 ${cat.color} rounded-full flex items-center justify-center`}
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={cat.icon} />
                    </svg>
                  </div>
                  {cat.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mt-6 shadow-xl border-0 backdrop-blur bg-white/90">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">
                      Refine Your Search
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowFilters(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {/* Specialization */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Specialization
                      </label>
                      <Select
                        value={filters.specialization || "all"}
                        onValueChange={(v) =>
                          handleFilterChange("specialization", v)
                        }
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="All Specializations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            All Specializations
                          </SelectItem>
                          {specializations.map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* City */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        City
                      </label>
                      <Select
                        value={filters.city || "all"}
                        onValueChange={(v) => handleFilterChange("city", v)}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue placeholder="All Cities" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Cities</SelectItem>
                          {cities.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-2 block">
                        Sort By
                      </label>
                      <Select
                        value={filters.sortBy}
                        onValueChange={(v) => handleFilterChange("sortBy", v)}
                      >
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="experience">Experience</SelectItem>
                          <SelectItem value="fees">Consultation Fee</SelectItem>
                          <SelectItem value="name">Name A-Z</SelectItem>
                          <SelectItem value="createdAt">
                            Newest First
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Clear */}
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        className="w-full h-12"
                        onClick={clearFilters}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="mt-10 mb-6 flex justify-between items-center">
          <p className="text-gray-600 font-medium">
            {loading
              ? "Searching doctors..."
              : `${doctors.length} doctor${
                  doctors.length !== 1 ? "s" : ""
                } found`}
          </p>
        </div>

        {/* Doctor Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="bg-gray-200 border-2 border-dashed rounded-full w-24 h-24 mx-auto mb-4" />
                  <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : doctors.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7"
          >
            {doctors.map((doctor, idx) => (
              <motion.div
                key={doctor._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="group hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden bg-white/80 backdrop-blur">
                  <CardContent className="p-6 text-center">
                    <div className="relative mb-5">
                      <Avatar className="w-28 h-28 mx-auto ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all">
                        <AvatarImage
                          src={doctor.profileImage}
                          alt={doctor.name}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-2xl font-bold">
                          {doctor.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute top-1 right-1 bg-green-500 w-4 h-4 rounded-full ring-4 ring-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-blue-600 font-medium mt-1">
                      {doctor.specialization}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {doctor.experience}+ years experience
                    </p>

                    <div className="flex justify-center my-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        5.0
                      </span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 my-4">
                      {doctor.category?.slice(0, 2).map((cat, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-blue-100 text-blue-700"
                        >
                          {cat}
                        </Badge>
                      ))}
                      <Badge className="bg-gradient-to-r from-orange-400 to-pink-400 text-white">
                        <Star className="w-3 h-3 mr-1" /> Popular
                      </Badge>
                    </div>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                        {doctor.hospitalInfo.city}
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        ₹{doctor.fees}
                        <span className="text-xs font-normal text-gray-500 ml-1">
                          / consultation
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/patient/booking/${doctor._id}`}
                      className="block mt-6"
                    >
                      <Button className="w-full h-12 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                        Book Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <Card className="p-16 text-center bg-white/70 backdrop-blur">
            <Search className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              No doctors found
            </h3>
            <p className="text-gray-500 mb-8">
              Try adjusting your filters or search term
            </p>
            <Button size="lg" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

export default DoctorListPage;
