import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, DollarSign, FileText, CreditCard, Settings, ArrowLeft, ExternalLink } from "lucide-react";

export function FreeCalculatorLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    { id: "calculator", label: "Calculator", icon: Calculator, path: "/free-calculator/calculator" },
    { id: "affordability", label: "Affordability", icon: DollarSign, path: "/free-calculator/affordability" },
    { id: "funding-eligibility", label: "Funding Eligibility", icon: FileText, path: "/free-calculator/funding-eligibility" },
    { id: "subscription", label: "Subscription", icon: CreditCard, path: "/free-calculator/subscription" },
    { id: "parameters", label: "Parameters", icon: Settings, path: "/free-calculator/parameters" }
  ];

  const currentTab = tabs.find(tab => location.pathname === tab.path)?.id || "calculator";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-bold text-gray-900">Free Calculator</h1>
              <div className="px-2 py-1 text-xs font-medium rounded" style={{ backgroundColor: '#4FF456', color: '#4FF456' }}>
                SFM-XXX System
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("https://my.buom.app", "_blank")}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              MY.BUOM.APP
            </Button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  currentTab === tab.id
                    ? "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                style={currentTab === tab.id ? { borderBottomColor: '#4FF456', color: '#4FF456' } : {}}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* System Notice */}
      <div className="bg-yellow-50 border-b border-yellow-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-yellow-800">
                <strong>Free System:</strong> Using generic SFM-XXX codes for universal calculations
              </span>
            </div>
            <span className="text-xs text-yellow-600">
              For personalized calculations, upgrade to subscription
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}