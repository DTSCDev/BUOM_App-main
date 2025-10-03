import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MFAChallengeDialog } from '@/components/MFA';
import { useMFA } from '@/hooks/useMFA';
import { Shield, ShieldCheck, ShieldX, AlertTriangle, Lock } from 'lucide-react';

interface ProtectedActionProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  onSuccess: () => void;
  requireMFA?: boolean;
  className?: string;
}

export const ProtectedAction = ({ 
  children, 
  title = "Security Verification Required",
  description = "This action requires additional verification",
  onSuccess,
  requireMFA = true,
  className = ""
}: ProtectedActionProps) => {
  const { factors } = useMFA();
  const [challengeOpen, setChallengeOpen] = useState(false);
  
  const hasVerifiedMFA = factors.some(f => f.status === 'verified');
  const shouldRequireMFA = requireMFA && hasVerifiedMFA;

  const handleAction = () => {
    if (shouldRequireMFA) {
      setChallengeOpen(true);
    } else {
      onSuccess();
    }
  };

  const handleMFASuccess = () => {
    setChallengeOpen(false);
    onSuccess();
  };

  return (
    <>
      <div className={`relative ${className}`}>
        {shouldRequireMFA && (
          <div className="absolute -top-2 -right-2 z-10">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
              <Shield className="w-3 h-3 mr-1" />
              MFA
            </Badge>
          </div>
        )}
        <div onClick={handleAction} className="cursor-pointer">
          {children}
        </div>
      </div>

      <MFAChallengeDialog
        open={challengeOpen}
        onOpenChange={setChallengeOpen}
        onSuccess={handleMFASuccess}
        title={title}
        description={description}
      />
    </>
  );
};

interface MFAStatusIndicatorProps {
  className?: string;
}

export const MFAStatusIndicator = ({ className = "" }: MFAStatusIndicatorProps) => {
  const { factors, loading } = useMFA();
  
  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
        <span className="text-sm text-gray-600">Checking MFA status...</span>
      </div>
    );
  }

  const hasVerifiedMFA = factors.some(f => f.status === 'verified');

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {hasVerifiedMFA ? (
        <>
          <ShieldCheck className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-600 font-medium">MFA Enabled</span>
        </>
      ) : (
        <>
          <ShieldX className="w-4 h-4 text-red-600" />
          <span className="text-sm text-red-600 font-medium">MFA Disabled</span>
        </>
      )}
    </div>
  );
};

interface SecurityBannerProps {
  className?: string;
}

export const SecurityBanner = ({ className = "" }: SecurityBannerProps) => {
  const { factors } = useMFA();
  const hasVerifiedMFA = factors.some(f => f.status === 'verified');

  if (hasVerifiedMFA) {
    return null;
  }

  return (
    <Card className={`border-yellow-200 bg-yellow-50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-yellow-800">Secure Your Account</h3>
            <p className="text-sm text-yellow-700 mt-1">
              Your account is not protected with two-factor authentication. Enable MFA to add an extra layer of security.
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 border-yellow-300 text-yellow-800 hover:bg-yellow-100"
              asChild
            >
              <a href="/security">
                <Lock className="w-4 h-4 mr-2" />
                Enable MFA
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};