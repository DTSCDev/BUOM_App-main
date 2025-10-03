
import React from "react";
import { Card } from "@/components/ui/card";
import { Liability } from "@/types/NetAssetValue";
import { LiabilityDetailsHoverCard } from "./LiabilityDetailsHoverCard";

interface LiabilityItemProps {
  item: {
    id: string;
    name: string;
    value: number;
    description?: string | null;
    account_number?: string;
    interest_rate?: number | null;
    isReal: boolean;  // This is crucial for the delete button
  };
  onEdit: (liability: Liability) => void;
  onDelete: (liabilityId: string) => void;
  liabilities: Liability[];
  formatCurrency: (amount: number) => string;
  handleAddSuggestion: (item: any) => void;
}

export default function LiabilityItem({ 
  item, 
  onEdit,
  onDelete,
  liabilities, 
  formatCurrency,
  handleAddSuggestion
}: LiabilityItemProps) {
  // Handler for edit - different behavior for real vs suggested items
  const handleEdit = () => {
    if (item.isReal) {
      const realLiability = liabilities.find(l => l.id === item.id);
      if (realLiability) {
        onEdit(realLiability);
      }
    } else {
      handleAddSuggestion(item);
    }
  };
  
  // Handler for delete - only provided when item is real
  const handleDelete = () => {
    if (item.id) {
      onDelete(item.id);
    }
  };

  // Format the value without decimal places
  const formattedValue = formatCurrency(item.value).replace('.00', '');
  
  return (
    <Card className="overflow-hidden border border-primary">
      <div className="p-3 min-h-[5rem] relative flex flex-col justify-center">
        <div className="absolute top-2 right-2">
          <LiabilityDetailsHoverCard 
            description={item.description} 
            accountNumber={item.account_number}
            interestRate={item.interest_rate}
            onEdit={handleEdit}
            onDelete={item.isReal ? handleDelete : undefined}
            showActions={true}
          />
        </div>
        <div className="text-center">
          <h3 className="font-medium text-md">{item.name}</h3>
          <p className="text-xl font-bold mt-1">{formattedValue}</p>
        </div>
      </div>
    </Card>
  );
}
