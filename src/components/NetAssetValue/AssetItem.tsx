
import { Card } from "@/components/ui/card";
import { Asset } from "@/types/NetAssetValue";
import { AssetDetailsHoverCard } from "./AssetDetailsHoverCard";

interface AssetItemProps {
  item: {
    id: string;
    name: string;
    value: number;
    description?: string | null;
    account_number?: string;
    is_liquid?: boolean;
    pension_type?: string;
    isReal: boolean;
  };
  onEdit: (asset: Asset) => void;
  onDelete: (assetId: string) => void;
  assets: Asset[];
  formatCurrency: (amount: number) => string;
  handleAddSuggestion: (item: any) => void;
}

export default function AssetItem({ 
  item, 
  onEdit, 
  onDelete,
  assets, 
  formatCurrency,
  handleAddSuggestion
}: AssetItemProps) {
  const handleEdit = () => {
    const realAsset = assets.find(a => a.id === item.id);
    if (realAsset) {
      onEdit(realAsset);
    }
  };

  const handleAdd = () => {
    handleAddSuggestion(item);
  };
  
  const handleDelete = () => {
    if (item.isReal && item.id) {
      onDelete(item.id);
    }
  };

  // Format the value without decimal places
  const formattedValue = formatCurrency(item.value).replace('.00', '');

  return (
    <Card className="overflow-hidden border border-primary">
      <div className="p-3 min-h-[5rem] relative flex flex-col justify-center">
        <div className="absolute top-2 right-2">
          <AssetDetailsHoverCard 
            description={item.description} 
            accountNumber={item.account_number}
            isLiquid={item.is_liquid}
            pensionType={item.pension_type}
            onEdit={item.isReal ? handleEdit : handleAdd}
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
