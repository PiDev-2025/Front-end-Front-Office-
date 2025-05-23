import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Box,
  Text,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Button,
  ButtonText,
  HStack,
  VStack,
  Icon,
  Pressable,
} from '@/components/ui';
import { ClockIcon, MessageCircleIcon } from 'lucide-react-native';

interface UpcomingAppointmentCardProps {
  imageUri?: string;
  name?: string;
  age?: string;
  occupation?: string;
  doctorName?: string;
  timeSlot?: string;
  onReschedule?: () => void;
  onCancel?: () => void;
  onChat?: () => void;
}

export default function UpcomingAppointmentCard({
  imageUri,
  name = "John Hill",
  age = "32",
  occupation = "Office Worker",
  doctorName = "Dr. Brian Thomas",
  timeSlot = "17:00 - 18:00",
  onReschedule,
  onCancel,
  onChat,
}: UpcomingAppointmentCardProps) {
  return (
    <Box style={styles.container}>
      <LinearGradient
        colors={['rgb(7, 197, 211)', 'rgb(116, 220, 234)', 'rgb(88, 75, 207)']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Box style={styles.content}>
        <VStack space="md">
          {/* Top Section */}
          <HStack className="items-start justify-between">
            <HStack className="items-center" space="md">
              {/* Avatar */}
              <Box style={styles.avatarContainer}>
                <Avatar size="md" className="rounded-full" style={styles.avatar}>
                  <AvatarFallbackText style={styles.avatarText}>
                    {name.substring(0, 2)}
                  </AvatarFallbackText>
                  {imageUri && <AvatarImage alt={name} source={{ uri: imageUri }} />}
                </Avatar>
              </Box>

              <VStack space="xs">
                {/* Name */}
                <Text style={styles.nameText}>
                  {name}
                </Text>
                {/* Age */}
                <Text style={styles.secondaryText}>
                  Age: {age}
                </Text>
              </VStack>
            </HStack>

            <VStack space="sm" className="items-end">
              {/* Time Slot Button */}
              <Box style={styles.timeSlotContainer}>
                <HStack className="items-center" space="xs">
                  <Icon as={ClockIcon} style={styles.timeIcon} size="sm" />
                  <Text style={styles.timeText}>
                    {timeSlot}
                  </Text>
                </HStack>
              </Box>

              {/* Chat Icon Button */}
              <Pressable
                onPress={onChat}
                style={styles.chatButton}
              >
                <Icon as={MessageCircleIcon} style={styles.chatIcon} size="sm" />
              </Pressable>
            </VStack>
          </HStack>

          {/* Middle Section */}
          <VStack space="xs">
            <Text style={styles.secondaryText}>
              Occupation: {occupation}
            </Text>
            <Text style={styles.secondaryText}>
              Doctor: {doctorName}
            </Text>
          </VStack>

          {/* Bottom Section */}
          <HStack space="md" className="justify-between">
            {/* Reschedule Button */}
            <Pressable
              onPress={onReschedule}
              style={[styles.actionButton, styles.rescheduleButton]}
            >
              <Text style={styles.actionButtonText}>
                Reschedule
              </Text>
            </Pressable>

            {/* Cancel Button */}
            <Pressable
              onPress={onCancel}
              style={[styles.actionButton, styles.cancelButton]}
            >
              <Text style={styles.actionButtonText}>
                Cancel
              </Text>
            </Pressable>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
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
  },
  avatarContainer: {
    padding: 2,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatar: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgb(255, 113, 230)',
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  timeSlotContainer: {
    backgroundColor: 'rgba(10, 74, 214, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(10, 74, 214, 0.3)',
  },
  timeIcon: {
    color: 'rgb(10, 74, 214)',
  },
  timeText: {
    fontSize: 12,
    color: 'rgb(10, 74, 214)',
    fontWeight: '500',
  },
  chatButton: {
    backgroundColor: 'rgba(252, 227, 92, 0.2)',
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(252, 227, 92, 0.3)',
  },
  chatIcon: {
    color: 'rgb(252, 227, 92)',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rescheduleButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 113, 230, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 113, 230, 0.3)',
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
}); 