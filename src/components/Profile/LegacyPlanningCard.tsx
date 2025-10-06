
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useLegacyPlanning, LegacyPlanningItem, LegacyPlanningInput } from "@/hooks/useLegacyPlanning";
import { LegacyPlanningForm } from "./LegacyPlanningForm";
import { ProfileData } from "@/hooks/useProfile";
// Removed unused list and empty state imports
import { LegacyLoadingState } from "./LegacyPlanning/LegacyLoadingState";

interface LegacyPlanningCardProps {
  profile: ProfileData | null;
  onUpdate: (updates: Partial<ProfileData>) => Promise<boolean>;
}

export function LegacyPlanningCard({ profile: _profile, onUpdate: _onUpdate }: LegacyPlanningCardProps) {
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

  const handleFormSubmit = async (data: LegacyPlanningInput) => {
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
        <CardHeader className="flex flex-row items-center justify-between bg-[#4FF456] text-gray-700 font-bold rounded-t-lg">
          <div>
            <CardTitle className="text-lg font-semibold">Legacy Planning</CardTitle>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="ghost" className="text-gray-700">
                <Eye className="h-4 w-4 mr-2" /> View
              </Button>
            </DialogTrigger>
          </Dialog>
        </CardHeader>
        <CardContent className="py-3">
          {hasWillNotArranged ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">
                Action Required
              </span>
              <span className="text-sm text-gray-700">Add Will & Executor details</span>
            </div>
          ) : (
            <p className="text-gray-700">View and manage your legacy planning items.</p>
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
