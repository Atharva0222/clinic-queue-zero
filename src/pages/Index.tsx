
import { useAuth } from '@/contexts/AuthContext';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { PatientDashboard } from '@/components/patient/PatientDashboard';
import { DoctorDashboard } from '@/components/doctor/DoctorDashboard';
import { CompounderDashboard } from '@/components/compounder/CompounderDashboard';

const Index = () => {
  const { user, userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  if (!user || !userRole) {
    return <LoginScreen />;
  }

  switch (userRole) {
    case 'patient':
      return <PatientDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'compounder':
      return <CompounderDashboard />;
    default:
      return <LoginScreen />;
  }
};

export default Index;
