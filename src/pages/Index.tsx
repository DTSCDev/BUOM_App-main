
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageBackground from "@/components/Layout/PageBackground";
import LoginPrompt from "@/components/Layout/LoginPrompt";

// Updated to use the new LoginPrompt component

const Index = () => {
  return (
    <PageBackground>
      <div className="flex flex-col items-center justify-center min-h-screen py-8 relative">
        <LoginPrompt />
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              FREE Retirement Shortfall Calculator
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto">
              There are c.13m Qualifying Taxpayers facing a significant reduction in income at Retirement. 
              If we identify you as a Vulnerable Taxpayer, you may be eligible to apply for risk-free 
              financial assistance and expert advice.
            </p>

          </div>
          <div className="flex justify-center">
            <Link to="/freecalculator">
              <Button className="text-gray-700 px-8 py-6 text-lg flex items-center gap-2 border border-gray-700" style={{ backgroundColor: '#4FF456' }}>
                Get Started <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageBackground>
  );
};

export default Index;
