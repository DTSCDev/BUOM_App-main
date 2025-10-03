
import { useState, useEffect } from "react";
import { Liability, Category } from "@/types/NetAssetValue";

export function useLiabilityForm(liability: Liability | null, categories: Category[], onSave: (liability: Partial<Liability>) => void) {
  // Filter categories to only include "Loans" and "Other Debts"
  const filteredCategories = categories.filter(
    category => category.name === 'Loans' || category.name === 'Other Debts'
  );

  // Set default category to the first filtered category or fallback to the first category if none match
  const defaultCategoryId = filteredCategories.length > 0 
    ? filteredCategories[0].id 
    : (categories.length > 0 ? categories[0].id : undefined);

  const [formData, setFormData] = useState<Partial<Liability>>({
    category_id: liability?.category_id || defaultCategoryId,
    name: liability?.name || "",
    description: liability?.description || "",
    account_number: liability?.account_number || "",
    value: liability?.value || 0,
    interest_rate: liability?.interest_rate || null,
  });

  // Reset form data when liability changes
  useEffect(() => {
    if (liability) {
      setFormData({
        category_id: liability.category_id,
        name: liability.name,
        description: liability.description || "",
        account_number: liability.account_number || "",
        value: liability.value,
        interest_rate: liability.interest_rate || null,
      });
    }
  }, [liability]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: parseFloat(value) || 0 });
  };

  const handleInterestRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : null;
    setFormData({ ...formData, interest_rate: value });
  };

  const handleCategoryChange = (value: string) => {
    const categoryId = parseInt(value);
    setFormData({ ...formData, category_id: categoryId });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return {
    formData,
    handleChange,
    handleNumberChange,
    handleInterestRateChange,
    handleCategoryChange,
    handleSubmit,
    filteredCategories
  };
}
