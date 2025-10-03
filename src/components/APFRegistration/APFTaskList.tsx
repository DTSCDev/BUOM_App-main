
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, AlertCircle } from "lucide-react";
import { useNetAssetValue } from "@/hooks/useNetAssetValue";

interface APFTaskListProps {
  profile: any;
}

export function APFTaskList({ profile }: APFTaskListProps) {
  const { assets, liabilities } = useNetAssetValue();

  const tasks = [
    {
      id: "personal-details",
      title: "Complete Personal Details",
      completed: !!(profile?.first_name && profile?.last_name && profile?.date_of_birth && profile?.national_insurance_number),
      required: true
    },
    {
      id: "salary-details",
      title: "Set Salary Details",
      completed: !!(profile?.annual_salary && profile?.annual_salary > 0 && profile?.employment_type),
      required: true
    },
    {
      id: "address-details",
      title: "Add Address Details",
      completed: !!(profile?.address_line1 && profile?.city && profile?.postcode),
      required: true
    },
    {
      id: "pension-details",
      title: "Add Pension Information",
      completed: !!(profile?.pension_provider && (profile?.pension_contribution_employee || 0) > 0),
      required: true
    },
    {
      id: "assets",
      title: "Add Asset Information",
      completed: assets && assets.length > 0,
      required: false
    },
    {
      id: "liabilities",
      title: "Add Liability Information",
      completed: liabilities && liabilities.length > 0,
      required: false
    },
    {
      id: "documents",
      title: "Upload Required Documents",
      completed: false, // This would be checked against document uploads
      required: true
    },
    {
      id: "advisor",
      title: "Add Professional Advisor",
      completed: false, // This would be checked against advisor records
      required: false
    }
  ];

  const completedTasks = tasks.filter(task => task.completed).length;
  const requiredTasks = tasks.filter(task => task.required);
  const completedRequiredTasks = requiredTasks.filter(task => task.completed).length;
  const progressPercentage = (completedTasks / tasks.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">APF Registration Checklist</CardTitle>
        <div className="space-y-2">
          <Progress value={progressPercentage} className="w-full" />
          <p className="text-sm text-muted-foreground">
            {completedTasks} of {tasks.length} tasks completed ({completedRequiredTasks} of {requiredTasks.length} required)
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center space-x-3">
              {task.completed ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : task.required ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
              <div className="flex-1">
                <p className={`text-sm ${task.completed ? 'text-green-600 line-through' : 'text-gray-900'}`}>
                  {task.title}
                </p>
                {task.required && !task.completed && (
                  <p className="text-xs text-red-500">Required for APF registration</p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900">Complete Your Profile</h4>
          <p className="text-xs text-blue-800 mt-1">
            Complete the required tasks above to pre-populate your APF registration and speed up the application process.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
