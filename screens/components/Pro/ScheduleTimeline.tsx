import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Box,
  Text,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  HStack,
  VStack,
} from '@/components/ui';

export type AppointmentStatus = 'completed' | 'cancelled' | 'examining' | 'upcoming';

interface AppointmentItem {
  id: string;
  time: string;
  timeRange: string;
  patientName: string;
  patientImage?: string;
  status: AppointmentStatus;
}

interface ScheduleTimelineProps {
  appointments?: AppointmentItem[];
  currentTime?: string;
  onAppointmentPress?: (appointment: AppointmentItem) => void;
}

const defaultAppointments: AppointmentItem[] = [
  {
    id: '1',
    time: '13:30',
    timeRange: '13:30 - 14:30',
    patientName: 'Grace Nelson',
    status: 'completed',
  },
  {
    id: '2',
    time: '14:30',
    timeRange: '14:30 - 15:00',
    patientName: 'Sarah Williams',
    status: 'completed',
  },
  {
    id: '3',
    time: '15:00',
    timeRange: '15:00 - 16:00',
    patientName: 'Elena Jimenez',
    status: 'cancelled',
  },
  {
    id: '4',
    time: '16:00',
    timeRange: '16:00 - 16:30',
    patientName: 'Javier Sanchez',
    status: 'examining',
  },
  {
    id: '5',
    time: '17:00',
    timeRange: '17:00 - 18:00',
    patientName: 'John Hill',
    status: 'upcoming',
  },
  {
    id: '6',
    time: '18:30',
    timeRange: '18:30 - 19:00',
    patientName: 'Samantha Harris',
    status: 'upcoming',
  },
];

const getStatusConfig = (status: AppointmentStatus) => {
  switch (status) {
    case 'completed':
      return {
        text: 'Completed',
        backgroundColor: 'rgba(49, 151, 77, 0.2)',
        textColor: 'rgb(64, 204, 121)',
        borderColor: 'rgba(64, 204, 121, 0.3)',
      };
    case 'cancelled':
      return {
        text: 'Cancelled',
        backgroundColor: 'rgba(255, 113, 230, 0.2)',
        textColor: 'rgb(255, 113, 230)',
        borderColor: 'rgba(255, 113, 230, 0.3)',
      };
    case 'examining':
      return {
        text: 'Examining',
        backgroundColor: 'rgba(88, 75, 207, 0.2)',
        textColor: 'rgb(173, 187, 238)',
        borderColor: 'rgba(173, 187, 238, 0.3)',
      };
    case 'upcoming':
      return {
        text: 'Upcoming',
        backgroundColor: 'rgba(254, 195, 1, 0.2)',
        textColor: 'rgb(252, 227, 92)',
        borderColor: 'rgba(252, 227, 92, 0.3)',
      };
  }
};

export default function ScheduleTimeline({
  appointments = defaultAppointments,
  currentTime = '16:27',
  onAppointmentPress,
}: ScheduleTimelineProps) {
  const currentTimeIndex = appointments.findIndex(apt => 
    apt.time >= currentTime.substring(0, 5)
  );

  return (
    <Box style={styles.container}>
      <LinearGradient
        colors={['rgb(252, 227, 92)', 'rgb(254, 195, 1)', 'rgb(255, 113, 230)']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Box style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <VStack space="lg">
            {appointments.map((appointment, index) => (
              <Box key={appointment.id}>
                {/* Current Time Indicator */}
                {index === currentTimeIndex && (
                  <Box style={styles.currentTimeContainer}>
                    <Text style={styles.currentTimeText}>
                      {currentTime}
                    </Text>
                    <Box style={styles.currentTimeLine} />
                  </Box>
                )}
                
                <HStack space="md" className="items-start">
                  {/* Time Label */}
                  <Box style={styles.timeColumn}>
                    <Text style={styles.timeLabel}>
                      {appointment.time}
                    </Text>
                  </Box>

                  {/* Appointment Card */}
                  <Box style={styles.appointmentCard}>
                    <Box style={styles.cardContent}>
                      <HStack space="md" className="items-center justify-between">
                        <HStack space="md" className="items-center flex-1">
                          {/* Avatar */}
                          <Box style={styles.avatarContainer}>
                            <Avatar size="md" style={styles.avatar}>
                              <AvatarFallbackText style={styles.avatarText}>
                                {appointment.patientName.substring(0, 2)}
                              </AvatarFallbackText>
                              {appointment.patientImage && (
                                <AvatarImage 
                                  alt={appointment.patientName} 
                                  source={{ uri: appointment.patientImage }} 
                                />
                              )}
                            </Avatar>
                          </Box>

                          {/* Patient Info */}
                          <VStack space="xs" className="flex-1">
                            <Text style={styles.patientName}>
                              {appointment.patientName}
                            </Text>
                            
                            {/* Status Tag */}
                            <Box 
                              style={[
                                styles.statusTag,
                                {
                                  backgroundColor: getStatusConfig(appointment.status).backgroundColor,
                                  borderColor: getStatusConfig(appointment.status).borderColor,
                                }
                              ]}
                            >
                              <Text 
                                style={[
                                  styles.statusText,
                                  { color: getStatusConfig(appointment.status).textColor }
                                ]}
                              >
                                {getStatusConfig(appointment.status).text}
                              </Text>
                            </Box>
                          </VStack>
                        </HStack>

                        {/* Time Range */}
                        <Text style={styles.timeRange}>
                          {appointment.timeRange}
                        </Text>
                      </HStack>
                    </Box>
                  </Box>
                </HStack>
              </Box>
            ))}
          </VStack>
        </ScrollView>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    minHeight: 400,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 16,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    minHeight: 400,
  },
  currentTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: -8,
  },
  currentTimeText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgb(7, 197, 211)',
    marginRight: 8,
    minWidth: 40,
  },
  currentTimeLine: {
    flex: 1,
    height: 2,
    backgroundColor: 'rgb(7, 197, 211)',
    borderRadius: 1,
  },
  timeColumn: {
    width: 50,
    alignItems: 'flex-start',
    paddingTop: 4,
  },
  timeLabel: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.7)',
    fontWeight: '500',
  },
  appointmentCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  cardContent: {
    padding: 12,
  },
  avatarContainer: {
    padding: 2,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgb(255, 170, 240)',
  },
  avatarText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  patientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  statusTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '500',
  },
  timeRange: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.8)',
    fontWeight: '500',
  },
}); 