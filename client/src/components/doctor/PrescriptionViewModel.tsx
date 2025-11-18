import { Appointment } from "@/store/appointmentStore";
import React, { ReactNode } from "react";

interface PrescriptionViewModalInterface {
  appointment: Appointment;
  userType: "doctor" | "patient";
  trigger: ReactNode;
}

function PrescriptionViewModel({
  appointment,
  userType,
  trigger,
}: PrescriptionViewModalInterface) {
  return <div>PrescriptionViewModel</div>;
}

export default PrescriptionViewModel;
