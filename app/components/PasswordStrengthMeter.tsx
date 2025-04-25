"use client";
import React from "react";

const PasswordStrengthMeter = ({ password }: { password: string }) => {
  const calculateStrength = () => {
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 4);
  };

  const strength = calculateStrength();
  const strengthText = ["Very Weak", "Weak", "Good", "Strong", "Very Strong"][strength];
  const strengthColor = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500"
  ][strength];

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">Password Strength: {strengthText}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${strengthColor}`}
          style={{ width: `${(strength / 4) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;