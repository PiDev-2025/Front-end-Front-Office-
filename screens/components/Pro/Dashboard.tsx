import React from 'react';
import { ScrollView } from 'react-native';
import { VStack } from '@/components/ui';
import ProfessionalStatusHeader from './ProfessionalStatusHeader';
import TodaySchedule from './TodaySchedule';
import UpcomingAppointmentCard from './UpcomingAppointmentCard';
import ScheduleTimeline from './ScheduleTimeline';

interface DashboardProps {
  onToggleStatus?: (status: boolean) => void;
  onSchedulePress?: () => void;
  onReschedule?: () => void;
  onCancel?: () => void;
  onChat?: () => void;
}

export default function Dashboard({
  onToggleStatus,
  onSchedulePress,
  onReschedule,
  onCancel,
  onChat,
}: DashboardProps) {
  const handleStatusToggle = (isOnline: boolean) => {
    console.log('Status changed:', isOnline ? 'Online' : 'Offline');
  };

  const handleReschedule = () => {
    console.log('Reschedule appointment');
  };

  const handleCancel = () => {
    console.log('Cancel appointment');
  };

  const handleChat = () => {
    console.log('Open chat');
  };

  const handleTodaySchedulePress = () => {
    console.log('Today schedule pressed');
  };

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <VStack space="lg" className="p-4">
        <ProfessionalStatusHeader onToggleStatus={onToggleStatus} />
        <TodaySchedule onPress={onSchedulePress} />
        <UpcomingAppointmentCard 
          onReschedule={onReschedule}
          onCancel={onCancel}
          onChat={onChat}
        />
        <ScheduleTimeline />
      </VStack>
    </ScrollView>
  );
}
