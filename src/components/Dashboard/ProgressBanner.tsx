
import { DemoDataService } from "@/services/demoDataService";

interface ProgressBannerProps {
  progressPercentage: number;
  className?: string;
}

export function ProgressBanner({ progressPercentage, className = "" }: ProgressBannerProps) {
  const fundingStatus = DemoDataService.getUserFundingStatus();
  
  const getProgressStatus = () => {
    // If no active sponsorship, only consider existing plan income for progress
    const adjustedProgress = fundingStatus.hasAPF ? progressPercentage : progressPercentage;
    
    if (adjustedProgress >= 95) {
      return {
        color: "bg-green-500",
        text: "ON TARGET",
        textColor: "text-white"
      };
    } else if (adjustedProgress >= 75) {
      return {
        color: "bg-yellow-500",
        text: "NEEDS ATTENTION",
        textColor: "text-white"
      };
    } else {
      return {
        color: "bg-red-500",
        text: "ACTION REQUIRED",
        textColor: "text-white"
      };
    }
  };

  const status = getProgressStatus();

  return (
    <div className={`${status.color} rounded-lg p-1.5 text-center ${className}`}>
      <p className={`${status.textColor} text-xs font-medium`}>
        {status.text} - {Math.round(progressPercentage)}%
      </p>
    </div>
  );
}
