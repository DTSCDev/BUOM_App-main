
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, RequireAuth, useAuth } from "@/hooks/useAuth";
import { AppLayout } from "@/components/Layout/AppLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import APFDashboard from "./pages/APFDashboard";
import APFPlanOverview from "./pages/APFPlanOverview";
import Profile from "./pages/Profile";
import NetAssetValue from "./pages/NetAssetValue";
import APFRegistration from "./pages/APFRegistration";
import GetStarted from "./pages/GetStarted";
import FreeCalculator from "./pages/FreeCalculator";
import Calculators from "./pages/Calculators";
import DirectorEarningsOptimiser from "./pages/DirectorEarningsOptimiser";
import MaxPensionFunding from "./pages/MaxPensionFunding";
import ParameterSettings from "./pages/ParameterSettings";
import SystemFields from "./pages/SystemFields";
import SFMAudit from "./pages/SFMAudit";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancelled from "./pages/PaymentCancelled";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import RetirementCalculatorEmployee from "./pages/RetirementCalculatorEmployee";
import SecuritySettings from "./pages/SecuritySettings";
import BUOMHub from "./pages/BUOMHub";
import PayslipComparison from "./pages/PayslipComparison";
import PlanC from "./pages/PlanC";

const queryClient = new QueryClient();

// Component to conditionally wrap with AppLayout for authenticated users
const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }
  
  // If user is authenticated, show with AppLayout (sidebar)
  if (user) {
    return (
      <AppLayout>
        {children}
      </AppLayout>
    );
  }
  
  // If not authenticated, show without sidebar
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            // Calculator routes - Public access but with menu for authenticated users
            <Route path="/free-calculator/*" element={<Navigate to="/freeCalculator" replace />} />
            <Route path="/freeCalculator" element={<FreeCalculator />} />
            <Route path="/calculator_hub" element={
              <ConditionalLayout>
                <Calculators />
              </ConditionalLayout>
            } />
            <Route path="/calculator_hub/retirement_calculator" element={
              <ConditionalLayout>
                <RetirementCalculatorEmployee />
              </ConditionalLayout>
            } />
            <Route path="/calculator_hub/director_earnings" element={
              <ConditionalLayout>
                <DirectorEarningsOptimiser />
              </ConditionalLayout>
            } />
            <Route path="/calculator_hub/max_pension_funding" element={
              <ConditionalLayout>
                <MaxPensionFunding />
              </ConditionalLayout>
            } />
            <Route path="/calculator_hub/parameter_settings" element={
              <ConditionalLayout>
                <ParameterSettings />
              </ConditionalLayout>
            } />
            <Route path="/calculator_hub/payslip_comparison" element={
              <ConditionalLayout>
                <PayslipComparison />
              </ConditionalLayout>
            } />
            <Route path="/calculator_hub/plan_c" element={
              <ConditionalLayout>
                <PlanC />
              </ConditionalLayout>
            } />
            
            // Legacy redirects
            <Route path="/calculator" element={<Navigate to="/freeCalculator" replace />} />
            <Route path="/calculators" element={<Navigate to="/calculator_hub" replace />} />
            <Route path="/calculators/retirement_calculator" element={<Navigate to="/calculator_hub/retirement_calculator" replace />} />
            <Route path="/calculators/director_earnings" element={<Navigate to="/calculator_hub/director_earnings" replace />} />
            <Route path="/calculators/max_pension_funding" element={<Navigate to="/calculator_hub/max_pension_funding" replace />} />
            <Route path="/Retirement_Calculator" element={<Navigate to="/calculator_hub/retirement_calculator" replace />} />
            
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancelled" element={<PaymentCancelled />} />
            
            {/* Protected routes with layout */}
            <Route path="/buom-hub" element={
              <RequireAuth>
                <AppLayout>
                  <BUOMHub />
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/apf/dashboard" element={
              <RequireAuth>
                <AppLayout>
                  <APFDashboard />
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/apf/plan-overview" element={
              <RequireAuth>
                <AppLayout>
                  <APFPlanOverview />
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/dashboard" element={<Navigate to="/apf/dashboard" replace />} />
            <Route path="/profile" element={
              <RequireAuth>
                <AppLayout>
                  <Profile />
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/security" element={
              <RequireAuth>
                <AppLayout>
                  <SecuritySettings />
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/net-asset-value" element={
              <RequireAuth>
                <AppLayout>
                  <NetAssetValue />
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/apf-registration" element={
              <RequireAuth>
                <AppLayout>
                  <APFRegistration />
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/get-started" element={
              <RequireAuth>
                <AppLayout>
                  <GetStarted />
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/system-fields" element={
              <ConditionalLayout>
                <SystemFields />
              </ConditionalLayout>
            } />
            <Route path="/sfm-audit" element={
              <RequireAuth>
                <AppLayout>
                  <SFMAudit />
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/payments" element={
              <RequireAuth>
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Payments</h1>
                    <p>Payment management coming soon...</p>
                  </div>
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/statements" element={
              <RequireAuth>
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Statements</h1>
                    <p>Statement generation coming soon...</p>
                  </div>
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/reports" element={
              <RequireAuth>
                <AppLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Reports</h1>
                    <p>Reporting dashboard coming soon...</p>
                  </div>
                </AppLayout>
              </RequireAuth>
            } />
            <Route path="/admin" element={
              <RequireAuth>
                <Admin />
              </RequireAuth>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
