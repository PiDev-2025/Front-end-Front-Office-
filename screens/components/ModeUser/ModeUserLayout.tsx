import React from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Card } from '@/components/ui/card';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { 
  Palette, 
  BookOpen, 
  UserCog 
} from 'lucide-react-native';

type RootStackParamList = {
  ModeUserThemes: undefined;
  ModeUserQuizzes: undefined;
  ModeUserSettings: undefined;
};

const ModeUserLayout: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const ModeSection: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onPress: () => void;
  }> = ({ icon, title, description, onPress }) => {
    return (
      <Pressable 
        onPress={onPress}
        className="active:opacity-70"
      >
        <Card className="p-4 mb-4 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <HStack space="md" className="items-center">
            <Box className="w-14 h-14 rounded-full bg-primary-50 items-center justify-center">
              {icon}
            </Box>
            <VStack className="flex-1" space="xs">
              <Text className="text-lg font-semibold text-gray-900">{title}</Text>
              <Text className="text-sm text-gray-500 leading-tight">{description}</Text>
            </VStack>
          </HStack>
        </Card>
      </Pressable>
    );
  };

  return (
    <Box className="flex-1 bg-gray-50">
      <Box className="p-4">
        <VStack space="md" className="mb-6">
          <Text className="text-2xl font-bold text-gray-900">Mode Settings</Text>
          <Text className="text-base text-gray-600">
            Customize your experience with these settings
          </Text>
        </VStack>

        <VStack space="sm">
          <ModeSection
            icon={<Palette className="text-primary-600" size={28} />}
            title="Themes"
            description="Customize your app appearance with different color schemes and styles"
            onPress={() => navigation.navigate('ModeUserThemes')}
          />

          <ModeSection
            icon={<BookOpen className="text-primary-600" size={28} />}
            title="Quizzes"
            description="Manage your quiz settings and preferences"
            onPress={() => navigation.navigate('ModeUserQuizzes')}
          />

          <ModeSection
            icon={<UserCog className="text-primary-600" size={28} />}
            title="Settings"
            description="Configure your mode preferences and behavior"
            onPress={() => navigation.navigate('ModeUserSettings')}
          />
        </VStack>
      </Box>
    </Box>
  );
};

export default ModeUserLayout; 