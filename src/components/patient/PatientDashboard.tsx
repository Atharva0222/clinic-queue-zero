
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Bell, Search, Star, User, MapPin } from 'lucide-react';
import { useMockData } from '@/hooks/useMockData';
import { useAuth } from '@/contexts/AuthContext';
import { BookAppointmentModal } from './BookAppointmentModal';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const { doctors, appointments, notifications } = useMockData();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const myAppointments = appointments.filter(apt => apt.patientName === 'John Doe'); // Mock filter
  const unreadNotifications = notifications.filter(n => !n.read);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'away': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case 'booked': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600">Manage your appointments and health</p>
          </div>
          <div className="relative">
            <Button variant="outline" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              {unreadNotifications.length > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadNotifications.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Next Appointment</p>
                <p className="font-semibold">Today 10:00 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Wait Time</p>
                <p className="font-semibold">25 mins</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Appointments */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            My Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {myAppointments.length > 0 ? (
            <div className="space-y-3">
              {myAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{appointment.doctorName}</p>
                      <p className="text-sm text-gray-600">{appointment.date} at {appointment.timeSlot}</p>
                      {appointment.queuePosition && (
                        <p className="text-xs text-blue-600">Queue position: #{appointment.queuePosition}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getAppointmentStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                    {appointment.estimatedWaitTime && (
                      <p className="text-xs text-gray-600 mt-1">~{appointment.estimatedWaitTime} mins</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No appointments scheduled</p>
              <Button className="mt-3" onClick={() => setIsBookingOpen(true)}>
                Book Appointment
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Doctors */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Available Doctors
            </CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {doctors.slice(0, 3).map((doctor) => (
              <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {doctor.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold">{doctor.name}</h3>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-warning fill-current" />
                        <span className="text-xs text-gray-600 ml-1">{doctor.rating}</span>
                      </div>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600">{doctor.experience} years</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(doctor.status)}>
                    {doctor.status}
                  </Badge>
                  <div className="mt-2">
                    <Button 
                      size="sm"
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
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Book Appointment Modal */}
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
