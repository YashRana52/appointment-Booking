import { Clock, FileText, Phone, Video } from "lucide-react";

export const healthcareCategories = [
  {
    id: "primary-care",
    title: "Primary Care",
    // Stethoscope - perfect for primary care
    icon: "M19 3h-1V1h-2v2H9V1H7v2H6c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z",
    color: "bg-blue-500",
  },
  {
    id: "manage-condition",
    title: "Manage Condition",
    // Activity / Heartbeat - chronic condition management
    icon: "M12 2L1.5 12h3v8h15v-8h3L12 2zm0 5.5l6 5.5H6l6-5.5z",
    color: "bg-green-500",
  },
  {
    id: "mental-behavioral-health",
    title: "Mental Health",
    // Brain icon - best for mental health
    icon: "M12 2c-3.86 0-7 3.14-7 7 0 2.52 1.34 4.71 3.33 5.93C7.47 16.62 6 18.75 6 21h2c0-2.24 1.12-4.23 2.83-5.47C11.12 16.64 12 18.24 12 20h2c0-1.76.88-3.36 2.17-4.53C18.66 14.29 20 12.1 20 9c0-3.86-3.14-7-7-7z",
    color: "bg-yellow-500",
  },
  {
    id: "sexual-health",
    title: "Sexual Health",
    // Heart with shield / Venus-Mars symbol style
    icon: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
    color: "bg-pink-500",
  },
  {
    id: "childrens-health",
    title: "Children's Health",
    // Baby / Child icon
    icon: "M12 6c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3 9c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm6.17-4.17l-1.42 1.42L16 14.5l-1.41 1.41L13 14.34l-2.59 2.59 1.41 1.41L13 17.17l1.41 1.41L16 17l2.17 2.17 1.41-1.41L17.41 16l2.17-2.17-1.41-1.41L16 14.58l-1.83-1.83z",
    color: "bg-red-500",
  },
  {
    id: "senior-health",
    title: "Senior Health",
    // Person with cane / Elderly
    icon: "M12 2C8.13 2 5 5.13 5 9c0 3.09 2.26 5.65 5.23 6.13.39 1.21 1.42 2.09 2.69 2.09h.08c1.65 0 3-1.35 3-3 0-1.19-.7-2.22-1.72-2.7C15.74 10.1 16 9.07 16 8c0-2.21-1.79-4-4-4zm-1.5 15.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z",
    color: "bg-orange-500",
  },
  {
    id: "womens-health",
    title: "Women's Health",
    // Venus symbol / Female health
    icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-1.97.71-3.83 1.94-5.29l5.35 5.35v2.94h-2.94l-5.35 5.35C7.17 19.29 9.53 20 12 20c4.41 0 8-3.59 8-8s-3.59-8-8-8z",
    color: "bg-purple-500",
  },
  {
    id: "mens-health",
    title: "Men's Health",
    // Mars symbol / Male health
    icon: "M19.07 4.93a10 10 0 1 0 0 14.14 10 10 0 0 0 0-14.14zM12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm3.66-8.66l-1.41 1.41L16.41 13l-1.41 1.41-1.41-1.41L11.41 15l-1.41-1.41 2.18-2.18-1.41-1.41-1.41 1.41L8.59 9l1.41-1.41L12 9.76l1.59-1.59L15 9.76l1.41 1.41L15 12.76l1.41 1.41L15 15.76l-1.41-1.41L12 12.76l-1.59 1.59L9 12.76l-1.41-1.41L9 9.76 7.59 8.34 9 6.93l1.41 1.41L12 6.76l1.59 1.59L15 6.76l1.41 1.41L15 9.76l1.41 1.41z",
    color: "bg-indigo-500",
  },
  {
    id: "wellness",
    title: "Wellness",
    // Sparkles / Wellness & lifestyle
    icon: "M10 2L8.59 6.59 4 7.19l3.34 3.26.78 4.5L12 13l3.88 2.05.78-4.5L20 7.19l-4.59-.6L10 2zm6.24 7.41l.59.07-.4.39-.09.91-.54-.28-.34-.18-.18.34-.28.54-.91.09-.39-.4.07-.59.91-.09.28-.54.18-.34.34.18.54.28.09-.91.4-.39-.59-.07-.91.09-.28.54-.18.34-.34-.18-.54-.28-.09.91z",
    color: "bg-emerald-500",
  },
];

// Healthcare categories (matches backend)
export const healthcareCategoriesList = [
  "Primary Care",
  "Manage Your Condition",
  "Mental & Behavioral Health",
  "Sexual Health",
  "Children's Health",
  "Senior Health",
  "Women's Health",
  "Men's Health",
  "Wellness",
];

export const specializations = [
  "Cardiologist",
  "Dermatologist",
  "Orthopedic",
  "Pediatrician",
  "Neurologist",
  "Gynecologist",
  "General Physician",
  "ENT Specialist",
  "Psychiatrist",
  "Ophthalmologist",
];

export const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Pune",
  "Ahmedabad",
];

export const consultationTypes = [
  {
    type: "Video Consultation",
    icon: Video,
    description: "Live video consultation with your doctor",
    price: 0,
    recommended: true,
  },
  {
    type: "Voice Call",
    icon: Phone,
    description: "Speak with your doctor through a clear audio call",
    price: -100,
    recommended: false,
  },
];

export const emptyStates = {
  upcoming: {
    icon: Clock,
    title: "No Upcoming Appointments",
    description: "You have no upcoming appointments scheduled.",
  },
  completed: {
    icon: FileText,
    title: "No Completed Appointments",
    description: "Completed consultations will appear here.",
  },
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "in progress":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
