
import { Button } from "@/components/ui/button";
import React from "react";

interface FormActionsProps {
  onCancel: () => void;
  onSubmit?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

const FormActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FormActionsProps
>(({ onCancel, onSubmit, disabled = false, isLoading = false, className, ...props }, ref) => {
  const handleSubmit = () => {
    if (onSubmit && !disabled && !isLoading) {
      onSubmit();
    }
  };

  return (
    <div className="flex justify-end gap-2" ref={ref} {...props}>
      <Button 
        type="button" 
        variant="outline" 
        onClick={onCancel}
        disabled={isLoading}
      >
        Cancel
      </Button>
      <Button 
        type="button" 
        onClick={handleSubmit}
        disabled={disabled || isLoading}
        className={disabled ? "opacity-50 cursor-not-allowed" : ""}
      >
        {isLoading ? "Saving..." : "Save"}
      </Button>
    </div>
  );
});

FormActions.displayName = "FormActions";

export default FormActions;
