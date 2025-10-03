
import { ProfessionalAdvisor } from "@/hooks/useProfessionalAdvisors";
import { AdvisorListItem } from "./AdvisorListItem";

interface AdvisorsListProps {
  advisors: ProfessionalAdvisor[];
  onEdit: (advisor: ProfessionalAdvisor) => void;
  onDelete: (id: string) => void;
  onInvite: (advisorId: string, email: string) => void;
}

export function AdvisorsList({ 
  advisors, 
  onEdit, 
  onDelete, 
  onInvite 
}: AdvisorsListProps) {
  return (
    <div className="space-y-2">
      {advisors.map((advisor) => (
        <AdvisorListItem
          key={advisor.id}
          advisor={advisor}
          onEdit={onEdit}
          onDelete={onDelete}
          onInvite={onInvite}
        />
      ))}
    </div>
  );
}
