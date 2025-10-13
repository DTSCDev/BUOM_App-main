import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Play, 
  BookOpen, 
  ListTodo,
  User,
  FileText,
  PiggyBank,
  Shield,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useDocuments } from '@/hooks/useDocuments';
import { useNetAssetValue } from '@/hooks/useNetAssetValue';
import { useProfessionalAdvisors } from '@/hooks/useProfessionalAdvisors';

interface ToDoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  route: string;
  icon: React.ReactNode;
  sfmCode: string;
}

export default function BUOMHub() {
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { user } = useAuth();
  const { documents } = useDocuments(user?.id);
  const { assets } = useNetAssetValue();
  const { advisors } = useProfessionalAdvisors();

  // Helper: check required document uploads and NI capture
  const requiredDocTypes = ["payslip", "id", "proof_of_address"];
  const requiredDocsUploaded = requiredDocTypes.every(type =>
    (documents || []).some(doc => doc.type === type)
  );

  // Calculate completion status for each section
  const getToDoItems = (): ToDoItem[] => {
    const workplaceComplete = !!(profile?.annual_salary && profile?.employment_type);
    const pensionComplete = !!(profile?.pension_provider && (profile?.pension_contribution_employee || profile?.pension_contribution_employer));
    const documentsComplete = requiredDocsUploaded; // NI is captured via payslip upload
    const pastPensionComplete = assets?.some(asset => asset.category?.name?.toLowerCase().includes('pension')) || false;
    const assetsComplete = assets && assets.length > 0;
    const legacyComplete = false; // TODO: Check legacy planning completion
    const advisorsComplete = advisors && advisors.length > 0;

    return [
      {
        id: 'workplace',
        title: 'Current Workplace Status',
        description: 'Profile > Salary Details',
        completed: workplaceComplete,
        route: '/profile?section=salary',
        icon: <User className="h-4 w-4" />,
        sfmCode: 'SFM-HUB-9010-1'
      },
      {
        id: 'pension-provider',
        title: 'Current Pension Provider',
        description: 'Profile > Pension Details',
        completed: pensionComplete,
        route: '/profile?section=pension',
        icon: <PiggyBank className="h-4 w-4" />,
        sfmCode: 'SFM-HUB-9011-1'
      },
      {
        id: 'documents',
        title: 'Upload Required Documents',
        description: 'Profile > Documents (Payslip, ID, Address)',
        completed: documentsComplete,
        route: '/profile?section=documents',
        icon: <FileText className="h-4 w-4" />,
        sfmCode: 'SFM-HUB-9012-1'
      },
      {
        id: 'past-pensions',
        title: 'Past Pension Details',
        description: 'Net Asset Value > Assets > Pensions',
        completed: pastPensionComplete,
        route: '/net-asset-value?category=pensions',
        icon: <PiggyBank className="h-4 w-4" />,
        sfmCode: 'SFM-HUB-9013-1'
      },
      {
        id: 'assets-liabilities',
        title: 'Update Assets and Liabilities',
        description: 'Net Asset Value',
        completed: assetsComplete,
        route: '/net-asset-value',
        icon: <PiggyBank className="h-4 w-4" />,
        sfmCode: 'SFM-HUB-9014-1'
      },
      {
        id: 'legacy-planning',
        title: 'Legacy & Estate Planning',
        description: 'Profile > Legacy Planning',
        completed: legacyComplete,
        route: '/profile?section=legacy',
        icon: <Shield className="h-4 w-4" />,
        sfmCode: 'SFM-HUB-9015-1'
      },
      {
        id: 'advisors',
        title: 'Add Professional Advisors',
        description: 'Profile > Professional Advisors',
        completed: advisorsComplete,
        route: '/profile?section=advisors',
        icon: <Users className="h-4 w-4" />,
        sfmCode: 'SFM-HUB-9016-1'
      }
    ];
  };

  const todoItems = getToDoItems();
  const completedItems = todoItems.filter(item => item.completed).length;
  const completionPercentage = Math.round((completedItems / todoItems.length) * 100);
  const documentsItem = todoItems.find(t => t.id === 'documents');
  const canStartAPF = !!documentsItem?.completed; // Stage 1 gating: required uploads complete

  const handleNavigation = (route: string) => {
    navigate(route);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to BUOM Hub</h1>
        <p className="text-gray-600">Your central dashboard for managing your retirement planning journey</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">
        {/* Left Side - 66% width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Card */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Play className="h-5 w-5" />
                Welcome
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-gray-800 mb-2">AI Video Introduction</h3>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">AI Video Intro Coming Soon</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700">
                Welcome to your personalized retirement planning hub. Let's get started on securing your financial future.
              </p>
            </CardContent>
          </Card>

          {/* User Guide Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                User Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-700">
                Get the most out of BUOM with our comprehensive guides and resources.
              </p>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/calculator')}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Getting Started Guide
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/profile')}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Profile Setup Guide
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => navigate('/net-asset-value')}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Asset Management Guide
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="h-5 w-5" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-gray-700">
                  Based on your current progress, here are your recommended next steps:
                </p>
                {completionPercentage < 100 && (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 font-medium">
                      Complete your profile setup to unlock personalized recommendations
                    </p>
                  </div>
                )}
                {canStartAPF && (
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-green-800 font-medium">
                      Required documents uploaded. You can start APF Registration.
                    </p>
                  </div>
                )}
                {!canStartAPF && (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800 font-medium">
                      Upload required documents (Payslip, ID, Address) before starting APF Registration.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - 33% width */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ListTodo className="h-5 w-5" />
                To Do List
              </CardTitle>
              <div className="flex items-center gap-2">
                <Progress value={completionPercentage} className="flex-1" />
                <span className="text-sm font-medium">{completionPercentage}%</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                {todoItems.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-500 w-4">
                          {index + 1}
                        </span>
                        {item.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-900">{item.title}</h4>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleNavigation(item.route)}
                      className="h-8 w-8 p-0"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-lg border" style={{ borderColor: canStartAPF ? '#bbf7d0' : '#fde68a', backgroundColor: canStartAPF ? '#f0fdf4' : '#fffbeb' }}>
                <p className={canStartAPF ? "text-green-800 text-sm font-medium text-center" : "text-yellow-800 text-sm font-medium text-center"}>
                  {canStartAPF ? 'Ready for APF registration.' : 'Complete required uploads before starting APF registration.'}
                </p>
                <Button 
                  className="w-full mt-2" 
                  onClick={() => navigate('/apf-registration')}
                  disabled={!canStartAPF}
                >
                  Start APF Registration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}