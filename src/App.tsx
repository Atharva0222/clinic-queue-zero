
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { PatientDashboard } from "@/components/patient/PatientDashboard";
import { DoctorDashboard } from "@/components/doctor/DoctorDashboard";
import { CompounderDashboard } from "@/components/compounder/CompounderDashboard";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <LoginScreen />;
  }

  const getDashboard = () => {
    switch (user.role) {
      case 'patient':
        return <PatientDashboard />;
      case 'doctor':
        return <DoctorDashboard />;
      case 'compounder':
        return <CompounderDashboard />;
      default:
        return <PatientDashboard />;
    }
  };

  return (
    <div className="relative">
      {/* Logout Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={logout}
          className="bg-white shadow-lg"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
      
      {getDashboard()}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="*" element={<AppContent />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
