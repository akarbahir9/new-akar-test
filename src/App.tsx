import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DataProvider } from "@/contexts/DataContext";
import LoginPage from "@/pages/LoginPage";
import MainLayout from "@/components/layout/MainLayout";
import DashboardPage from "@/pages/DashboardPage";
import POSPage from "@/pages/POSPage";
import CustomersPage from "@/pages/CustomersPage";
import FinancialPage from "@/pages/FinancialPage";
import ReportsPage from "@/pages/ReportsPage";
import UsersPage from "@/pages/UsersPage";
import RolesPage from "@/pages/RolesPage";
import SettingsPage from "@/pages/SettingsPage";
import AIAssistantPage from "@/pages/AIAssistantPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, permission }: { children: React.ReactNode; permission?: string }) {
  const { isAuthenticated, hasPermission } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (permission && !hasPermission(permission as any)) return <Navigate to="/dashboard" replace />;
  return <MainLayout>{children}</MainLayout>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/pos" element={<ProtectedRoute permission="accessPos"><POSPage /></ProtectedRoute>} />
      <Route path="/customers" element={<ProtectedRoute permission="viewCustomerList"><CustomersPage /></ProtectedRoute>} />
      <Route path="/financial" element={<ProtectedRoute permission="viewFinancialDashboards"><FinancialPage /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute permission="viewReports"><ReportsPage /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute permission="manageUsers"><UsersPage /></ProtectedRoute>} />
      <Route path="/roles" element={<ProtectedRoute permission="editRoles"><RolesPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute permission="accessSettings"><SettingsPage /></ProtectedRoute>} />
      <Route path="/ai-assistant" element={<ProtectedRoute permission="accessAiAssistant"><AIAssistantPage /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <DataProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </DataProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
