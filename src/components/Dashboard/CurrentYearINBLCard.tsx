
import { DemoDataService } from "@/services/demoDataService";
import { ApplyForFundingOverride } from "./ApplyForFundingOverride";

export function CurrentYearINBLCard() {
  const inblData = DemoDataService.getINBLData();

  // Always show override since no real INBL registration has been completed
  return (
    <ApplyForFundingOverride
      title="Current Year INBL Loan Facility"
      backgroundColor="bg-green-600"
      buttonColor="bg-white"
      hoverColor="hover:bg-gray-100"
    />
  );
}
