
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { Info, Pen, Trash } from "lucide-react";

interface AssetDetailsHoverCardProps {
  description?: string | null;
  accountNumber?: string;
  isLiquid?: boolean;
  pensionType?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export function AssetDetailsHoverCard({
  description,
  accountNumber,
  isLiquid,
  pensionType,
  onEdit,
  onDelete,
  showActions = false,
}: AssetDetailsHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button 
          size="sm" 
          variant="ghost" 
          className="p-1 h-auto"
        >
          <Info className="h-4 w-4" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-1">
          {description && (
            <p className="text-sm">{description}</p>
          )}
          {accountNumber && accountNumber.trim() !== '' && (
            <p className="text-sm">Reference: {accountNumber}</p>
          )}
          {isLiquid !== undefined && (
            <p className="text-sm">Liquidity: {isLiquid ? 'Liquid' : 'Non-liquid'}</p>
          )}
          {pensionType && pensionType.trim() !== '' && (
            <p className="text-sm">Pension Type: {pensionType}</p>
          )}
          
          {showActions && (
            <div className="flex justify-end gap-2 mt-2 pt-2 border-t">
              {onEdit && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  <Pen className="h-3.5 w-3.5 mr-1" />
                  Edit
                </Button>
              )}
              {onDelete && (
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  <Trash className="h-3.5 w-3.5 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
