
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Clock, 
  Bell, 
  Search, 
  UserPlus, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Phone,
  MessageSquare
} from 'lucide-react';
import { useMockData } from '@/hooks/useMockData';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export const CompounderDashboard = () => {
  const { user } = useAuth();
  const { doctors, appointments, queue, setQueue, notifications, setNotifications } = useMockData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('all');

  const waitingPatients = queue.filter(item => item.status === 'waiting');
  const inProgressPatients = queue.filter(item => item.status === 'in-progress');
  const todayAppointments = appointments.filter(apt => 
    apt.date === new Date().toISOString().split('T')[0]
  );

  const filteredQueue = queue.filter(item => {
    const matchesSearch = item.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const updateQueueStatus = (queueId: string, status: 'waiting' | 'in-progress' | 'completed') => {
    const updatedQueue = queue.map(item => {
      if (item.id === queueId) {
        return { ...item, status };
      }
      return item;
    });
    setQueue(updatedQueue);

    toast({
      title: 'Queue Updated',
      description: `Patient status updated to ${status}`,
    });
  };

  const sendNotification = (patientName: string, message: string) => {
    const newNotification = {
      id: Date.now().toString(),
      title: 'Patient Notification',
      message: `Notification sent to ${patientName}: ${message}`,
      type: 'success' as const,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications([newNotification, ...notifications]);

    toast({
      title: 'Notification Sent',
      description: `Message sent to ${patientName}`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDoctorStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
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
            <h1 className="text-2xl font-bold text-gray-900">Reception Dashboard</h1>
            <p className="text-gray-600">Welcome, {user?.name}</p>
          </div>
          <Button className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Walk-in
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
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
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-xl font-bold">{inProgressPatients.length}</p>
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

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search patients..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Doctors</SelectItem>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Doctor Status Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Doctor Availability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{doctor.name}</h3>
                  <Badge className={getDoctorStatusColor(doctor.status)}>
                    {doctor.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">{doctor.specialization}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Queue: {queue.filter(q => q.status === 'waiting').length}</span>
                  <span>~{doctor.consultationTime}min</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Patient Queue Management */}
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
                <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">{patient.patientName}</h3>
                      <p className="text-sm text-gray-600">Scheduled: {patient.timeSlot}</p>
                      {patient.estimatedTime && (
                        <p className="text-xs text-blue-600">Est. wait: {patient.estimatedTime} mins</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendNotification(patient.patientName, 'Your turn is coming up in 5 minutes')}
                      >
                        <Bell className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => sendNotification(patient.patientName, 'Please contact the reception')}
                      >
                        <Phone className="h-4 w-4" />
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
                          className="bg-green-600 hover:bg-green-700"
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
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No patients in queue</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
