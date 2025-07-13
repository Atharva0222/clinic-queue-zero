
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Star, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface BookAppointmentModalProps {
  doctor: any;
  isOpen: boolean;
  onClose: () => void;
}

export const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({ 
  doctor, 
  isOpen, 
  onClose 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [symptoms, setSymptoms] = useState('');

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTimeSlot) {
      toast({
        title: 'Error',
        description: 'Please select date and time slot',
        variant: 'destructive'
      });
      return;
    }

    // Mock booking logic
    toast({
      title: 'Appointment Booked!',
      description: `Your appointment with ${doctor?.name} is confirmed for ${format(selectedDate, 'PPP')} at ${selectedTimeSlot}`,
    });

    onClose();
    setSelectedDate(undefined);
    setSelectedTimeSlot('');
    setSymptoms('');
  };

  if (!doctor) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Book Appointment</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Doctor Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {doctor.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{doctor.name}</h3>
              <p className="text-gray-600">{doctor.specialization}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-amber-500 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{doctor.rating}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600 ml-1">{doctor.consultationTime} min</span>
                </div>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">Select Date</Label>
            <div className="border rounded-lg p-3">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0}
                className="rounded-md"
              />
            </div>
          </div>

          {/* Time Slot Selection */}
          {selectedDate && (
            <div>
              <Label className="text-base font-medium mb-3 block">Select Time Slot</Label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTimeSlot === slot ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTimeSlot(slot)}
                    className="text-xs"
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Symptoms */}
          <div>
            <Label htmlFor="symptoms" className="text-base font-medium mb-3 block">
              Describe your symptoms (optional)
            </Label>
            <Textarea
              id="symptoms"
              placeholder="Please describe your symptoms or reason for visit..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={3}
            />
          </div>

          {/* Booking Summary */}
          {selectedDate && selectedTimeSlot && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Booking Summary</h4>
              <div className="space-y-1 text-sm text-blue-800">
                <p><strong>Doctor:</strong> {doctor.name}</p>
                <p><strong>Date:</strong> {format(selectedDate, 'PPP')}</p>
                <p><strong>Time:</strong> {selectedTimeSlot}</p>
                <p><strong>Duration:</strong> ~{doctor.consultationTime} minutes</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleBookAppointment} className="flex-1">
              Confirm Booking
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
