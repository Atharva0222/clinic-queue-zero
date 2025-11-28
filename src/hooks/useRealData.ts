import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Doctor {
  id: string;
  user_id: string;
  name: string;
  specialization: string;
  experience: number;
  rating: number;
  consultation_time: number;
  status: 'available' | 'busy' | 'away';
  avatar?: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  date: string;
  time_slot: string;
  status: 'booked' | 'in-progress' | 'completed' | 'cancelled';
  queue_position?: number;
  estimated_wait_time?: number;
  symptoms?: string;
}

export interface QueueItem {
  id: string;
  appointment_id: string;
  patient_name: string;
  time_slot: string;
  status: 'waiting' | 'in-progress' | 'completed';
  estimated_time?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  timestamp: string;
  read: boolean;
}

export const useRealData = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch doctors with profile info
        const { data: doctorsData } = await supabase
          .from('doctors')
          .select(`
            *,
            profiles!doctors_user_id_fkey(name, avatar)
          `);

        if (doctorsData) {
          const formattedDoctors = doctorsData.map((doc: any) => ({
            id: doc.id,
            user_id: doc.user_id,
            name: doc.profiles?.name || 'Doctor',
            specialization: doc.specialization,
            experience: doc.experience,
            rating: parseFloat(doc.rating),
            consultation_time: doc.consultation_time,
            status: doc.status,
            avatar: doc.profiles?.avatar
          }));
          setDoctors(formattedDoctors);
        }

        // Fetch appointments with names
        const { data: appointmentsData } = await supabase
          .from('appointments')
          .select(`
            *,
            patient:profiles!appointments_patient_id_fkey(name),
            doctor:doctors!appointments_doctor_id_fkey(
              id,
              profiles!doctors_user_id_fkey(name)
            )
          `)
          .eq('patient_id', user.id);

        if (appointmentsData) {
          const formattedAppointments = appointmentsData.map((apt: any) => ({
            id: apt.id,
            patient_id: apt.patient_id,
            patient_name: apt.patient?.name || 'Patient',
            doctor_id: apt.doctor_id,
            doctor_name: apt.doctor?.profiles?.name || 'Doctor',
            date: apt.date,
            time_slot: apt.time_slot,
            status: apt.status,
            queue_position: apt.queue_position,
            estimated_wait_time: apt.estimated_wait_time,
            symptoms: apt.symptoms
          }));
          setAppointments(formattedAppointments);
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
          const formattedQueue = queueData.map((item: any) => ({
            id: item.id,
            appointment_id: item.appointment_id,
            patient_name: item.appointment?.patient?.name || 'Patient',
            time_slot: item.appointment?.time_slot || '',
            status: item.status,
            estimated_time: item.estimated_time
          }));
          setQueue(formattedQueue);
        }

        // Fetch notifications
        const { data: notificationsData } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (notificationsData) {
          const formattedNotifications = notificationsData.map((notif: any) => ({
            id: notif.id,
            title: notif.title,
            message: notif.message,
            type: notif.type,
            timestamp: notif.created_at,
            read: notif.read
          }));
          setNotifications(formattedNotifications);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up realtime subscriptions
    const appointmentsChannel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `patient_id=eq.${user.id}`
        },
        () => fetchData()
      )
      .subscribe();

    const notificationsChannel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        () => fetchData()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(appointmentsChannel);
      supabase.removeChannel(notificationsChannel);
    };
  }, [user]);

  return {
    doctors,
    appointments,
    queue,
    notifications,
    loading,
    setAppointments,
    setQueue,
    setNotifications
  };
};
