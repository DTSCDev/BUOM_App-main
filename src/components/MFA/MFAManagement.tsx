import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMFA } from '@/hooks/useMFA';
import { Shield, ShieldCheck, ShieldX, QrCode, Smartphone, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MFASetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MFASetupDialog = ({ open, onOpenChange }: MFASetupDialogProps) => {
  const { enrollMFA, verifyMFA } = useMFA();
  const [step, setStep] = useState<'enroll' | 'verify'>('enroll');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [factorId, setFactorId] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    try {
      const result = await enrollMFA();
      if (result) {
        setQrCode(result.qr_code);
        setSecret(result.secret);
        setFactorId(result.factor_id);
        setStep('verify');
      }
    } catch (error) {
      console.error('Error enrolling MFA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationCode || !factorId) return;
    
    setLoading(true);
    try {
      const success = await verifyMFA(factorId, verificationCode);
      if (success) {
        onOpenChange(false);
        setStep('enroll');
        setVerificationCode('');
        setQrCode('');
        setSecret('');
        setFactorId('');
      }
    } catch (error) {
      console.error('Error verifying MFA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep('enroll');
    setVerificationCode('');
    setQrCode('');
    setSecret('');
    setFactorId('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Set Up Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            Secure your account with an additional layer of protection
          </DialogDescription>
        </DialogHeader>

        {step === 'enroll' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Smartphone className="w-5 h-5" />
                  Step 1: Install Authenticator App
                </CardTitle>
                <CardDescription>
                  Download one of these apps on your mobile device:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <Badge variant="outline" className="justify-center p-2">
                    Google Authenticator
                  </Badge>
                  <Badge variant="outline" className="justify-center p-2">
                    Microsoft Authenticator
                  </Badge>
                  <Badge variant="outline" className="justify-center p-2">
                    Authy
                  </Badge>
                  <Badge variant="outline" className="justify-center p-2">
                    1Password
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleEnroll} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Setting up...' : 'Continue to QR Code'}
            </Button>
          </div>
        )}

        {step === 'verify' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <QrCode className="w-5 h-5" />
                  Step 2: Scan QR Code
                </CardTitle>
                <CardDescription>
                  Scan this QR code with your authenticator app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {qrCode && (
                  <div className="flex justify-center">
                    <img 
                      src={qrCode} 
                      alt="MFA QR Code" 
                      className="w-48 h-48 border rounded-lg"
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Can't scan? Enter this code manually:
                  </Label>
                  <div className="p-2 bg-gray-100 rounded font-mono text-sm break-all">
                    {secret}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Step 3: Enter Verification Code</CardTitle>
                <CardDescription>
                  Enter the 6-digit code from your authenticator app
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verification-code">Verification Code</Label>
                  <Input
                    id="verification-code"
                    type="text"
                    placeholder="000000"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    className="text-center text-lg font-mono"
                  />
                </div>
                
                <Button 
                  onClick={handleVerify} 
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full"
                >
                  {loading ? 'Verifying...' : 'Verify & Enable MFA'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export const MFAManagement = () => {
  const { factors, loading, unenrollMFA, refreshFactors } = useMFA();
  const [setupDialogOpen, setSetupDialogOpen] = useState(false);
  const [disabling, setDisabling] = useState<string | null>(null);

  const handleDisableMFA = async (factorId: string) => {
    setDisabling(factorId);
    try {
      const success = await unenrollMFA(factorId);
      if (success) {
        await refreshFactors();
      }
    } catch (error) {
      console.error('Error disabling MFA:', error);
    } finally {
      setDisabling(null);
    }
  };

  const verifiedFactors = factors.filter(f => f.status === 'verified');
  const hasVerifiedMFA = verifiedFactors.length > 0;

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {hasVerifiedMFA ? (
              <ShieldCheck className="w-5 h-5 text-green-600" />
            ) : (
              <ShieldX className="w-5 h-5 text-red-600" />
            )}
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            {hasVerifiedMFA 
              ? 'Your account is protected with two-factor authentication'
              : 'Add an extra layer of security to your account'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {hasVerifiedMFA ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium text-green-800">MFA is enabled</p>
                  <p className="text-sm text-green-600">
                    Your account is secured with TOTP authentication
                  </p>
                </div>
              </div>
              
              {verifiedFactors.map((factor) => (
                <div key={factor.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{factor.friendly_name || 'TOTP Authenticator'}</p>
                    <p className="text-sm text-gray-600">
                      Added {new Date(factor.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDisableMFA(factor.id)}
                    disabled={disabling === factor.id}
                  >
                    {disabling === factor.id ? 'Disabling...' : 'Disable'}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <div className="flex-1">
                  <p className="font-medium text-yellow-800">MFA is not enabled</p>
                  <p className="text-sm text-yellow-600">
                    Your account is vulnerable to unauthorized access
                  </p>
                </div>
              </div>
              
              <Button 
                onClick={() => setSetupDialogOpen(true)}
                className="w-full"
              >
                <Shield className="w-4 h-4 mr-2" />
                Enable Two-Factor Authentication
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <MFASetupDialog 
        open={setupDialogOpen} 
        onOpenChange={setSetupDialogOpen} 
      />
    </>
  );
};