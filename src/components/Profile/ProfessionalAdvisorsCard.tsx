
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useProfessionalAdvisors } from "@/hooks/useProfessionalAdvisors";
import type { ProfessionalAdvisorInput } from "@/hooks/useProfessionalAdvisors";
import { ActionWarning } from "@/components/ui/action-warning";
import { ProfessionalAdvisorForm } from "./ProfessionalAdvisorForm";
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

  const handleFormSubmit = async (advisorData: ProfessionalAdvisorInput) => {
    const success = await addAdvisor(advisorData);
    if (success) {
      setIsFormOpen(false);
    }
    return success;
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
      <CardHeader className="flex flex-row items-center justify-between bg-[#4FF456] text-gray-700 font-bold rounded-t-lg">
        <div className="flex items-center gap-2">
          <CardTitle className="text-lg">Professional Advisors</CardTitle>
          <ActionWarning message="Add Advisor" show={isIncomplete} />
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="ghost">
              <Eye className="h-4 w-4 mr-2" /> View
            </Button>
          </DialogTrigger>
          {/* Show advisors management inside modal using existing form component */}
          <ProfessionalAdvisorForm
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleFormSubmit}
          />
        </Dialog>
      </CardHeader>
      <CardContent className="py-3">
        <p className="text-gray-700">View and manage your professional advisors.</p>
      </CardContent>
    </Card>
  );
}
