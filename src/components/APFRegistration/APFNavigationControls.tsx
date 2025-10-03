
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface APFNavigationControlsProps {
  currentStep: number;
  canProceed: boolean;
  onNext: () => void;
  onBack: () => void;
}

export function APFNavigationControls({ currentStep, canProceed, onNext, onBack }: APFNavigationControlsProps) {
  return (
    <div className="flex justify-between items-center pt-4">
      <Button
        variant="outline"
        onClick={onBack}
        disabled={currentStep === 1}
        className="flex items-center space-x-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Previous</span>
      </Button>
      
      <div className="text-sm text-gray-500">
        <span className="text-green-600 font-medium">Step {currentStep} of 6 - Unrestricted Access</span>
      </div>
      
      <Button
        onClick={onNext}
        disabled={currentStep === 6}
        className="flex items-center space-x-2"
      >
        <span>{currentStep === 6 ? "Complete" : "Next"}</span>
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
