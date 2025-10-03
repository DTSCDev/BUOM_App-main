
import React from "react";
import { Liability, Category } from "@/types/NetAssetValue";
import { useLiabilitySuggestions } from "@/hooks/useLiabilitySuggestions";
import LiabilityItem from "./LiabilityItem";
import { CategoryHeader } from "./CategoryHeader";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface LiabilityCategoryProps {
  category: Category;
  liabilities: Liability[];
  onEdit: (liability: Liability) => void;
  onDelete: (liabilityId: string) => void;
  formatCurrency: (amount: number) => string;
  onAddNew?: () => void; // New prop to handle direct add
}

export default function LiabilityCategory({ 
  category, 
  liabilities, 
  onEdit, 
  onDelete, 
  formatCurrency,
  onAddNew
}: LiabilityCategoryProps) {
  // Only show categories we want
  if (category.name !== 'Loans' && category.name !== 'Other Debts') {
    return null;
  }

  const { displayItems, createSuggestionLiability } = useLiabilitySuggestions(category, liabilities);

  // Helper function to handle adding a suggested liability
  function handleAddSuggestion(item: any) {
    const newLiability = createSuggestionLiability(item);
    
    // Create a proper liability object for the edit form without a problematic temp ID
    const tempLiability = {
      ...newLiability,
      id: "",  // Empty ID to indicate it's new
      member_id: "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_imported: false
    } as Liability;
    
    onEdit(tempLiability);
  }

  return (
    <div className="mb-8">
      <CategoryHeader category={category} />
      
      {displayItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {displayItems.map((item) => (
            <LiabilityItem
              key={item.id}
              item={{
                ...item,
                isReal: Boolean(item.isReal) // Ensure isReal is explicitly a boolean
              }}
              onEdit={onEdit}
              onDelete={onDelete}
              liabilities={liabilities}
              formatCurrency={formatCurrency}
              handleAddSuggestion={handleAddSuggestion}
            />
          ))}
        </div>
      ) : (
        <div className="p-6 border border-dashed rounded-lg text-center">
          <p className="text-muted-foreground mb-3">No {category.name} added yet</p>
          <Button 
            variant="outline" 
            onClick={onAddNew || (() => {})}
            className="mx-auto"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add {category.name}
          </Button>
        </div>
      )}
    </div>
  );
}
