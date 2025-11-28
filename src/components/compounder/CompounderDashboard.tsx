import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, Clock, Bell, Search, Calendar, CheckCircle, Phone, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const CompounderDashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [doctors, setDoctors] = useState<any[]>([]);
  const [queue, setQueue] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch doctors
        const { data: doctorsData } = await supabase
          .from('doctors')
          .select('*, profiles!doctors_user_id_fkey(name, avatar)');

        if (doctorsData) setDoctors(doctorsData);

        // Fetch appointments for today
        const today = new Date().toISOString().split('T')[0];
        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select('*')
          .eq('date', today);

        if (appointmentsData) setAppointments(appointmentsData);

        // Fetch queue
        const { data: queueData } = await supabase
          .from('queue_items')
          .select(`
            *,
            appointment:appointments!queue_items_appointment_id_fkey(
              time_slot,
              patient:profiles!appointments_patient_id_fkey(name)
            )
          `);

        if (queueData) setQueue(queueData);
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
  const inProgressPatients = queue.filter(item => item.status === 'in-progress');
  const completedCount = queue.filter(item => item.status === 'completed').length;

  const filteredQueue = queue.filter(item =>
    item.appointment?.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateQueueStatus = async (queueId: string, status: 'waiting' | 'in-progress' | 'completed') => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'secondary';
      case 'in-progress': return 'default';
      case 'completed': return 'outline';
      default: return 'outline';
    }
  };

  const getDoctorStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'busy': return 'secondary';
      case 'away': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Reception Dashboard</h1>
              <p className="text-muted-foreground">Welcome, {user?.email?.split('@')[0]}</p>
            </div>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </Button>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-4">
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
                  <Clock className="h-6 w-6 text-primary" />
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
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{inProgressPatients.length}</p>
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

        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Doctor Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">
                      {doctor.profiles?.name || 'Doctor'}
                    </h3>
                    <Badge variant={getDoctorStatusColor(doctor.status)}>
                      {doctor.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{doctor.specialization}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Queue: {waitingPatients.length}</span>
                    <span>~{doctor.consultation_time}min</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Patient Queue Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredQueue.length > 0 ? (
              <div className="space-y-3">
                {filteredQueue.map((patient, index) => (
                  <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full font-semibold">
                        {index + 1}
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
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusColor(patient.status)}>
                        {patient.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Bell className="h-4 w-4" />
                        </Button>
                        {patient.status === 'waiting' && (
                          <Button
                            size="sm"
                            onClick={() => updateQueueStatus(patient.id, 'in-progress')}
                          >
                            Start
                          </Button>
                        )}
                        {patient.status === 'in-progress' && (
                          <Button
                            size="sm"
                            onClick={() => updateQueueStatus(patient.id, 'completed')}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No patients in queue</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
