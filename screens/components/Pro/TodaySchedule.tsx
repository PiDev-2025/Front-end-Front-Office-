import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Box,
  Text,
  HStack,
  VStack,
  Icon,
  Pressable,
} from '@/components/ui';
import { ChevronRight } from 'lucide-react-native';

interface TodayScheduleProps {
  completedAppointments?: number;
  totalAppointments?: number;
  onPress?: () => void;
}

export default function TodaySchedule({
  completedAppointments = 10,
  totalAppointments = 20,
  onPress,
}: TodayScheduleProps) {
  const completionPercentage = (completedAppointments / totalAppointments) * 100;

  return (
    <Pressable onPress={onPress}>
      <Box style={styles.container}>
        <LinearGradient
          colors={['rgb(88, 75, 207)', 'rgb(82, 112, 240)', 'rgb(10, 74, 214)']}
          style={styles.backgroundGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Cyan accent gradient overlay */}
        <Box style={styles.accentGradientContainer}>
          <LinearGradient
            colors={['rgba(7, 197, 211, 0.3)', 'rgba(7, 197, 211, 0)']}
            style={styles.accentGradient}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 0 }}
          />
        </Box>
        
        <Box style={styles.content}>
          <HStack className="items-center justify-between" style={styles.mainRow}>
            <HStack space="md" className="items-center">
              {/* Statistics */}
              <Text style={styles.statisticsText}>
                {completedAppointments}/{totalAppointments}
              </Text>
              
              {/* Description */}
              <Text style={styles.descriptionText} numberOfLines={1}>
                Appointments Completed Today
              </Text>
            </HStack>

            {/* Chevron Icon */}
            <Icon 
              as={ChevronRight} 
              size="lg"
              style={styles.chevronIcon}
            />
          </HStack>
          
          {/* Progress indicator (optional visual enhancement) */}
          <Box style={styles.progressContainer}>
            <Box style={styles.progressBackground}>
              <Box 
                style={[
                  styles.progressFill,
                  { width: `${completionPercentage}%` }
                ]}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    height: 92,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 18,
  },
  accentGradientContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '60%',
    borderRadius: 18,
    overflow: 'hidden',
  },
  accentGradient: {
    flex: 1,
    borderRadius: 18,
  },
  content: {
    position: 'relative',
    zIndex: 1,
    padding: 20,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    height: '100%',
    justifyContent: 'space-between',
  },
  mainRow: {
    flex: 1,
  },
  statisticsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    lineHeight: 34,
  },
  descriptionText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 22,
  },
  chevronIcon: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'rgb(7, 197, 211)',
    borderRadius: 3,
  },
}); 