
import { LegacyPlanningItem, LEGACY_PLANNING_TYPES } from "@/hooks/useLegacyPlanning/types";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/utils/formatUtils";

interface LegacyItemsListProps {
  items: LegacyPlanningItem[];
  onEdit: (item: LegacyPlanningItem) => void;
  onDelete: (id: string) => void;
}

export function LegacyItemsList({ items, onEdit, onDelete }: LegacyItemsListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="p-4 border rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {item.planning_type === 'will_not_arranged' && (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              )}
              <h4 className="font-medium">
                {LEGACY_PLANNING_TYPES[item.planning_type]}
              </h4>
            </div>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit(item)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              {item.planning_type !== 'will_not_arranged' && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              )}
            </div>
          </div>

          {item.planning_type === 'will_not_arranged' ? (
            <p className="text-sm text-amber-600">
              You haven't arranged your will yet. Consider taking action to protect your loved ones.
            </p>
          ) : (
            <div className="space-y-1 text-sm text-muted-foreground">
              {item.provider_name && (
                <div>
                  <span className="font-medium">Provider:</span> {item.provider_name}
                </div>
              )}
              {item.provider_contact && (
                <div>
                  <span className="font-medium">Contact:</span> {item.provider_contact}
                </div>
              )}
              {item.document_date && (
                <div>
                  <span className="font-medium">Document Date:</span> {new Date(item.document_date).toLocaleDateString()}
                </div>
              )}
              {item.review_date && (
                <div>
                  <span className="font-medium">Review Date:</span> {new Date(item.review_date).toLocaleDateString()}
                </div>
              )}
              {item.notes && (
                <div>
                  <span className="font-medium">Notes:</span> {item.notes}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
