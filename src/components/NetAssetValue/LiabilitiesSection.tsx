
import { useState } from "react";
import { ActionWarning } from "@/components/ui/action-warning";
import LiabilityCategory from "./LiabilityCategory";
import LiabilityForm from "./LiabilityForm";
import CSVImportDialog from "./CSVImportDialog";
import { PageHeader } from "./PageHeader";
import { Liability, Category } from "@/types/NetAssetValue";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface LiabilitiesSectionProps {
  liabilities: Liability[];
  categories: Category[];
  showLiabilityForm: boolean;
  editingLiability: Liability | null;
  onAddLiability: () => void;
  onEditLiability: (liability: Liability) => void;
  onLiabilitySave: (liabilityData: Liability) => Promise<void>;
  onDeleteLiability: (liabilityId: string) => Promise<void>;
  onSetShowLiabilityForm: (show: boolean) => void;
  onRefreshData: () => Promise<void>;
}

export function LiabilitiesSection({
  liabilities,
  categories,
  showLiabilityForm,
  editingLiability,
  onAddLiability,
  onEditLiability,
  onLiabilitySave,
  onDeleteLiability,
  onSetShowLiabilityForm,
  onRefreshData
}: LiabilitiesSectionProps) {
  const [showCSVImport, setShowCSVImport] = useState(false);

  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.value, 0);
  const liabilitiesCount = liabilities.length;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Check if no liabilities added (most people have some debts/mortgage)
  const isIncomplete = liabilitiesCount === 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-[#030227]">Liabilities</h2>
            <ActionWarning message="Add Liabilities" show={isIncomplete} />
          </div>
          <div className="space-y-1">
            <p className="text-muted-foreground">Track your debts and financial obligations</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={onAddLiability}>
            <Plus className="mr-2 h-4 w-4" /> Add Liability
          </Button>
          <Button variant="outline" onClick={() => setShowCSVImport(true)}>
            Import CSV
          </Button>
          <Button variant="outline" onClick={onRefreshData}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {categories.map((category) => {
          const categoryLiabilities = liabilities.filter(
            (liability) => liability.category_id === category.id
          );
          
          return (
            <LiabilityCategory
              key={category.id}
              category={category}
              liabilities={categoryLiabilities}
              onEdit={onEditLiability}
              onDelete={onDeleteLiability}
              formatCurrency={formatCurrency}
              onAddNew={onAddLiability}
            />
          );
        })}
      </div>

      {showLiabilityForm && (
        <LiabilityForm
          categories={categories}
          liability={editingLiability}
          onSave={onLiabilitySave}
          onCancel={() => onSetShowLiabilityForm(false)}
        />
      )}

      {showCSVImport && (
        <CSVImportDialog
          isOpen={showCSVImport}
          onClose={() => setShowCSVImport(false)}
          assetCategories={[]}
          liabilityCategories={categories}
          onImportAssets={() => {}}
          onImportLiabilities={async (liabilities) => {
            for (const liability of liabilities) {
              await onLiabilitySave({
                id: liability.id || crypto.randomUUID(),
                name: liability.name,
                value: liability.value,
                category_id: liability.category_id,
                description: liability.description || '',
                created_at: liability.created_at || new Date().toISOString(),
                updated_at: liability.updated_at || new Date().toISOString(),
                member_id: liability.member_id || '',
                is_imported: liability.is_imported || true,
                interest_rate: liability.interest_rate || 0
              });
            }
            await onRefreshData();
          }}
        />
      )}
    </div>
  );
}
