import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Users, Clock, Award, Share2, BookOpen, Calculator, Scale, Home, Zap, FileText, Building, TrendingUp, Laptop, Heart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PowerOfTenChallengeProps {
  memberId: string;
}

interface Challenge {
  id: string;
  challengeName: string;
  currentReferrals: number;
  targetReferrals: number;
  status: string;
  rewardTokens: number;
}

interface Referral {
  id: string;
  referredEmail: string;
  referredName: string;
  status: string;
  tokensEarned: number;
  referredAt: string;
}

// Mock data for demonstration
const mockChallenge: Challenge = {
  id: '1',
  challengeName: 'Power of Ten Challenge',
  currentReferrals: 3,
  targetReferrals: 10,
  status: 'active',
  rewardTokens: 10
};

const mockReferrals: Referral[] = [
  {
    id: '1',
    referredEmail: 'john@example.com',
    referredName: 'John Smith',
    status: 'completed',
    tokensEarned: 1,
    referredAt: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    referredEmail: 'sarah@example.com',
    referredName: 'Sarah Johnson',
    status: 'pending',
    tokensEarned: 1,
    referredAt: '2024-01-16T14:30:00Z'
  },
  {
    id: '3',
    referredEmail: 'mike@example.com',
    referredName: 'Mike Brown',
    status: 'completed',
    tokensEarned: 1,
    referredAt: '2024-01-17T09:15:00Z'
  }
];

const professionalSectors = [
  { name: 'Accountants', icon: Calculator, color: 'bg-blue-500' },
  { name: 'Legal Advisors', icon: Scale, color: 'bg-indigo-500' },
  { name: 'Regulated Advisors', icon: Award, color: 'bg-purple-500' },
  { name: 'Pension & Finance', icon: TrendingUp, color: 'bg-green-500' },
  { name: 'Energy Advisors', icon: Zap, color: 'bg-yellow-500' },
  { name: 'Trust & Legacy', icon: Heart, color: 'bg-pink-500' },
  { name: 'Construction', icon: Building, color: 'bg-orange-500' },
  { name: 'Employee Benefits', icon: Users, color: 'bg-teal-500' },
  { name: 'Business Strategy', icon: BookOpen, color: 'bg-cyan-500' },
  { name: 'Technology & AI', icon: Laptop, color: 'bg-red-500' }
];

const PowerOfTenChallenge: React.FC<PowerOfTenChallengeProps> = ({ memberId }) => {
  const [challenge] = useState<Challenge>(mockChallenge);
  const [referrals, setReferrals] = useState<Referral[]>(mockReferrals);
  const [referralEmail, setReferralEmail] = useState('');
  const [referralName, setReferralName] = useState('');
  const [tokenBalance] = useState(5);
  const { toast } = useToast();

  const submitReferral = async () => {
    if (!referralEmail) return;

    // Mock referral submission
    const newReferral: Referral = {
      id: Date.now().toString(),
      referredEmail: referralEmail,
      referredName: referralName,
      status: 'pending',
      tokensEarned: 1,
      referredAt: new Date().toISOString()
    };

    setReferrals([newReferral, ...referrals]);
    setReferralEmail('');
    setReferralName('');

    toast({
      title: "Referral Submitted!",
      description: `You've earned 1 Time Token! Referral sent to ${referralEmail}`,
    });
  };

  const progressPercentage = (challenge.currentReferrals / challenge.targetReferrals) * 100;
  const isCompleted = challenge.currentReferrals >= challenge.targetReferrals;

  return (
    <div className="space-y-6">
      {/* Token Balance Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-500" />
            Your Time Token Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-yellow-600">
            {tokenBalance} Tokens
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Redeem tokens for expert advice from our 10 professional sectors
          </p>
        </CardContent>
      </Card>

      {/* Professional Sectors Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            10 Experts in Your Pocket
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {professionalSectors.map((sector, index) => {
              const Icon = sector.icon;
              return (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${sector.color}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-xs font-medium text-gray-700">{sector.name}</div>
                </div>
              );
            })}
          </div>
          <p className="text-sm text-gray-600 mt-4 text-center">
            Complete the Power of Ten Challenge to unlock access to all professional sectors
          </p>
        </CardContent>
      </Card>

      {/* Challenge Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            Power of Ten Challenge
            {isCompleted && <Badge className="bg-green-500">Completed!</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-500">
                  {challenge.currentReferrals}/{challenge.targetReferrals} referrals
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {challenge.currentReferrals}
                </div>
                <div className="text-sm text-gray-600">Referrals Made</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {challenge.currentReferrals}
                </div>
                <div className="text-sm text-gray-600">Tokens Earned</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {challenge.targetReferrals - challenge.currentReferrals > 0 
                    ? challenge.targetReferrals - challenge.currentReferrals 
                    : 0}
                </div>
                <div className="text-sm text-gray-600">Referrals Needed</div>
              </div>
            </div>

            {!isCompleted && (
              <div className="space-y-3">
                <h4 className="font-medium">Refer a Colleague</h4>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Colleague's email"
                    value={referralEmail}
                    onChange={(e) => setReferralEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="text"
                    placeholder="Name (optional)"
                    value={referralName}
                    onChange={(e) => setReferralName(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={submitReferral}
                    disabled={!referralEmail}
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Refer
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Each referral earns you 1 Time Token and helps them access expert financial advice
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* BUOM Mission Statement */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Tackling the UK's 5 Biggest Financial Challenges
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-medium">Retirement Crisis</div>
              </div>
              <div className="text-center">
                <Calculator className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-medium">Debt Management</div>
              </div>
              <div className="text-center">
                <Home className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-sm font-medium">Home Ownership</div>
              </div>
              <div className="text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                <div className="text-sm font-medium">Net Zero</div>
              </div>
              <div className="text-center">
                <Building className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <div className="text-sm font-medium">Small Business</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 max-w-3xl mx-auto">
              BUOM provides access to 10 professional sectors through Time Tokens earned via referrals.
              APF delivers 19.9% guaranteed returns while traditional pensions average 5% - that's a 70% cost saving!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      {referrals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-500" />
              Recent Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{referral.referredName || referral.referredEmail}</div>
                    <div className="text-sm text-gray-600">
                      {referral.referredName && referral.referredEmail}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={referral.status === 'completed' ? 'default' : 'secondary'}>
                      {referral.status}
                    </Badge>
                    <div className="text-sm text-gray-600 mt-1">
                      +{referral.tokensEarned} tokens
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      {isCompleted && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Congratulations! Challenge Complete!
              </h3>
              <p className="text-green-700 mb-4">
                You've successfully referred 10 colleagues and earned {challenge.rewardTokens} bonus tokens!
                You now have access to our network of 10 expert sectors.
              </p>
              <Button className="bg-green-600 hover:bg-green-700">
                Browse Expert Services
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PowerOfTenChallenge;