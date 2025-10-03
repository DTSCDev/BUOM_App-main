
import { calculateFullISATimeline } from './isaTimelineCalculator';

// Legacy functions for backward compatibility
export const calculateISASchedule = () => {
  const fullTimeline = calculateFullISATimeline();
  return {
    monthlySchedule: [],
    totalAt12Months: fullTimeline.timeline[11]?.isaCumulativeValue || 0,
    totalAt24Months: fullTimeline.timeline[23]?.isaCumulativeValue || 0,
    totalAt36Months: fullTimeline.timeline[35]?.isaCumulativeValue || 0,
    finalTotal: fullTimeline.finalISAValue,
    totalContributions: fullTimeline.totalISAContributions,
    totalGrowth: fullTimeline.finalISAValue - fullTimeline.totalISAContributions
  };
};

export const getISATotalForYear = (year: number): number => {
  const fullTimeline = calculateFullISATimeline();
  const monthIndex = (year * 12) - 1;
  return fullTimeline.timeline[monthIndex]?.isaCumulativeValue || 0;
};

export const getISAMonthlyForYear = (year: number): number => {
  const fullTimeline = calculateFullISATimeline();
  const monthIndex = ((year - 1) * 12);
  return fullTimeline.timeline[monthIndex]?.totalISAMonthly || 0;
};
