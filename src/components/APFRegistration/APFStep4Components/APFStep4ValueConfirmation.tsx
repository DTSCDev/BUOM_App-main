
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface APFStep4ValueConfirmationProps {
  formData: {
    valueAnalysisReviewed: boolean;
    alternativesConsidered: boolean;
    bestValueConfirmed: boolean;
  };
  onCheckboxChange: (field: string, value: boolean) => void;
  onSubmit: () => void;
  canProceed: boolean;
  isErrorState: boolean;
}

export function APFStep4ValueConfirmation({ 
  formData, 
  onCheckboxChange, 
  onSubmit, 
  canProceed, 
  isErrorState 
}: APFStep4ValueConfirmationProps) {
  const getCheckboxLabels = () => {
    if (isErrorState) {
      return {
        first: "I understand the value proposition of APF and its benefits for retirement planning",
        second: "I have considered alternative investment options and understand APF's advantages",
        third: "I confirm that APF represents a suitable investment option for my retirement planning"
      };
    }
    
    return {
      first: "I have reviewed the value for money analysis and understand the return on capital",
      second: "I have considered alternative investment options and believe APF offers the best value",
      third: "I confirm that APF represents the best use of my money for retirement planning"
    };
  };

  const labels = getCheckboxLabels();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Value Analysis Confirmation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="value-analysis"
            checked={formData.valueAnalysisReviewed}
            onChange={(e) => onCheckboxChange('valueAnalysisReviewed', e.target.checked)}
            className="rounded"
          />
          <label htmlFor="value-analysis" className="text-sm">
            {labels.first}
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="alternatives-considered"
            checked={formData.alternativesConsidered}
            onChange={(e) => onCheckboxChange('alternativesConsidered', e.target.checked)}
            className="rounded"
          />
          <label htmlFor="alternatives-considered" className="text-sm">
            {labels.second}
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="best-value-confirmed"
            checked={formData.bestValueConfirmed}
            onChange={(e) => onCheckboxChange('bestValueConfirmed', e.target.checked)}
            className="rounded"
          />
          <label htmlFor="best-value-confirmed" className="text-sm">
            {labels.third}
          </label>
        </div>

        <Button 
          onClick={onSubmit}
          disabled={!canProceed}
          className="w-full"
        >
          Confirm Best Use of Money
        </Button>
      </CardContent>
    </Card>
  );
}
