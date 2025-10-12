
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle } from "lucide-react";

interface APFProgressIndicatorProps {
  currentStep: number;
  completedSteps: number[];
  onStepClick: (stepId: number) => void;
}

export function APFProgressIndicator({ currentStep, completedSteps, onStepClick }: APFProgressIndicatorProps) {
  const steps = [
    { id: 1, title: "Personal Details", description: "Verify your information" },
    { id: 2, title: "Key Financials", description: "Review funding requirements" },
    { id: 3, title: "Key Commitments", description: "Understand your obligations" },
    { id: 4, title: "Value for Money Comparison", description: "Compare BUOM vs DC Workplace" },
    { id: 5, title: "Salary Exchange", description: "Choose funding method" },
    { id: 6, title: "Terms & Conditions", description: "Agreement in Principle" }
  ];

  const progressPercentage = (currentStep / 6) * 100;

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#4FF456]">Application Progress</h3>
          <span className="text-sm text-gray-500">Step {currentStep} of 6</span>
        </div>
        <Progress value={progressPercentage} className="w-full h-2" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {steps.map((step) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            
            return (
              <div 
                key={step.id} 
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  isCurrent 
                    ? 'bg-blue-50 border-blue-300' 
                    : isCompleted 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-gray-50 border-gray-200'
                }`}
                onClick={() => isCompleted && onStepClick(step.id)}
              >
                <div className="flex items-center space-x-2 mb-1">
                  {isCompleted ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Circle className={`h-4 w-4 ${isCurrent ? 'text-blue-600' : 'text-gray-400'}`} />
                  )}
                  <span className={`text-xs font-medium ${
                    isCurrent ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </span>
                </div>
                <p className={`text-xs ${
                  isCurrent ? 'text-blue-700' : isCompleted ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
