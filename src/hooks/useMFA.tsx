import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

interface MFAFactor {
  id: string;
  type: 'totp';
  status: 'verified' | 'unverified';
  friendly_name?: string;
  created_at: string;
}

interface MFAContextType {
  factors: MFAFactor[];
  loading: boolean;
  enrollMFA: () => Promise<{ qr_code: string; secret: string; factor_id: string } | null>;
  verifyMFA: (factorId: string, code: string) => Promise<boolean>;
  unenrollMFA: (factorId: string) => Promise<boolean>;
  challengeMFA: (factorId: string) => Promise<string | null>;
  verifyChallenge: (challengeId: string, code: string) => Promise<boolean>;
  refreshFactors: () => Promise<void>;
  isMFARequired: boolean;
  setMFARequired: (required: boolean) => void;
}

const MFAContext = createContext<MFAContextType>({
  factors: [],
  loading: true,
  enrollMFA: async () => null,
  verifyMFA: async () => false,
  unenrollMFA: async () => false,
  challengeMFA: async () => null,
  verifyChallenge: async () => false,
  refreshFactors: async () => {},
  isMFARequired: false,
  setMFARequired: () => {},
});

export const MFAProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [factors, setFactors] = useState<MFAFactor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMFARequired, setMFARequired] = useState(false);

  const refreshFactors = async () => {
    if (!user) {
      setFactors([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      
      if (error) {
        console.error('Error fetching MFA factors:', error);
        toast({
          title: "Error",
          description: "Failed to load MFA factors",
          variant: "destructive",
        });
        return;
      }

      setFactors((data?.totp || []).map(factor => ({
        ...factor,
        type: 'totp' as const
      })));
    } catch (error) {
      console.error('Error in refreshFactors:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshFactors();
  }, [user]);

  const enrollMFA = async () => {
    if (!user) return null;

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: `${user.email} - TOTP`,
      });

      if (error) {
        console.error('Error enrolling MFA:', error);
        toast({
          title: "Error",
          description: "Failed to enroll MFA",
          variant: "destructive",
        });
        return null;
      }

      await refreshFactors();
      
      return {
        qr_code: data.totp.qr_code,
        secret: data.totp.secret,
        factor_id: data.id,
      };
    } catch (error) {
      console.error('Error in enrollMFA:', error);
      toast({
        title: "Error",
        description: "Failed to enroll MFA",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const verifyMFA = async (factorId: string, code: string) => {
    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        code,
        challengeId: factorId // Using factorId as challengeId for initial verification
      });

      if (error) {
        console.error('Error verifying MFA:', error);
        toast({
          title: "Error",
          description: "Invalid verification code",
          variant: "destructive",
        });
        return false;
      }

      await refreshFactors();
      toast({
        title: "Success",
        description: "MFA has been successfully enabled",
      });
      
      return true;
    } catch (error) {
      console.error('Error in verifyMFA:', error);
      return false;
    }
  };

  const unenrollMFA = async (factorId: string) => {
    try {
      const { error } = await supabase.auth.mfa.unenroll({
        factorId,
      });

      if (error) {
        console.error('Error unenrolling MFA:', error);
        toast({
          title: "Error",
          description: "Failed to disable MFA",
          variant: "destructive",
        });
        return false;
      }

      await refreshFactors();
      toast({
        title: "Success",
        description: "MFA has been disabled",
      });
      
      return true;
    } catch (error) {
      console.error('Error in unenrollMFA:', error);
      return false;
    }
  };

  const challengeMFA = async (factorId: string) => {
    try {
      const { data, error } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (error) {
        console.error('Error creating MFA challenge:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Error in challengeMFA:', error);
      return null;
    }
  };

  const verifyChallenge = async (challengeId: string, code: string) => {
    try {
      const { data, error } = await supabase.auth.mfa.verify({
        factorId: challengeId, // Use challengeId as factorId since they represent the same factor
        challengeId,
        code,
      });

      if (error) {
        console.error('Error verifying MFA challenge:', error);
        toast({
          title: "Error",
          description: "Invalid verification code",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "MFA verification successful",
      });
      
      return true;
    } catch (error) {
      console.error('Error in verifyChallenge:', error);
      return false;
    }
  };

  return (
    <MFAContext.Provider value={{
      factors,
      loading,
      enrollMFA,
      verifyMFA,
      unenrollMFA,
      challengeMFA,
      verifyChallenge,
      refreshFactors,
      isMFARequired,
      setMFARequired,
    }}>
      {children}
    </MFAContext.Provider>
  );
};

export const useMFA = () => {
  return useContext(MFAContext);
};