import { Appointment } from "@/store/appointmentStore";
import React, { useCallback, useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

interface AppointmentCallInterface {
  appointment: Appointment;
  currentUser: {
    id: string;
    name: string;
    role: "doctor" | "patient";
  };
  onCallEnd: () => void;
  joinConsultation: (appointmentId: string) => Promise<void>;
}

function AppointmentCall({
  appointment,
  currentUser,
  joinConsultation,
  onCallEnd,
}: AppointmentCallInterface) {
  const zpRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializationRef = useRef(false);
  const isMountedRef = useRef(false);

  const memoizedJoinConsultation = useCallback(
    async (appointmentId: string) => {
      await joinConsultation(appointmentId);
    },
    [joinConsultation]
  );

  const initializeCall = useCallback(
    async (container: HTMLDivElement) => {
      if (initializationRef.current || zpRef.current || !isMountedRef.current)
        return;
      if (!container || !container.isConnected) return;

      try {
        initializationRef.current = true;

        const appId = process.env.NEXT_PUBLIC_ZEGOCLOUD_APP_ID;
        const serverSecret = process.env.NEXT_PUBLIC_ZEGOCLOUD_SERVER_SECRET;

        if (!appId || !serverSecret) {
          throw new Error("ZegoCloud credentials missing.");
        }

        const numericAppId = Number(appId);
        if (isNaN(numericAppId)) throw new Error("Invalid Zego App ID");

        try {
          await memoizedJoinConsultation(appointment._id);
        } catch (err) {
          console.log("Consultation update failed");
        }

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          numericAppId,
          serverSecret,
          appointment.zegoRoomId,
          currentUser.id,
          currentUser.name
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zpRef.current = zp;

        const isVideo = appointment.consultationType === "Video Consultation";

        zp.joinRoom({
          container,
          scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },

          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: isVideo,
          showMyCameraToggleButton: isVideo,

          showTextChat: true,
          showUserList: true,
          showScreenSharingButton: isVideo,
          showAudioVideoSettingsButton: true,
          showTurnOffRemoteCameraButton: true,
          showTurnOffRemoteMicrophoneButton: true,

          maxUsers: 2,
          showLayoutButton: false,
          layout: "Auto",

          onJoinRoom: () => {
            console.log("Joined room:", appointment.zegoRoomId);
          },

          // ✅ FIXED: This now properly handles CANCEL/END call
          onLeaveRoom: async () => {
            console.log("User ended the call");

            try {
              await onCallEnd(); // your callback
            } catch {}

            try {
              zpRef.current?.destroy();
            } catch {}

            window.location.href = "/dashboard"; // redirect
          },

          // Don’t auto-close UI
          onReturnToHomeScreenClicked: () => {
            console.log("Return Home clicked — ignored");
          },

          showLeavingView: true,
        });
      } catch (err) {
        console.error("Call init error:", err);
        initializationRef.current = false;
      }
    },
    [
      appointment._id,
      appointment.zegoRoomId,
      appointment.consultationType,
      currentUser.id,
      currentUser.name,
      memoizedJoinConsultation,
    ]
  );

  useEffect(() => {
    isMountedRef.current = true;

    if (containerRef.current && !initializationRef.current) {
      initializeCall(containerRef.current);
    }

    return () => {
      isMountedRef.current = false;

      if (zpRef.current) {
        try {
          zpRef.current.destroy();
        } catch {}
        zpRef.current = null;
      }
    };
  }, [initializeCall]);

  const isVideoCall = appointment.consultationType === "Video Consultation";

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col">
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            {isVideoCall ? "Video Consultation" : "Voice Consultation"}
          </h1>
          <p className="text-sm text-gray-600">
            {currentUser.role === "doctor"
              ? `Patient: ${appointment.patientId.name}`
              : `Dr. ${appointment.doctorId.name}`}
          </p>
        </div>
      </div>

      <div ref={containerRef} className="w-full h-full bg-gray-900"></div>
    </div>
  );
}

export default AppointmentCall;
