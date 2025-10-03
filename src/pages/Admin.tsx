import { useState } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Shield, 
  FileText, 
  Building, 
  PiggyBank, 
  TrendingUp,
  Settings,
  Activity,
  Search,
  Filter
} from 'lucide-react';
import { AdminMemberManagement } from '@/components/Admin/AdminMemberManagement';
import { AdminLendingManagement } from '@/components/Admin/AdminLendingManagement';
import { AdminPropertyManagement } from '@/components/Admin/AdminPropertyManagement';
import { AdminFundManagement } from '@/components/Admin/AdminFundManagement';
import { AdminUserManagement } from '@/components/Admin/AdminUserManagement';
import { AdminAuditTrail } from '@/components/Admin/AdminAuditTrail';
import { AdminSystemOverrides } from '@/components/Admin/AdminSystemOverrides';
import { AdminDashboard } from '@/components/Admin/AdminDashboard';

export default function Admin() {
  const { adminUser, hasAdminAccess, loading, hasPermission, canManageUsers } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking admin access...</p>
        </div>
      </div>
    );
  }

  if (!hasAdminAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have administrator privileges to access this system.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.history.back()}>
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const adminTabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: TrendingUp,
      component: AdminDashboard
    },
    {
      id: 'members',
      label: 'Member Management',
      icon: Users,
      component: AdminMemberManagement
    },
    {
      id: 'lending',
      label: 'Lending',
      icon: Building,
      component: AdminLendingManagement,
      departments: ['lending', 'corporate_sme', 'personal']
    },
    {
      id: 'property',
      label: 'Property Development',
      icon: Building,
      component: AdminPropertyManagement,
      departments: ['property', 'development']
    },
    {
      id: 'funds',
      label: 'Fund Administration',
      icon: PiggyBank,
      component: AdminFundManagement,
      departments: ['fund_admin', 'pension']
    },
    {
      id: 'overrides',
      label: 'System Overrides',
      icon: Settings,
      component: AdminSystemOverrides
    },
    {
      id: 'users',
      label: 'User Management',
      icon: Shield,
      component: AdminUserManagement,
      requiresPermission: () => canManageUsers()
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: Activity,
      component: AdminAuditTrail
    }
  ];

  const visibleTabs = adminTabs.filter(tab => {
    if (tab.requiresPermission && !tab.requiresPermission()) return false;
    if (tab.departments && !tab.departments.some(dept => hasPermission('view', dept))) {
      return adminUser?.admin_level === 'super_admin' || adminUser?.admin_level === 'admin';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Advanced Pension Funding - Administration
              </h1>
              <p className="text-muted-foreground">
                Financial Services Management Platform
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {adminUser?.admin_level.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge variant="outline">
                {adminUser?.departments.join(', ') || 'All Departments'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2 text-xs"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {visibleTabs.map((tab) => {
            const Component = tab.component;
            return (
              <TabsContent key={tab.id} value={tab.id}>
                <Component />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}