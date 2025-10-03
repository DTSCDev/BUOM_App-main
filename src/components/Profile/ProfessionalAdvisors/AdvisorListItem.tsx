
import { ProfessionalAdvisor } from "@/hooks/useProfessionalAdvisors";
import { AdvisorDetailsPopover } from "../AdvisorDetailsPopover";

interface AdvisorListItemProps {
  advisor: ProfessionalAdvisor;
  onEdit: (advisor: ProfessionalAdvisor) => void;
  onDelete: (id: string) => void;
  onInvite: (advisorId: string, email: string) => void;
}

export function AdvisorListItem({ 
  advisor, 
  onEdit, 
  onDelete, 
  onInvite 
}: AdvisorListItemProps) {
  const handleInvite = (email: string) => {
    onInvite(advisor.id, email);
  };

  return (
    <AdvisorDetailsPopover
      advisor={advisor}
      onEdit={onEdit}
      onDelete={onDelete}
      onInvite={handleInvite}
    >
      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {advisor.first_name[0]}
            </span>
          </div>
          <div>
            <div className="font-medium">
              {advisor.first_name} - {advisor.sector}
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          Click for details
        </div>
      </div>
    </AdvisorDetailsPopover>
  );
}
