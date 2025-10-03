import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { MFAManagement, MFAChallengeDialog } from '@/components/MFA';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Key, 
  Settings,
  Save,
  AlertTriangle 
} from 'lucide-react';

export const SecuritySettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [mfaChallengeOpen, setMfaChallengeOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'password' | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords don't match",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error", 
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      });
      return;
    }

    setPendingAction('password');
    setMfaChallengeOpen(true);
  };

  const executePasswordChange = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Password updated successfully"
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMFASuccess = () => {
    if (pendingAction === 'password') {
      executePasswordChange();
    }
    setPendingAction(null);
  };

  const handleMFACancel = () => {
    setPendingAction(null);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <p className="text-gray-500">Please sign in to access security settings</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Account Information
          </CardTitle>
          <CardDescription>
            Your account details and status
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <div className="flex items-center gap-2">
                <Input value={user.email || ''} disabled />
                {user.email_confirmed_at && (
                  <Badge variant="secondary" className="text-green-600">
                    Verified
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Account Created
              </Label>
              <Input 
                value={user.created_at ? new Date(user.created_at).toLocaleDateString() : ''} 
                disabled 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>User ID</Label>
            <Input value={user.id} disabled className="font-mono text-sm" />
          </div>
        </CardContent>
      </Card>

      {/* Password Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Password Management
          </CardTitle>
          <CardDescription>
            Update your account password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                placeholder="Enter new password (min. 8 characters)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm new password"
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Changing your password will require MFA verification if enabled
              </p>
            </div>

            <Button 
              onClick={handlePasswordChange}
              disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Updating Password...' : 'Update Password'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* MFA Management */}
      <MFAManagement />

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Security Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium">Enable Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">
                  Add an extra layer of security to prevent unauthorized access
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Key className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium">Use Strong Passwords</p>
                <p className="text-sm text-gray-600">
                  Create passwords with at least 12 characters, including numbers and symbols
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <p className="font-medium">Regular Security Reviews</p>
                <p className="text-sm text-gray-600">
                  Periodically review your security settings and update passwords
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MFA Challenge Dialog */}
      <MFAChallengeDialog
        open={mfaChallengeOpen}
        onOpenChange={(open) => {
          setMfaChallengeOpen(open);
          if (!open) handleMFACancel();
        }}
        onSuccess={handleMFASuccess}
        title="Security Verification Required"
        description="Please verify your identity to change your password"
      />
    </div>
  );
};

export default SecuritySettings;