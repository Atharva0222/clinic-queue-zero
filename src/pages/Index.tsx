
import { useAuth } from '@/contexts/AuthContext';
import { LoginScreen } from '@/components/auth/LoginScreen';
import { PatientDashboard } from '@/components/patient/PatientDashboard';
import { DoctorDashboard } from '@/components/doctor/DoctorDashboard';
import { CompounderDashboard } from '@/components/compounder/CompounderDashboard';

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginScreen />;
  }

  switch (user.role) {
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
