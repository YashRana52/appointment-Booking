import DoctorAppointment from "@/components/doctor/DoctorAppointment";
import DoctorDashBoardContent from "@/components/doctor/DoctorDashBoardContent";
import Loader from "@/components/Loader";
import React, { Suspense } from "react";

function page() {
  return (
    <Suspense fallback={<Loader />}>
      <DoctorAppointment />
    </Suspense>
  );
}

export default page;
