import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRealData } from '@/hooks/useRealData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, User, Bell, LogOut, Star } from 'lucide-react';
import { BookAppointmentModal } from './BookAppointmentModal';

export const PatientDashboard = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { user, logout } = useAuth();
  const { doctors, appointments, notifications, loading } = useRealData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'busy': return 'secondary';
      case 'away': return 'destructive';
      default: return 'outline';
    }
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'default';
      case 'in-progress': return 'secondary';
      case 'completed': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user?.email?.split('@')[0]}</h1>
              <p className="text-muted-foreground">Manage your appointments</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Appointment</p>
                  <p className="text-2xl font-bold">
                    {appointments[0] ? `${appointments[0].date} ${appointments[0].time_slot}` : 'None'}
                  </p>
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
                  <p className="text-sm text-muted-foreground">Estimated Wait</p>
                  <p className="text-2xl font-bold">
                    {appointments[0]?.estimated_wait_time ? `${appointments[0].estimated_wait_time} mins` : '--'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              My Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appointments.length > 0 ? (
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{apt.doctor_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.date} at {apt.time_slot}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getAppointmentStatusColor(apt.status)}>
                      {apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No appointments yet</p>
                <Button onClick={() => setIsBookingOpen(true)}>Book Appointment</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Available Doctors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{doctor.name}</h3>
                      <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{doctor.rating}</span>
                        <span className="text-sm text-muted-foreground">• {doctor.experience} years</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={getStatusColor(doctor.status)}>
                      {doctor.status}
                    </Badge>
                    <Button
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setIsBookingOpen(true);
                      }}
                      disabled={doctor.status !== 'available'}
                    >
                      Book
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <BookAppointmentModal
        doctor={selectedDoctor}
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedDoctor(null);
        }}
      />
    </div>
  );
};
