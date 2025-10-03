import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlanC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            onClick={() => navigate("/calculator_hub")}
            variant="outline"
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Calculator Hub
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader className="text-center">
            <div className="bg-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
              <span role="img" aria-label="pumpkin" className="text-3xl">🎃</span>
            </div>
            <CardTitle className="text-3xl font-bold text-gray-900">
              Plan C
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Use our exclusive Restitution Funding Calculator to work out if you and other family members have been affected by Pensionwashing over the last 10 years.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-12">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 mb-6">
              <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                Coming Soon
              </h3>
              <p className="text-yellow-700">
                This feature will guide you through assessing potential restitution funding related to Pensionwashing, including multi-family impact analysis.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanC;