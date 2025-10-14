
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
    <Card className="border-2" style={{ borderColor: '#374151' }}>
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#4FF456' }}>APF Registration Progress</h3>
          <span className="text-sm text-gray-500">Step {currentStep} of 6</span>
        </div>
        <div className="w-full h-2 rounded" style={{ backgroundColor: '#374151' }}>
          <div
            className="h-2 rounded"
            style={{ width: `${progressPercentage}%`, backgroundColor: '#4FF456' }}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-gray-700 p-2 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1">
            {steps.map((step) => {
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;

              const tileStyle: React.CSSProperties = {
                backgroundColor: isCurrent ? '#4FF546' : 'transparent',
                color: isCurrent ? '#374151' : '#4FF456',
              };

              return (
                <button
                  type="button"
                  key={step.id}
                  className="p-2 rounded-md text-left transition-colors"
                  style={tileStyle}
                  onClick={() => isCompleted && onStepClick(step.id)}
                  disabled={!isCompleted}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`inline-flex items-center justify-center aspect-square w-6 rounded-full border-2 font-bold text-[12px] leading-none shrink-0 ${!isCurrent ? 'opacity-50' : ''}`}
                      style={{
                        borderColor: isCurrent ? '#374151' : '#4FF456',
                        color: isCurrent ? '#374151' : '#4FF456',
                        backgroundColor: 'transparent'
                      }}
                    >
                      {step.id}
                    </div>
                    <span className={`font-medium text-[13px] leading-tight ${!isCurrent ? 'opacity-50' : ''}`}>
                      {step.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
