
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'compounder';
  phone?: string;
  specialization?: string; // for doctors
  experience?: number; // for doctors
  avatar?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  consultationTime: number; // in minutes
  avatar?: string;
  status: 'available' | 'busy' | 'away';
  nextAvailable?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  status: 'booked' | 'in-progress' | 'completed' | 'cancelled';
  queuePosition?: number;
  estimatedWaitTime?: number;
  symptoms?: string;
  notes?: string;
}

export interface QueueItem {
  id: string;
  appointmentId: string;
  patientName: string;
  timeSlot: string;
  status: 'waiting' | 'in-progress' | 'completed';
  estimatedTime?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
}
