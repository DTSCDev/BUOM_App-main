
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type BulkCalculationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const BulkCalculationDialog: React.FC<BulkCalculationDialogProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  const handleNoThanks = () => {
    onOpenChange(false);
    navigate('/Retirement_Calculator');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bulk Calculation Available</AlertDialogTitle>
          <AlertDialogDescription>
            This calculator is for individual calculations. As you have indicated you are not an Employee, 
            would you like to run a bulk calculation?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleNoThanks}>No thanks</AlertDialogCancel>
          <AlertDialogAction onClick={() => window.location.href = "https://buom.ai/signup"}>
            Yes please
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BulkCalculationDialog;
