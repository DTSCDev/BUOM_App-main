
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LegacyPlanningItem, LegacyPlanningInput, LEGACY_PLANNING_TYPES } from "@/hooks/useLegacyPlanning/types";

interface LegacyPlanningFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LegacyPlanningInput) => Promise<boolean>;
  item?: LegacyPlanningItem | null;
}

export function LegacyPlanningForm({ isOpen, onClose, onSubmit, item }: LegacyPlanningFormProps) {
  const [formData, setFormData] = useState<LegacyPlanningInput>({
    planning_type: 'will_not_arranged',
    provider_name: '',
    provider_contact: '',
    document_date: '',
    review_date: '',
    notes: '',
  });

  useEffect(() => {
    if (item) {
      setFormData({
        planning_type: item.planning_type,
        provider_name: item.provider_name || '',
        provider_contact: item.provider_contact || '',
        document_date: item.document_date || '',
        review_date: item.review_date || '',
        notes: item.notes || '',
      });
    } else {
      setFormData({
        planning_type: 'will_not_arranged',
        provider_name: '',
        provider_contact: '',
        document_date: '',
        review_date: '',
        notes: '',
      });
    }
  }, [item, isOpen]);

  const handleChange = <K extends keyof LegacyPlanningInput>(field: K, value: LegacyPlanningInput[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      onClose();
    }
  };

  const showProviderFields = formData.planning_type !== 'will_not_arranged';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Edit Legacy Planning Item' : 'Add Legacy Planning Item'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="planning_type">Planning Type</Label>
            <Select value={formData.planning_type} onValueChange={(value) => handleChange('planning_type', value as LegacyPlanningInput['planning_type'])}>
              <SelectTrigger>
                <SelectValue placeholder="Select planning type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LEGACY_PLANNING_TYPES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showProviderFields && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="provider_name">Provider/Company Name</Label>
                  <Input
                    id="provider_name"
                    value={formData.provider_name}
                    onChange={(e) => handleChange('provider_name', e.target.value)}
                    placeholder="Enter provider name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider_contact">Provider Contact</Label>
                  <Input
                    id="provider_contact"
                    value={formData.provider_contact}
                    onChange={(e) => handleChange('provider_contact', e.target.value)}
                    placeholder="Phone/email"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="document_date">Document Date</Label>
                  <Input
                    id="document_date"
                    type="date"
                    value={formData.document_date}
                    onChange={(e) => handleChange('document_date', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="review_date">Review Date</Label>
                  <Input
                    id="review_date"
                    type="date"
                    value={formData.review_date}
                    onChange={(e) => handleChange('review_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Additional notes or details"
                  rows={3}
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {item ? 'Update' : 'Add'} Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
