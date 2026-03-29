import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      <p className="text-gray-500">Please wait...</p>
    </div>
  );
}
