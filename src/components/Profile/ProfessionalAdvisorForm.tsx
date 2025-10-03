
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ProfessionalAdvisor, ProfessionalAdvisorInput } from "@/hooks/useProfessionalAdvisors";

const PROFESSIONAL_SECTORS = [
  "IFA / Wealth Manager",
  "Accountant / Payroll",
  "Tax Software Provider", 
  "Legal Advisor",
  "Power of Attorney / Trustees",
  "Emergency Contact"
];

const PROFESSIONAL_BODIES = [
  "Financial Conduct Authority (FCA)",
  "Solicitors Regulation Authority (SRA)", 
  "Institute of Chartered Accountants in England and Wales (ICAEW)",
  "Association of Chartered Certified Accountants (ACCA)",
  "Chartered Institute for Securities & Investment (CISI)",
  "Personal Finance Society (PFS)",
  "Pensions Management Institute (PMI)",
  "Other"
];

interface ProfessionalAdvisorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProfessionalAdvisorInput) => Promise<boolean>;
  advisor?: ProfessionalAdvisor | null;
}

export function ProfessionalAdvisorForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  advisor 
}: ProfessionalAdvisorFormProps) {
  const [formData, setFormData] = useState<ProfessionalAdvisorInput>({
    first_name: advisor?.first_name || "",
    last_name: advisor?.last_name || "",
    sector: advisor?.sector || "",
    company_name: advisor?.company_name || "",
    company_address: advisor?.company_address || "",
    membership_body: advisor?.membership_body || "",
    email: advisor?.email || "",
    contact_number: advisor?.contact_number || "",
    fca_number: advisor?.fca_number || "",
    sra_number: advisor?.sra_number || "",
    professional_body_number: advisor?.professional_body_number || "",
    professional_body_name: advisor?.professional_body_name || ""
  });

  const handleChange = (field: keyof ProfessionalAdvisorInput, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      onClose();
      // Reset form if it's a new advisor
      if (!advisor) {
        setFormData({
          first_name: "",
          last_name: "",
          sector: "",
          company_name: "",
          company_address: "",
          membership_body: "",
          email: "",
          contact_number: "",
          fca_number: "",
          sra_number: "",
          professional_body_number: "",
          professional_body_name: ""
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {advisor ? "Edit Professional Advisor" : "Add Professional Advisor"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <Input 
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => handleChange("first_name", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input 
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => handleChange("last_name", e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sector">Professional Sector *</Label>
              <Select value={formData.sector} onValueChange={(value) => handleChange("sector", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select professional sector" />
                </SelectTrigger>
                <SelectContent>
                  {PROFESSIONAL_SECTORS.map((sector) => (
                    <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input 
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
                placeholder="Enter company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company_address">Company Address</Label>
              <Textarea 
                id="company_address"
                value={formData.company_address}
                onChange={(e) => handleChange("company_address", e.target.value)}
                placeholder="Enter company address"
                rows={3}
              />
            </div>
          </div>

          <Separator />

          {/* Regulatory Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Regulatory Information</h3>
            <p className="text-sm text-muted-foreground">
              Required for Consumer Duty compliance and verification purposes
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="professional_body_name">Professional Body</Label>
              <Select 
                value={formData.professional_body_name} 
                onValueChange={(value) => handleChange("professional_body_name", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select professional body" />
                </SelectTrigger>
                <SelectContent>
                  {PROFESSIONAL_BODIES.map((body) => (
                    <SelectItem key={body} value={body}>{body}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fca_number">FCA Number</Label>
                <Input 
                  id="fca_number"
                  value={formData.fca_number}
                  onChange={(e) => handleChange("fca_number", e.target.value)}
                  placeholder="e.g. 123456"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sra_number">SRA Number</Label>
                <Input 
                  id="sra_number"
                  value={formData.sra_number}
                  onChange={(e) => handleChange("sra_number", e.target.value)}
                  placeholder="e.g. 123456"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="professional_body_number">Professional Body Membership Number</Label>
              <Input 
                id="professional_body_number"
                value={formData.professional_body_number}
                onChange={(e) => handleChange("professional_body_number", e.target.value)}
                placeholder="Enter membership number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="membership_body">Additional Memberships</Label>
              <Input 
                id="membership_body"
                value={formData.membership_body}
                onChange={(e) => handleChange("membership_body", e.target.value)}
                placeholder="e.g. ACCA, CISI, PFS"
              />
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input 
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_number">Contact Number *</Label>
                <Input 
                  id="contact_number"
                  value={formData.contact_number}
                  onChange={(e) => handleChange("contact_number", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {advisor ? "Update Advisor" : "Add Advisor"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
