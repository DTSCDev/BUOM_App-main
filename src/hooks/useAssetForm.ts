
import { useState, useEffect, useCallback } from "react";
import { Asset, Category } from "@/types/NetAssetValue";
import { toast } from "@/hooks/use-toast";

export function useAssetForm(asset: Asset | null, categories: Category[], onSave: (asset: Partial<Asset>) => void) {
  // Initialize form data only once
  const [formData, setFormData] = useState<Partial<Asset>>(() => {
    if (asset) {
      return {
        category_id: asset.category_id,
        name: asset.name,
        description: asset.description || "",
        value: asset.value,
        is_liquid: asset.is_liquid || false,
      };
    }
    
    return {
      category_id: categories[0]?.id || 1,
      name: "",
      description: "",
      value: 0,
      is_liquid: false,
    };
  });

  // Store value as string during editing to prevent cursor issues
  const [valueInput, setValueInput] = useState<string>(
    asset?.value ? String(asset.value) : ""
  );

  const [isPensionCategory, setIsPensionCategory] = useState<boolean>(false);
  const [hasUserInput, setHasUserInput] = useState<boolean>(false);

  // Reset form data when asset changes, but protect against unnecessary resets
  useEffect(() => {
    if (categories.length > 0) {
      if (asset) {
        // Editing an asset - always reset to asset data
        const currentValue = typeof asset.value === 'number' ? asset.value : parseFloat(String(asset.value)) || 0;
        
        setFormData({
          category_id: asset.category_id,
          name: asset.name,
          description: asset.description || "",
          value: currentValue,
          is_liquid: asset.is_liquid || false,
        });
        setValueInput(String(currentValue));
        setHasUserInput(false);
      } else if (!hasUserInput) {
        // New asset form and no user input yet - set defaults
        const defaultData = {
          category_id: categories[0]?.id || 1,
          name: "",
          description: "",
          value: 0,
          is_liquid: false,
        };
        
        setFormData(defaultData);
        setValueInput("");
      }
      // If hasUserInput is true and no asset, preserve current form data
    }
  }, [asset?.id, categories, hasUserInput]);

  // Check if current category is pension
  useEffect(() => {
    const selectedCategory = categories.find(c => c.id === formData.category_id);
    const isPension = selectedCategory?.name === 'Pensions';
    setIsPensionCategory(isPension);
  }, [formData.category_id, categories]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHasUserInput(true);
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleValueChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHasUserInput(true);
    setValueInput(value);
    
    // Parse the value and update formData
    const numericValue = parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
    setFormData(prev => ({ ...prev, value: numericValue }));
  }, []);

  const handleSwitchChange = useCallback((checked: boolean) => {
    setHasUserInput(true);
    setFormData(prev => ({ ...prev, is_liquid: checked }));
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    const categoryId = parseInt(value);
    setHasUserInput(true);
    setFormData(prev => ({ ...prev, category_id: categoryId }));
  }, []);

  const handlePensionTypeChange = useCallback((value: string) => {
    setHasUserInput(true);
    setFormData(prev => ({ 
      ...prev, 
      description: `Pension Type: ${value}${prev.description ? ' - ' + prev.description : ''}` 
    }));
  }, []);

  const handleProviderChange = useCallback((providerName: string) => {
    setHasUserInput(true);
    setFormData(prev => ({
      ...prev,
      name: providerName,
    }));
  }, []);

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    // Validation
    if (!formData.name || formData.name.trim() === "") {
      toast({
        title: "Validation Error",
        description: "Please enter a product provider name.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.value || formData.value <= 0) {
      toast({
        title: "Validation Error", 
        description: "Please enter a valid value.",
        variant: "destructive",
      });
      return;
    }

    // Save the form data
    onSave(formData);
  }, [formData, onSave]);

  return {
    formData,
    valueInput,
    isPensionCategory,
    handleChange,
    handleValueChange,
    handleSwitchChange,
    handleCategoryChange,
    handlePensionTypeChange,
    handleProviderChange,
    handleSubmit
  };
}
