
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Building, Award, Edit, Trash2, Shield, Clock, CheckCircle, MapPin } from "lucide-react";
import { ProfessionalAdvisor } from "@/hooks/useProfessionalAdvisors";

interface AdvisorDetailsPopoverProps {
  advisor: ProfessionalAdvisor;
  onEdit: (advisor: ProfessionalAdvisor) => void;
  onDelete: (id: string) => void;
  onInvite: (email: string) => void;
  children: React.ReactNode;
}

export function AdvisorDetailsPopover({ 
  advisor, 
  onEdit, 
  onDelete, 
  onInvite, 
  children 
}: AdvisorDetailsPopoverProps) {
  const getVerificationStatusColor = (status: string | null) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubscriptionStatusColor = (status: string | null) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'invited': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-96" align="start">
        <div className="space-y-4">
          <div className="border-b pb-3">
            <h4 className="font-semibold text-lg">
              {advisor.first_name} {advisor.last_name}
            </h4>
            <p className="text-sm text-muted-foreground">{advisor.sector}</p>
            
            {/* Status Badges */}
            <div className="flex gap-2 mt-2">
              <Badge className={getVerificationStatusColor(advisor.verification_status)}>
                <Shield className="h-3 w-3 mr-1" />
                {advisor.verification_status || 'pending'}
              </Badge>
              <Badge className={getSubscriptionStatusColor(advisor.subscription_status)}>
                {advisor.subscription_status || 'invited'}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            {advisor.company_name && (
              <div className="flex items-center gap-2 text-sm">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span>{advisor.company_name}</span>
              </div>
            )}

            {advisor.company_address && (
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span className="leading-relaxed">{advisor.company_address}</span>
              </div>
            )}
            
            {/* Professional Body Information */}
            {advisor.professional_body_name && (
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-blue-600">{advisor.professional_body_name}</span>
              </div>
            )}

            {/* Regulatory Numbers */}
            {(advisor.fca_number || advisor.sra_number || advisor.professional_body_number) && (
              <div className="space-y-1">
                {advisor.fca_number && (
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>FCA: {advisor.fca_number}</span>
                  </div>
                )}
                {advisor.sra_number && (
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>SRA: {advisor.sra_number}</span>
                  </div>
                )}
                {advisor.professional_body_number && (
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span>Membership: {advisor.professional_body_number}</span>
                  </div>
                )}
              </div>
            )}

            {advisor.membership_body && (
              <div className="flex items-center gap-2 text-sm">
                <Award className="h-4 w-4 text-muted-foreground" />
                <span className="text-blue-600">{advisor.membership_body}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{advisor.email}</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{advisor.contact_number}</span>
            </div>

            {/* Contact Attempts */}
            {advisor.contact_attempts_count && advisor.contact_attempts_count > 0 && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Contact attempts: {advisor.contact_attempts_count}</span>
              </div>
            )}

            {/* Practice Review Status */}
            {advisor.practice_review_completed && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Practice review completed</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-3 border-t">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onInvite(advisor.email)}
              className="flex-1"
            >
              <Mail className="h-4 w-4 mr-1" />
              Invite
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(advisor)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(advisor.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
