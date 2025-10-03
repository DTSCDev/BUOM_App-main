
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useProfessionalAdvisors } from "@/hooks/useProfessionalAdvisors";
import { ActionWarning } from "@/components/ui/action-warning";
import { ProfessionalAdvisorForm } from "./ProfessionalAdvisorForm";
import { AdvisorsList } from "./ProfessionalAdvisors/AdvisorsList";
import { EmptyAdvisorsState } from "./ProfessionalAdvisors/EmptyAdvisorsState";
import { AdvisorsLoadingState } from "./ProfessionalAdvisors/AdvisorsLoadingState";

export function ProfessionalAdvisorsCard() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const {
    advisors,
    isLoading,
    addAdvisor,
    updateAdvisor,
    deleteAdvisor,
    sendInvitation
  } = useProfessionalAdvisors();

  const handleFormSubmit = async (advisorData: any) => {
    const success = await addAdvisor(advisorData);
    if (success) {
      setIsFormOpen(false);
    }
    return success;
  };

  const handleEdit = (advisor: any) => {
    // Implementation for editing advisor
    console.log('Edit advisor:', advisor);
  };

  const handleDelete = (advisorId: string) => {
    return deleteAdvisor(advisorId);
  };

  const handleInvite = async (advisorId: string) => {
    const advisor = advisors.find(a => a.id === advisorId);
    if (advisor) {
      await sendInvitation(advisorId, advisor.email);
    }
  };

  // Check if no advisors have been added
  const isIncomplete = !advisors || advisors.length === 0;

  if (isLoading) {
    return <AdvisorsLoadingState />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg font-semibold text-[#030227]">Professional Advisors</CardTitle>
          <ActionWarning message="Add Advisor" show={isIncomplete} />
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost">
              <Plus className="h-4 w-4 mr-2" /> Add Advisor
            </Button>
          </DialogTrigger>
          <ProfessionalAdvisorForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
          />
        </Dialog>
      </CardHeader>
      <CardContent className="py-6">
        {advisors && advisors.length > 0 ? (
          <AdvisorsList
            advisors={advisors}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onInvite={handleInvite}
          />
        ) : (
          <EmptyAdvisorsState />
        )}
      </CardContent>
    </Card>
  );
}
