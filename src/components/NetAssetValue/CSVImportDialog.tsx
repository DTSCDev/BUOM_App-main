
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Asset, Liability, Category } from "@/types/NetAssetValue";
import { parseAssetsCSV, parseLiabilitiesCSV } from "@/utils/csvUtils";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Upload } from "lucide-react";

interface CSVImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  assetCategories: Category[];
  liabilityCategories: Category[];
  onImportAssets: (assets: Partial<Asset>[]) => void;
  onImportLiabilities: (liabilities: Partial<Liability>[]) => void;
}

export default function CSVImportDialog({
  isOpen,
  onClose,
  assetCategories,
  liabilityCategories,
  onImportAssets,
  onImportLiabilities,
}: CSVImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [importType, setImportType] = useState<"assets" | "liabilities">("assets");
  const [defaultCategoryId, setDefaultCategoryId] = useState<string>(
    importType === "assets" 
      ? assetCategories[0]?.id.toString() || "" 
      : liabilityCategories[0]?.id.toString() || ""
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleTypeChange = (value: string) => {
    const type = value as "assets" | "liabilities";
    setImportType(type);
    
    // Reset default category when type changes
    setDefaultCategoryId(
      type === "assets"
        ? assetCategories[0]?.id.toString() || ""
        : liabilityCategories[0]?.id.toString() || ""
    );
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await file.text();
      const categoryId = parseInt(defaultCategoryId);
      
      if (importType === "assets") {
        const parsedAssets = parseAssetsCSV(text);
        
        // Assign the default category ID to all items
        const assetsWithCategory = parsedAssets.map(asset => ({
          ...asset,
          category_id: categoryId,
        }));
        
        onImportAssets(assetsWithCategory);
        toast({
          title: "Assets imported",
          description: `${assetsWithCategory.length} assets have been imported.`,
        });
      } else {
        const parsedLiabilities = parseLiabilitiesCSV(text);
        
        // Assign the default category ID to all items
        const liabilitiesWithCategory = parsedLiabilities.map(liability => ({
          ...liability,
          category_id: categoryId,
        }));
        
        onImportLiabilities(liabilitiesWithCategory);
        toast({
          title: "Liabilities imported",
          description: `${liabilitiesWithCategory.length} liabilities have been imported.`,
        });
      }
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Import failed",
        description: error.message || "Could not parse the CSV file",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import from CSV</DialogTitle>
          <DialogDescription>
            <div className="flex items-center mt-1">
              <Badge variant="secondary" className="bg-yellow-200 text-amber-800">Premium Feature</Badge>
              <span className="ml-2 text-xs text-muted-foreground">Free for first 30 days</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="import-type">Import Type</Label>
            <Select value={importType} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select what to import" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="assets">Assets</SelectItem>
                <SelectItem value="liabilities">Liabilities</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="default-category">Default Category</Label>
            <Select value={defaultCategoryId} onValueChange={setDefaultCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a default category" />
              </SelectTrigger>
              <SelectContent>
                {importType === "assets"
                  ? assetCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))
                  : liabilityCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))
                }
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              All imported items will be assigned to this category.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="csv-file">CSV File</Label>
            <div className="flex items-center gap-2">
              <Input 
                id="csv-file" 
                type="file" 
                accept=".csv" 
                onChange={handleFileChange}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              For assets, your CSV should have columns: Name, Category, Description, Value, Is Liquid, Account Number.<br />
              For liabilities, your CSV should have columns: Name, Category, Description, Value, Interest Rate, Account Number.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!file}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
