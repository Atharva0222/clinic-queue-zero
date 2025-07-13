
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Users, CheckCircle, PlayCircle, XCircle, User, Phone } from 'lucide-react';
import { useMockData } from '@/hooks/useMockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const { appointments, queue, setQueue } = useMockData();
  const [doctorStatus, setDoctorStatus] = useState('available');

  const todayAppointments = appointments.filter(apt => 
    apt.date === new Date().toISOString().split('T')[0]
  );

  const waitingPatients = queue.filter(item => item.status === 'waiting');
  const inProgressPatient = queue.find(item => item.status === 'in-progress');

  const updateAppointmentStatus = (appointmentId: string, status: 'in-progress' | 'completed') => {
    const updatedQueue = queue.map(item => {
      if (item.appointmentId === appointmentId) {
        return { ...item, status };
      }
      return item;
    });
    setQueue(updatedQueue);

    toast({
      title: 'Status Updated',
      description: `Appointment marked as ${status}`,
    });
  };

  const updateDoctorStatus = (status: string) => {
    setDoctorStatus(status);
    toast({
      title: 'Status Updated',
      description: `Your status is now: ${status}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-orange-100 text-orange-800';
      case 'away': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dr. {user?.name}</h1>
            <p className="text-gray-600">{user?.specialization || 'General Medicine'}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(doctorStatus)}>
              {doctorStatus}
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                const statuses = ['available', 'busy', 'delayed', 'away'];
                const currentIndex = statuses.indexOf(doctorStatus);
                const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                updateDoctorStatus(nextStatus);
              }}
            >
              Update Status
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <p className="text-xl font-bold">{todayAppointments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Waiting</p>
                <p className="text-xl font-bold">{waitingPatients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-bold">
                  {queue.filter(item => item.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Patient */}
      {inProgressPatient && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <PlayCircle className="h-5 w-5" />
              Current Patient
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {inProgressPatient.patientName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{inProgressPatient.patientName}</h3>
                  <p className="text-gray-600">Appointment: {inProgressPatient.timeSlot}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => updateAppointmentStatus(inProgressPatient.appointmentId, 'completed')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Complete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Patient Queue */}
      <Card className="mb-6">
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
                <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{patient.patientName}</h3>
                      <p className="text-sm text-gray-600">Scheduled: {patient.timeSlot}</p>
                      {patient.estimatedTime && (
                        <p className="text-xs text-blue-600">Est. wait: {patient.estimatedTime} mins</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateAppointmentStatus(patient.appointmentId, 'in-progress')}
                      disabled={!!inProgressPatient}
                    >
                      <PlayCircle className="h-4 w-4 mr-1" />
                      Start
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No patients waiting</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {todayAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="font-medium">{appointment.timeSlot}</p>
                    <p className="text-sm text-gray-600">{appointment.patientName}</p>
                  </div>
                </div>
                <Badge variant={appointment.status === 'completed' ? 'secondary' : 'outline'}>
                  {appointment.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
