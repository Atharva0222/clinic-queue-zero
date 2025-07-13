
import { useState, useEffect } from 'react';
import { Doctor, Appointment, QueueItem, Notification } from '@/types';

export const useMockData = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Mock doctors data
    const mockDoctors: Doctor[] = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialization: 'Cardiology',
        experience: 8,
        rating: 4.8,
        consultationTime: 20,
        status: 'available'
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        specialization: 'Pediatrics',
        experience: 12,
        rating: 4.9,
        consultationTime: 15,
        status: 'busy'
      },
      {
        id: '3',
        name: 'Dr. Emily Rodriguez',
        specialization: 'Dermatology',
        experience: 6,
        rating: 4.7,
        consultationTime: 25,
        status: 'available'
      },
      {
        id: '4',
        name: 'Dr. James Wilson',
        specialization: 'Orthopedics',
        experience: 15,
        rating: 4.6,
        consultationTime: 30,
        status: 'away'
      }
    ];

    // Mock appointments
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patientId: 'p1',
        patientName: 'John Doe',
        doctorId: '1',
        doctorName: 'Dr. Sarah Johnson',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '10:00 AM',
        status: 'booked',
        queuePosition: 2,
        estimatedWaitTime: 25
      },
      {
        id: '2',
        patientId: 'p2',
        patientName: 'Jane Smith',
        doctorId: '2',
        doctorName: 'Dr. Michael Chen',
        date: new Date().toISOString().split('T')[0],
        timeSlot: '11:30 AM',
        status: 'in-progress'
      }
    ];

    // Mock queue
    const mockQueue: QueueItem[] = [
      {
        id: '1',
        appointmentId: '1',
        patientName: 'John Doe',
        timeSlot: '10:00 AM',
        status: 'waiting',
        estimatedTime: 25
      },
      {
        id: '2',
        appointmentId: '3',
        patientName: 'Alice Brown',
        timeSlot: '10:20 AM',
        status: 'waiting',
        estimatedTime: 45
      }
    ];

    // Mock notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Appointment Reminder',
        message: 'Your appointment with Dr. Sarah Johnson is in 30 minutes',
        type: 'info',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: '2',
        title: 'Doctor Delayed',
        message: 'Dr. Michael Chen is running 15 minutes late',
        type: 'warning',
        timestamp: new Date().toISOString(),
        read: false
      }
    ];

    setDoctors(mockDoctors);
    setAppointments(mockAppointments);
    setQueue(mockQueue);
    setNotifications(mockNotifications);
  }, []);

  return {
    doctors,
    appointments,
    queue,
    notifications,
    setAppointments,
    setQueue,
    setNotifications
  };
};
