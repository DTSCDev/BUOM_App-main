import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MaxPensionFunding = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            onClick={() => navigate("/calculators")}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Calculators
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
              <Calculator className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Max Pension Funding
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Calculate maximum pension funding opportunities and allowances
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 mb-6">
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                Coming Soon
              </h3>
              <p className="text-yellow-700">
                The Max Pension Funding calculator is currently under development. 
                This calculator will help you determine the maximum pension contributions 
                you can make while staying within HMRC allowances.
              </p>
            </div>
            
            <div className="text-left max-w-2xl mx-auto">
              <h4 className="text-lg font-semibold mb-3">Features will include:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Annual allowance calculations</li>
                <li>Lifetime allowance planning</li>
                <li>Carry forward allowance optimization</li>
                <li>Tapered annual allowance calculations</li>
                <li>Money purchase annual allowance considerations</li>
                <li>Tax relief optimization strategies</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaxPensionFunding;