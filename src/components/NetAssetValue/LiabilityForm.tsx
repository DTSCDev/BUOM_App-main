
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Liability, Category } from "@/types/NetAssetValue";
import { Badge } from "@/components/ui/badge";
import { useLiabilityForm } from "@/hooks/useLiabilityForm";
import CategorySelector from "./CategorySelector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface LiabilityFormProps {
  liability: Liability | null;
  categories: Category[];
  onSave: (liability: Partial<Liability>) => void;
  onCancel: () => void;
  onDelete?: (liabilityId: string) => void;
}

export default function LiabilityForm({ 
  liability, 
  categories, 
  onSave, 
  onCancel, 
  onDelete 
}: LiabilityFormProps) {
  const {
    formData,
    handleChange,
    handleNumberChange,
    handleInterestRateChange,
    handleCategoryChange,
    handleSubmit,
    filteredCategories
  } = useLiabilityForm(liability, categories, onSave);

  const handleDelete = () => {
    if (liability && liability.id && onDelete) {
      onDelete(liability.id);
      onCancel();
    }
  };

  const showDeleteButton = liability && liability.id && onDelete;

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>{liability && liability.id ? "Edit Liability" : "Add New Liability"}</DialogTitle>
          <DialogDescription>
            <div className="flex items-center mt-1">
              <Badge variant="secondary" className="bg-yellow-200 text-amber-800">Premium Feature</Badge>
              <span className="ml-2 text-xs text-muted-foreground">Free for first 30 days</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="pr-4 max-h-[60vh]">
          <form id="asset-liability-form" onSubmit={handleSubmit} className="space-y-4">
            <CategorySelector 
              categories={filteredCategories} 
              value={formData.category_id} 
              onChange={handleCategoryChange} 
            />

            <div className="space-y-2">
              <Label htmlFor="name">Liability Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_number">Account Number / Reference</Label>
              <Input
                id="account_number"
                name="account_number"
                value={formData.account_number || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Value (£)</Label>
              <Input
                id="value"
                name="value"
                type="number"
                step="1"
                min="0"
                value={formData.value}
                onChange={handleNumberChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest_rate">Interest Rate (% - Optional)</Label>
              <Input
                id="interest_rate"
                name="interest_rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={formData.interest_rate !== null ? formData.interest_rate : ''}
                onChange={handleInterestRateChange}
                placeholder="e.g. 4.5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
              />
            </div>
          </form>
        </ScrollArea>
        <DialogFooter className="flex justify-between items-center">
          {showDeleteButton && (
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              className="mr-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <div>
            <Button type="button" variant="outline" onClick={onCancel} className="mr-2">
              Cancel
            </Button>
            <Button type="submit" form="asset-liability-form">Save</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
