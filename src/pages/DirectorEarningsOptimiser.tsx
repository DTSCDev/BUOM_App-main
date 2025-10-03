import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DirectorEarningsOptimiser = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-6">
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
            <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
              <DollarSign className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Director Earnings Optimiser
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Optimize your director earnings and tax efficiency strategies
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 mb-6">
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                Coming Soon
              </h3>
              <p className="text-yellow-700">
                The Director Earnings Optimiser is currently under development. 
                This calculator will help you optimize your director earnings, 
                salary vs dividend strategies, and tax efficiency planning.
              </p>
            </div>
            
            <div className="text-left max-w-2xl mx-auto">
              <h4 className="text-lg font-semibold mb-3">Features will include:</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Salary vs dividend optimization</li>
                <li>Tax efficiency calculations</li>
                <li>National Insurance optimization</li>
                <li>Corporation tax planning</li>
                <li>Personal allowance utilization</li>
                <li>Dividend allowance optimization</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DirectorEarningsOptimiser;