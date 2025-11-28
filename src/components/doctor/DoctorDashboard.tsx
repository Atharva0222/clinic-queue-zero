import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Users, CheckCircle, PlayCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [doctorProfile, setDoctorProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch doctor profile
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('*, profiles!doctors_user_id_fkey(name)')
          .eq('user_id', user.id)
          .single();

        if (doctorData) {
          setDoctorProfile(doctorData);
        }

        // Fetch appointments for today
        const today = new Date().toISOString().split('T')[0];
        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:profiles!appointments_patient_id_fkey(name)
          `)
          .eq('date', today);

        if (appointmentsData) {
          setAppointments(appointmentsData);
        }

        // Fetch queue items
        const { data: queueData } = await supabase
          .from('queue_items')
          .select(`
            *,
            appointment:appointments!queue_items_appointment_id_fkey(
              time_slot,
              patient:profiles!appointments_patient_id_fkey(name)
            )
          `);

        if (queueData) {
          setQueue(queueData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  const waitingPatients = queue.filter(item => item.status === 'waiting');
  const inProgressPatient = queue.find(item => item.status === 'in-progress');
  const completedCount = queue.filter(item => item.status === 'completed').length;

  const updateQueueStatus = async (queueId: string, status: 'in-progress' | 'completed') => {
    const { error } = await supabase
      .from('queue_items')
      .update({ status })
      .eq('id', queueId);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setQueue(queue.map(item => 
        item.id === queueId ? { ...item, status } : item
      ));
      toast({
        title: 'Success',
        description: `Patient status updated to ${status}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                Dr. {doctorProfile?.profiles?.name || user?.email?.split('@')[0]}
              </h1>
              <p className="text-muted-foreground">{doctorProfile?.specialization || 'General Medicine'}</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge>{doctorProfile?.status || 'available'}</Badge>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Today's Appointments</p>
                  <p className="text-2xl font-bold">{appointments.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Waiting</p>
                  <p className="text-2xl font-bold">{waitingPatients.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{completedCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {inProgressPatient && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5" />
                Current Patient
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {inProgressPatient.appointment?.patient?.name || 'Patient'}
                    </h3>
                    <p className="text-muted-foreground">
                      Appointment: {inProgressPatient.appointment?.time_slot}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => updateQueueStatus(inProgressPatient.id, 'completed')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Patient Queue ({waitingPatients.length} waiting)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {waitingPatients.length > 0 ? (
              <div className="space-y-3">
                {waitingPatients.map((patient, index) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full font-semibold">
                        {index + 1}
                      </div>
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold">
                          {patient.appointment?.patient?.name || 'Patient'}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Scheduled: {patient.appointment?.time_slot}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => updateQueueStatus(patient.id, 'in-progress')}
                      disabled={!!inProgressPatient}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Start
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No patients waiting</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
