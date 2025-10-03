
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/utils/formatUtils";

interface ApplyForFundingOverrideProps {
  title: string;
  backgroundColor: string;
  buttonColor: string;
  hoverColor: string;
}

export function ApplyForFundingOverride({ 
  title, 
  backgroundColor, 
  buttonColor, 
  hoverColor 
}: ApplyForFundingOverrideProps) {
  return (
    <Card className="h-full border-l-4 border-l-gray-300">
      <CardHeader className={`${backgroundColor} min-h-[80px] flex flex-col justify-center text-center rounded-t-lg`}>
        <CardTitle className="text-xl font-bold text-white">
          {title}
        </CardTitle>
        <Button 
          asChild 
          className={`${buttonColor} ${hoverColor} text-black mt-2 w-fit px-4 py-2 mx-auto`}
        >
          <Link to="/apf-registration">
            Apply for Funding
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {/* Template structure with £0 values */}
        {backgroundColor.includes('yellow') ? (
          // APF Template - matching INBL layout structure
          <>
            {/* 50% area with 4 horizontal lines */}
            <div className="h-32">
              {/* Line 1: Sponsorship Year */}
              <div className="bg-yellow-600 h-8 flex items-center justify-center px-4">
                <p className="text-white text-sm font-medium">No Active Sponsorship</p>
              </div>
              
              {/* Line 2: APF Asset Value Label */}
              <div className="bg-yellow-600 h-8 flex items-center justify-center px-4 relative">
                <p className="text-white text-2xl font-bold">APF ASSET VALUE</p>
                <span className="absolute bottom-1 right-1 text-white text-[8px] opacity-40 font-mono border border-gray-400 px-1 py-0.5 rounded">
                  078
                </span>
              </div>
              
              {/* Lines 3&4 merged: Value display */}
              <div className="bg-white h-16 flex items-center justify-center">
                <p className="text-yellow-600 text-2xl font-bold">
                  {formatCurrency(0)}
                </p>
              </div>
            </div>

            {/* 25% sections - following INBL pattern */}
            <div className="grid grid-cols-2 h-24">
              {/* 25% section 1: Maturity Value */}
              <div className="border-r border-b relative">
                <div className="bg-white h-6 flex items-center justify-center">
                  <p className="text-gray-600 text-xs font-medium">Maturity Value</p>
                  <span className="absolute bottom-1 right-1 text-gray-500 text-[8px] font-mono border border-gray-300 px-1 py-0.5 rounded opacity-60">
                    079
                  </span>
                </div>
                <div className="bg-white h-6 flex items-center justify-center">
                  <p className="text-yellow-600 text-sm font-semibold">
                    {formatCurrency(0)}
                  </p>
                </div>
              </div>

              {/* 25% section 2: Deferred Fees */}
              <div className="border-b relative">
                <div className="bg-white h-6 flex items-center justify-center">
                  <p className="text-gray-600 text-xs font-medium">Deferred Fees</p>
                  <span className="absolute bottom-1 right-1 text-gray-500 text-[8px] font-mono border border-gray-300 px-1 py-0.5 rounded opacity-60">
                    080
                  </span>
                </div>
                <div className="bg-white h-6 flex items-center justify-center">
                  <p className="text-yellow-600 text-sm font-semibold">
                    {formatCurrency(0)}
                  </p>
                </div>
              </div>

              {/* 25% sections 3&4 merged: Employer Savings */}
              <div className="col-span-2 rounded-b-lg relative">
                <div className="bg-white h-6 flex items-center justify-center">
                  <p className="text-gray-600 text-xs font-medium">Your Caring Employer has saved you</p>
                  <span className="absolute bottom-1 right-1 text-gray-500 text-[8px] font-mono border border-gray-300 px-1 py-0.5 rounded opacity-60">
                    081
                  </span>
                </div>
                <div className="bg-white h-6 flex items-center justify-center rounded-b-lg">
                  <p className="text-yellow-600 text-sm font-semibold">
                    {formatCurrency(0)}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          // INBL Template
          <>
            {/* 50% area with 4 horizontal lines */}
            <div className="h-32">
              {/* Line 1: Sponsorship Year */}
              <div className="bg-green-600 h-8 flex items-center justify-center px-4">
                <p className="text-white text-sm font-medium">No Active Sponsorship</p>
              </div>
              
              {/* Line 2: INBL Loan Value Label */}
              <div className="bg-green-600 h-8 flex items-center justify-center px-4 relative">
                <p className="text-white text-2xl font-bold">INBL LOAN VALUE</p>
                <span className="absolute bottom-1 right-1 text-white text-[8px] opacity-40 font-mono border border-gray-400 px-1 py-0.5 rounded">
                  082
                </span>
              </div>
              
              {/* Lines 3&4 merged: Value display */}
              <div className="bg-white h-16 flex items-center justify-center">
                <p className="text-green-600 text-2xl font-bold">
                  {formatCurrency(0)}
                </p>
              </div>
            </div>

            {/* 25% sections - 4 separate sections for INBL */}
            <div className="grid grid-cols-2 h-24">
              {/* 25% section 1: NPG Loan */}
              <div className="border-r border-b relative">
                <div className="bg-white h-6 flex items-center justify-center">
                  <p className="text-gray-600 text-xs font-medium">NPG Loan</p>
                  <span className="absolute bottom-1 right-1 text-gray-500 text-[8px] font-mono border border-gray-300 px-1 py-0.5 rounded opacity-60">
                    083
                  </span>
                </div>
                <div className="bg-white h-6 flex items-center justify-center">
                  <p className="text-green-600 text-sm font-semibold">
                    {formatCurrency(0)}
                  </p>
                </div>
              </div>

              {/* 25% section 2: ZVaR Loan */}
              <div className="border-b relative">
                <div className="bg-white h-6 flex items-center justify-center">
                  <p className="text-gray-600 text-xs font-medium">ZVaR Loan</p>
                  <span className="absolute bottom-1 right-1 text-gray-500 text-[8px] font-mono border border-gray-300 px-1 py-0.5 rounded opacity-60">
                    084
                  </span>
                </div>
                <div className="bg-white h-6 flex items-center justify-center">
                  <p className="text-green-600 text-sm font-semibold">
                    {formatCurrency(0)}
                  </p>
                </div>
              </div>

              {/* 25% section 3: Funds Released */}
              <div className="border-r rounded-bl-lg relative">
                <div className="bg-white h-6 flex items-center justify-center">
                  <p className="text-gray-600 text-xs font-medium">Funds Released</p>
                  <span className="absolute bottom-1 right-1 text-gray-500 text-[8px] font-mono border border-gray-300 px-1 py-0.5 rounded opacity-60">
                    085
                  </span>
                </div>
                <div className="bg-white h-6 flex items-center justify-center rounded-bl-lg">
                  <p className="text-green-600 text-sm font-semibold">
                    {formatCurrency(0)}
                  </p>
                </div>
              </div>

              {/* 25% section 4: Funds Remaining */}
              <div className="rounded-br-lg relative">
                <div className="bg-white h-6 flex items-center justify-center">
                  <p className="text-gray-600 text-xs font-medium">Funds Remaining</p>
                  <span className="absolute bottom-1 right-1 text-gray-500 text-[8px] font-mono border border-gray-300 px-1 py-0.5 rounded opacity-60">
                    086
                  </span>
                </div>
                <div className="bg-white h-6 flex items-center justify-center rounded-br-lg">
                  <p className="text-green-600 text-sm font-semibold">
                    {formatCurrency(0)}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
