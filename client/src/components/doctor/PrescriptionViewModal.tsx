import React from "react";

interface PrescriptionViewModalProps {
  appointment: any;
  userType: string;
  trigger: React.ReactNode;
}

const PrescriptionViewModal: React.FC<PrescriptionViewModalProps> = ({
  appointment,
  userType,
  trigger,
}) => {
  return (
    <div>
      PrescriptionViewModal
      {/* yahan aap appointment details show kar sakte ho */}
    </div>
  );
};

export default PrescriptionViewModal;
