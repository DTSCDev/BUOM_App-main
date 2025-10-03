import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, TrendingUp, DollarSign, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
// Removed unused Link import

const Calculators = () => {
  const navigate = useNavigate();

  const calculators = [
    {
      title: "Retirement Calculator",
      description: "Plan your retirement with comprehensive pension calculations and projections",
      icon: <TrendingUp className="h-8 w-8" />,
      path: "/calculator_hub/retirement_calculator",
      color: "bg-blue-500"
    },
    {
      title: "Plan C",
      description: "Use our exclusive Restitution Funding Calculator to work out if you and other family members have been affected by Pensionwashing over the last 10 years.",
      icon: <span role="img" aria-label="pumpkin" className="text-3xl">🎃</span>,
      path: "/calculator_hub/plan_c",
      color: "bg-black"
    },
    {
      title: "Director Earnings Optimiser",
      description: "Optimize your director earnings and tax efficiency strategies",
      icon: <DollarSign className="h-8 w-8" />,
      path: "/calculator_hub/director_earnings",
      color: "bg-green-500"
    },
    {
      title: "Max Pension Funding",
      description: "Calculate maximum pension funding opportunities and allowances",
      icon: <Calculator className="h-8 w-8" />,
      path: "/calculator_hub/max_pension_funding",
      color: "bg-purple-500"
    },
    {
      title: "Parameter Settings",
      description: "Configure calculation parameters and UK tax rates for all calculators",
      icon: <Settings className="h-8 w-8" />,
      path: "/calculator_hub/parameter_settings",
      color: "bg-orange-500"
    },
    {
      title: "Payslip Comparison",
      description: "Compare payslips with different tax scenarios and pension contributions",
      icon: <Calculator className="h-8 w-8" />,
      path: "/calculator_hub/payslip_comparison",
      color: "bg-teal-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Calculator Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our suite of professional financial calculators to optimize your financial planning
          </p>
          {/* Quick Navigation removed per request */}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {calculators.map((calc, index) => (
            <Card key={index} className="min-h-[320px] h-full flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
              <CardHeader className="text-center pb-4">
                <div className={`${calc.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white group-hover:scale-110 transition-transform duration-300`}>
                  {calc.icon}
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {calc.title}
                </CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  {calc.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0 mt-auto">
                <Button 
                  onClick={() => navigate(calc.path)}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-700"
                  size="sm"
                >
                  {calc.title === "Parameter Settings" ? "Configure" : "Launch Calculator"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Need help choosing the right calculator? Contact our team for personalized guidance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Calculators;