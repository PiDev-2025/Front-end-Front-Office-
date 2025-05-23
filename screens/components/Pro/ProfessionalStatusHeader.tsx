import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Box,
  Text,
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  HStack,
  VStack,
  Icon,
  Pressable,
} from '@/components/ui';
import { Building2 } from 'lucide-react-native';

interface ProfessionalStatusHeaderProps {
  doctorName?: string;
  specialty?: string;
  hospitalAddress?: string;
  avatarUri?: string;
  isOnline?: boolean;
  onToggleStatus?: (status: boolean) => void;
}

export default function ProfessionalStatusHeader({
  doctorName = "Dr. Marta Diaz",
  specialty = "Cardiologist",
  hospitalAddress = "Eastbrook Memorial Hospital, N. O'Connor Road, Apt. 741",
  avatarUri,
  isOnline = false,
  onToggleStatus,
}: ProfessionalStatusHeaderProps) {
  const [online, setOnline] = useState(isOnline);

  const handleToggle = () => {
    const newStatus = !online;
    setOnline(newStatus);
    onToggleStatus?.(newStatus);
  };

  return (
    <Box style={styles.container}>
      <LinearGradient
        colors={['rgb(0, 71, 107)', 'rgb(10, 74, 214)', 'rgb(88, 75, 207)']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Box style={styles.card}>
        <VStack space="md">
          {/* Top Section: Avatar, Name/Specialty, Status Toggle */}
          <HStack className="items-start justify-between">
            <HStack className="items-start" space="md">
              {/* Avatar */}
              <Box style={styles.avatarContainer}>
                <Avatar 
                  size="sm" 
                  className="rounded-full"
                  style={styles.avatar}
                >
                  <AvatarFallbackText style={{ color: '#ffffff' }}>
                    {doctorName.substring(3, 5)}
                  </AvatarFallbackText>
                  {avatarUri && <AvatarImage alt={doctorName} source={{ uri: avatarUri }} />}
                </Avatar>
              </Box>

              <VStack space="xs">
                {/* Doctor Name */}
                <Text 
                  className="font-semibold text-base"
                  style={styles.doctorName}
                >
                  {doctorName}
                </Text>
                {/* Specialty */}
                <Text 
                  className="text-sm"
                  style={styles.specialty}
                >
                  {specialty}
                </Text>
              </VStack>
            </HStack>

            {/* Status and Toggle */}
            <HStack className="items-center" space="sm">
              <Text 
                className="text-sm"
                style={styles.statusText}
              >
                {online ? 'Online' : 'Offline'}
              </Text>
              
              {/* Custom Switch Toggle */}
              <Pressable
                onPress={handleToggle}
                className="rounded-full flex-row items-center"
                style={[
                  styles.toggleContainer,
                  { backgroundColor: online ? 'rgb(7, 197, 211)' : '#ffffff20' }
                ]}
              >
                <Box 
                  style={[
                    styles.toggleButton,
                    {
                      marginLeft: online ? 'auto' : 0,
                      marginRight: online ? 0 : 'auto',
                    }
                  ]} 
                />
              </Pressable>
            </HStack>
          </HStack>

          {/* Separator Line */}
          <Box style={styles.separator} />

          {/* Bottom Section: Building Icon + Address */}
          <HStack className="items-center" space="md">
            <Icon 
              as={Building2} 
              size="sm"
              style={styles.buildingIcon}
            />
            <Text 
              className="text-sm flex-1"
              style={styles.addressText}
              numberOfLines={1}
            >
              {hospitalAddress}
            </Text>
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
    borderRadius: 12,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    padding: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  avatarContainer: {
    padding: 4,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatar: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgb(7, 197, 211)',
    borderWidth: 2,
  },
  doctorName: {
    color: '#ffffff',
  },
  specialty: {
    color: 'rgb(255, 113, 230)',
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  toggleContainer: {
    width: 44,
    height: 24,
    paddingHorizontal: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  toggleButton: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 4,
  },
  buildingIcon: {
    color: 'rgb(116, 220, 234)',
  },
  addressText: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
});