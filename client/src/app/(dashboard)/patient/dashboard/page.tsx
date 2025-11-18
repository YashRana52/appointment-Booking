import Loader from "@/components/Loader";
import PatientDashBoardContent from "@/components/patient/PatientDashBoardContent";
import React, { Suspense } from "react";

function page() {
  return (
    <Suspense fallback={<Loader />}>
      <PatientDashBoardContent />
    </Suspense>
  );
}

export default page;
