
export interface ISATimelineEntry {
  month: number;
  age: number;
  year1ISAMonthly: number;
  year2ISAMonthly: number;
  year3ISAMonthly: number;
  totalISAMonthly: number;
  isaCumulativeValue: number;
  year1INBLBalance: number;
  year2INBLBalance: number;
  year3INBLBalance: number;
  totalINBLBalance: number;
  redemptionEvent?: {
    tranche: number;
    inblRepayment: number;
    npgReduction: number;
  };
}

export interface ISAFullTimelineResult {
  timeline: ISATimelineEntry[];
  finalISAValue: number;
  totalISAContributions: number;
  totalINBLRepayment: number;
  returnOnCapital: number;
  year1Contributions: number;
  year2Contributions: number;
  year3Contributions: number;
}
