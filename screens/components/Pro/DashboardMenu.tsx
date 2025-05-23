import React from 'react';
import { StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Box,
  Text,
  VStack,
  Pressable,
  Icon,
  HStack,
} from '@/components/ui';
import { LayoutDashboard, Calendar, Users, Settings, Bell } from 'lucide-react-native';

interface DashboardMenuProps {
  onDashboardPress?: () => void;
  onCalendarPress?: () => void;
  onPatientsPress?: () => void;
  onSettingsPress?: () => void;
  onNotificationsPress?: () => void;
}

interface MenuItemProps {
  icon: any;
  title: string;
  subtitle: string;
  onPress?: () => void;
  isPrimary?: boolean;
}

function MenuItem({ icon, title, subtitle, onPress, isPrimary = false }: MenuItemProps) {
  return (
    <Pressable onPress={onPress} style={styles.menuItemPressable}>
      <Box style={[styles.menuItem, isPrimary && styles.primaryMenuItem]}>
        <LinearGradient
          colors={isPrimary ? ['#6369E8', '#8B7CF6'] : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']}
          style={styles.menuItemGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        <Box style={styles.menuItemContent}>
          <HStack space="md" className="items-center flex-1">
            <Box style={[styles.iconContainer, isPrimary && styles.primaryIconContainer]}>
              <Icon 
                as={icon} 
                size="lg" 
                style={[styles.menuIcon, isPrimary && styles.primaryMenuIcon]} 
              />
            </Box>
            
            <VStack space="xs" className="flex-1">
              <Text style={[styles.menuTitle, isPrimary && styles.primaryMenuTitle]}>
                {title}
              </Text>
              <Text style={[styles.menuSubtitle, isPrimary && styles.primaryMenuSubtitle]}>
                {subtitle}
              </Text>
            </VStack>
          </HStack>
        </Box>
      </Box>
    </Pressable>
  );
}

export default function DashboardMenu({
  onDashboardPress,
  onCalendarPress,
  onPatientsPress,
  onSettingsPress,
  onNotificationsPress,
}: DashboardMenuProps) {
  return (
    <Box style={styles.container}>
      <LinearGradient
        colors={['#1a1c2e', '#2d1b3d', '#1f2937']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <Box style={styles.content}>
        <VStack space="lg">
          {/* Header */}
          <VStack space="md" className="items-center">
            <Text style={styles.headerTitle}>
              Professional Portal
            </Text>
            <Text style={styles.headerSubtitle}>
              Manage your practice efficiently
            </Text>
          </VStack>

          {/* Menu Items */}
          <VStack space="md">
            <MenuItem
              icon={LayoutDashboard}
              title="Dashboard"
              subtitle="View overview and quick actions"
              onPress={onDashboardPress}
              isPrimary={true}
            />
            
            <MenuItem
              icon={Calendar}
              title="Schedule"
              subtitle="Manage appointments and availability"
              onPress={onCalendarPress}
            />
            
            <MenuItem
              icon={Users}
              title="Patients"
              subtitle="Patient records and history"
              onPress={onPatientsPress}
            />
            
            <MenuItem
              icon={Bell}
              title="Notifications"
              subtitle="Updates and alerts"
              onPress={onNotificationsPress}
            />
            
            <MenuItem
              icon={Settings}
              title="Settings"
              subtitle="Preferences and configuration"
              onPress={onSettingsPress}
            />
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    position: 'relative',
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  menuItemPressable: {
    borderRadius: 12,
  },
  menuItem: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  primaryMenuItem: {
    shadowColor: '#6369E8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  menuItemGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  menuItemContent: {
    position: 'relative',
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  menuIcon: {
    color: 'rgba(255, 255, 255, 0.8)',
    width: 20,
    height: 20,
  },
  primaryMenuIcon: {
    color: '#ffffff',
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
  },
  primaryMenuTitle: {
    color: '#ffffff',
  },
  menuSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
  },
  primaryMenuSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
}); 