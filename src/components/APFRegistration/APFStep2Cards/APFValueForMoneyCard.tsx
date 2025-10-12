
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatUtils";
import { MetricCard } from "@/components/Dashboard/MetricCard";

interface APFValueForMoneyCardProps {
  isaContributions: number;
  maturityValue: number;
  showMonthly?: boolean;
}

export function APFValueForMoneyCard({ isaContributions, maturityValue, showMonthly = false }: APFValueForMoneyCardProps) {
  const returnOnCapital = isaContributions > 0 ? ((maturityValue / isaContributions) * 100) : 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <span>Value for Money</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="TOTAL ISA CONTRIBUTIONS"
            value={formatCurrency(isaContributions)}
            headerBgColor="bg-blue-600"
            valueTextColor="text-blue-600"
            sfmCode="SFM-APF-1260"
          />
          
          <MetricCard
            title="MATURITY VALUE"
            value={formatCurrency(maturityValue)}
            headerBgColor="bg-yellow-600"
            valueTextColor="text-yellow-600"
            sfmCode="SFM-APF-1261"
          />
          
          <MetricCard
            title="RETURN ON CAPITAL"
            value={`${Math.round(returnOnCapital)}%`}
            headerBgColor="bg-green-600"
            valueTextColor="text-green-600"
            style={{ backgroundColor: '#4FF546' }}
            sfmCode="SFM-APF-1262"
          />
        </div>
      </CardContent>
    </Card>
  );
}
