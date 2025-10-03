
export class DemoDataService {
  static getAPFData() {
    return {
      hasActiveFunding: false, // No active funding until real APF registration is completed
      sponsorshipYear: "2024-25 Sponsorship Year"
    };
  }

  static getINBLData() {
    return {
      hasActiveFunding: false, // No active funding until real INBL registration is completed
      sponsorshipYear: "2024-25 Sponsorship Year"
    };
  }

  static getUserFundingStatus() {
    const apfData = this.getAPFData();
    const inblData = this.getINBLData();
    
    return {
      hasAPF: apfData.hasActiveFunding,
      hasINBL: inblData.hasActiveFunding,
      hasActiveFunding: apfData.hasActiveFunding || inblData.hasActiveFunding
    };
  }

  static getChartData() {
    return {
      estimatedShortfall: 0,
      proposedAPFFunding: 571428,
      shortfallAtRetirement: 571428,
      capitalShortfallToday: 285714
    };
  }
}
