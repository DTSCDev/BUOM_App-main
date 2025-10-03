import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMFA } from '@/hooks/useMFA';
import { Shield, AlertTriangle, Smartphone } from 'lucide-react';

interface MFAChallengeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export const MFAChallengeDialog = ({ 
  open, 
  onOpenChange, 
  onSuccess,
  title = "Two-Factor Authentication Required",
  description = "Please enter your authentication code to continue"
}: MFAChallengeDialogProps) => {
  const { challengeMFA, verifyChallenge } = useMFA();
  const [challengeId, setChallengeId] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'challenge' | 'verify'>('challenge');

  const handleChallenge = async () => {
    setLoading(true);
    try {
      const result = await challengeMFA();
      if (result) {
        setChallengeId(result.challenge_id);
        setStep('verify');
      }
    } catch (error) {
      console.error('Error creating MFA challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || !challengeId) return;
    
    setLoading(true);
    try {
      const success = await verifyChallenge(challengeId, verificationCode);
      if (success) {
        onSuccess();
        handleClose();
      }
    } catch (error) {
      console.error('Error verifying MFA challenge:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep('challenge');
    setVerificationCode('');
    setChallengeId('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        {step === 'challenge' && (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="font-medium text-blue-800">Security Verification</p>
                    <p className="text-sm text-blue-600">
                      This action requires two-factor authentication
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleChallenge} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Preparing...' : 'Continue with MFA'}
            </Button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Enter Authentication Code
                </CardTitle>
                <CardDescription>
                  Open your authenticator app and enter the 6-digit code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mfa-code">Authentication Code</Label>
                  <Input
                    id="mfa-code"
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-lg font-mono"
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setStep('challenge')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button 
                    onClick={handleVerify} 
                    disabled={loading || verificationCode.length !== 6}
                    className="flex-1"
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};