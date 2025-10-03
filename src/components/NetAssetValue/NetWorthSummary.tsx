
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { ActionWarning } from "@/components/ui/action-warning";
import { formatCurrency } from "@/utils/formatUtils";

interface NetWorthSummaryProps {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  assetsCount: number;
  liabilitiesCount: number;
}

export function NetWorthSummary({ 
  totalAssets, 
  totalLiabilities, 
  netWorth, 
  assetsCount, 
  liabilitiesCount 
}: NetWorthSummaryProps) {
  
  // Check if net worth calculation seems incomplete or unrealistic
  const isIncomplete = assetsCount === 0 || 
                      liabilitiesCount === 0 || 
                      (netWorth < 0 && Math.abs(netWorth) > totalAssets * 2) ||
                      (totalAssets > 0 && totalAssets < 5000); // Seems unrealistically low

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
          </div>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(totalAssets)}
          </div>
          <p className="text-xs text-muted-foreground">
            {assetsCount} asset{assetsCount !== 1 ? 's' : ''}
          </p>
          <p className="text-gray-500 mt-2" style={{fontSize: '7px'}}>SFM-NAV-3500</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Liabilities</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(totalLiabilities)}
          </div>
          <p className="text-xs text-muted-foreground">
            {liabilitiesCount} liabilit{liabilitiesCount !== 1 ? 'ies' : 'y'}
          </p>
          <p className="text-gray-500 mt-2" style={{fontSize: '7px'}}>SFM-NAV-3000</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <ActionWarning message="Review Net Worth" show={isIncomplete} />
          </div>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${netWorth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(netWorth)}
          </div>
          <p className="text-xs text-muted-foreground">
            Assets - Liabilities
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Debt to Asset Ratio</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalAssets > 0 ? `${((totalLiabilities / totalAssets) * 100).toFixed(1)}%` : '0%'}
          </div>
          <p className="text-xs text-muted-foreground">
            Lower is better
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
