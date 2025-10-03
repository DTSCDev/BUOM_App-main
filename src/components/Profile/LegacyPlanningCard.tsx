
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useLegacyPlanning, LegacyPlanningItem } from "@/hooks/useLegacyPlanning";
import { LegacyPlanningForm } from "./LegacyPlanningForm";
import { ProfileData } from "@/hooks/useProfile";
import { LegacyItemsList } from "./LegacyPlanning/LegacyItemsList";
import { EmptyLegacyState } from "./LegacyPlanning/EmptyLegacyState";
import { LegacyLoadingState } from "./LegacyPlanning/LegacyLoadingState";

interface LegacyPlanningCardProps {
  profile: ProfileData | null;
  onUpdate: (updates: Partial<ProfileData>) => Promise<boolean>;
}

export function LegacyPlanningCard({ profile, onUpdate }: LegacyPlanningCardProps) {
  const { legacyItems, isLoading, addLegacyItem, updateLegacyItem, deleteLegacyItem } = useLegacyPlanning();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LegacyPlanningItem | null>(null);

  const handleAddItem = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEditItem = (item: LegacyPlanningItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    if (editingItem) {
      return await updateLegacyItem(editingItem.id, data);
    } else {
      return await addLegacyItem(data);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this legacy planning item?')) {
      await deleteLegacyItem(id);
    }
  };

  if (isLoading) {
    return <LegacyLoadingState />;
  }

  const hasWillNotArranged = legacyItems.some(item => item.planning_type === 'will_not_arranged');

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              Legacy Planning
              {hasWillNotArranged && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                  Action Required
                </span>
              )}
            </CardTitle>
          </div>
          <Button size="sm" variant="outline" onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" /> Add Item
          </Button>
        </CardHeader>
        <CardContent>
          {legacyItems.length === 0 ? (
            <EmptyLegacyState />
          ) : (
            <LegacyItemsList
              items={legacyItems}
              onEdit={handleEditItem}
              onDelete={handleDeleteItem}
            />
          )}
        </CardContent>
      </Card>

      <LegacyPlanningForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        item={editingItem}
      />
    </>
  );
}
