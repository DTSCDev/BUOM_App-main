import React from "react";
import { systemFields } from "@/data/systemFields";

interface SFMCodeDisplayProps {
  sfmCode: string;
  variant?: "default" | "profile" | "dashboard";
}

export const SFMCodeDisplay: React.FC<SFMCodeDisplayProps> = ({ 
  sfmCode, 
  variant = "default" 
}) => {
  const sfmField = systemFields.find(field => field.sfmId === sfmCode);
  
  // Define styling variants
  const variantStyles = {
    default: "text-[8px] text-white opacity-60 font-mono border border-gray-400 px-1 py-0.5 rounded mt-1",
    profile: "text-[8px] text-gray-500 opacity-80 font-mono border border-gray-300 px-1 py-0.5 rounded mt-1",
    dashboard: "text-[8px] text-white opacity-60 font-mono border border-gray-400 px-1 py-0.5 rounded mt-1"
  };
  
  // For profile variant, show only the code (PRF-XXXX) without any description or page/card
  if (variant === "profile") {
    return (
      <div className={variantStyles[variant]}>
        <div>{sfmCode.replace('SFM-', '')}</div>
      </div>
    );
  }

  return (
    <div className={variantStyles[variant]}>
      <div>{sfmCode.replace('SFM-', '')}</div>
      {sfmField && (
        <div className="text-[6px] mt-0.5">
          {sfmField.pageName} › {sfmField.cardName}
        </div>
      )}
    </div>
  );
};