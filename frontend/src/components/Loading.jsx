import React from "react";
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-dark/50 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-gray-400 text-sm animate-pulse">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
