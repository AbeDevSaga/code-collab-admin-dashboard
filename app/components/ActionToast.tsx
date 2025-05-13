import React, { useEffect } from "react";
import { TToast } from "../constants/type";

interface ActionToastProps {
  message: string;
  type: TToast;
  onClose: () => void;
  duration?: number;
  position?: "top" | "center" | "bottom";
}

const ActionToast: React.FC<ActionToastProps> = ({
  message,
  type,
  onClose,
  duration = 3000,
  position = "center",
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-400 text-green-800";
      case "error":
        return "bg-red-100 border-red-400 text-red-800";
      case "warning":
        return "bg-yellow-100 border-yellow-400 text-yellow-800";
      case "info":
        return "bg-blue-100 border-blue-400 text-blue-800";
      default:
        return "bg-gray-100 border-gray-400 text-gray-800";
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case "top":
        return "top-4 mt-4";
      case "center":
        return "top-1/2 -translate-y-1/2";
      case "bottom":
        return "bottom-4 mb-4";
      default:
        return "top-1/2 -translate-y-1/2";
    }
  };

  return (
    <div className={`fixed left-1/2 -translate-x-1/2 ${getPositionStyles()} z-50 pointer-events-none`}>
      <div
        className={`${getTypeStyles()} px-6 py-3 rounded-full shadow-lg border flex items-center space-x-3 animate-toast-popup`}
      >
        <div className="flex items-center">
          {type === "success" && (
            <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {type === "error" && (
            <svg className="w-5 h-5 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          {type === "warning" && (
            <svg className="w-5 h-5 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )}
          {type === "info" && (
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <span className="font-medium">{message}</span>
        </div>
        <button
          onClick={onClose}
          className="pointer-events-auto flex items-center justify-center w-5 h-5 rounded-full bg-white bg-opacity-30 hover:bg-opacity-40 transition-all"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ActionToast;