
import { useEffect } from "react";
import { useNetAssetValue } from "@/hooks/useNetAssetValue";
import { useAPFStep4Calculations } from "./APFStep4Components/useAPFStep4Calculations";
import { APFStep4LoadingState } from "./APFStep4Components/APFStep4LoadingState";
import { APFStep4ErrorState } from "./APFStep4Components/APFStep4ErrorState";
import { APFStep4SuccessState } from "./APFStep4Components/APFStep4SuccessState";

interface APFStep4BestUseOfMoneyProps {
  profile: {
    date_of_birth?: string;
    annual_salary?: number;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: Date;
    first_name?: string;
    last_name?: string;
    email?: string;
    mobile?: string;
  };
  dashboardData: {
    capitalShortfall?: number;
    shortfall?: number;
  };
  onComplete: (data: Record<string, unknown>) => void;
}

export function APFStep4BestUseOfMoney({ profile, dashboardData, onComplete }: APFStep4BestUseOfMoneyProps) {
  const { assets, isLoading: assetsLoading } = useNetAssetValue();
  
  const calculationResult = useAPFStep4Calculations({ profile, assets: assets || [] });
  const { unifiedResult, totalMaturityValue, totalISAContributions, hasError, errorMessage } = calculationResult;

  console.log('APFStep4 - Current state:', {
    hasError,
    errorMessage,
    totalMaturityValue,
    totalISAContributions,
    hasValidCalculations: !!unifiedResult
  });

  // Auto-complete this step immediately when calculations are ready
  useEffect(() => {
    if (!assetsLoading) {
      console.log('APFStep4 - Auto-completing step (no confirmations needed)');
      onComplete({ step4Completed: true });
    }
  }, [assetsLoading, onComplete]);

  // Show loading state while assets are loading
  if (assetsLoading) {
    console.log('APFStep4 - Showing loading state');
    return <APFStep4LoadingState />;
  }

  // Determine if we should show error state or success state
  const shouldShowErrorState = hasError && !unifiedResult;

  console.log('APFStep4 - State decision:', {
    shouldShowErrorState,
    hasError,
    hasUnifiedResult: !!unifiedResult,
    totalMaturityValue,
    totalISAContributions
  });

  if (shouldShowErrorState) {
    console.log('APFStep4 - Showing error state');
    return (
      <APFStep4ErrorState
        hasError={hasError}
        errorMessage={errorMessage}
      />
    );
  }

  // Show success state - even if calculations are partial or zero
  console.log('APFStep4 - Showing success state');
  return (
    <APFStep4SuccessState
      totalISAContributions={totalISAContributions}
      totalMaturityValue={totalMaturityValue}
    />
  );
}
