
import { DemoDataService } from "@/services/demoDataService";
import { ApplyForFundingOverride } from "./ApplyForFundingOverride";

export function CurrentYearAPFCard() {
  const apfData = DemoDataService.getAPFData();

  // Always show override since no real APF registration has been completed
  return (
    <ApplyForFundingOverride
      title="Current Year Advanced Pension Funding"
      backgroundColor="bg-yellow-600"
      buttonColor="bg-white"
      hoverColor="hover:bg-gray-100"
    />
  );
}
