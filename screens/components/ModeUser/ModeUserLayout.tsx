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
      <Pressable onPress={onPress}>
        <Card className="p-4 mb-4">
          <HStack space="md" className="items-center">
            <Box className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center">
              {icon}
            </Box>
            <VStack className="flex-1">
              <Text className="text-lg font-semibold">{title}</Text>
              <Text className="text-sm text-gray-500">{description}</Text>
            </VStack>
          </HStack>
        </Card>
      </Pressable>
    );
  };

  return (
    <Box className="flex-1 bg-background">
      <Box className="p-4">
        <Text className="text-2xl font-bold mb-4">Mode Settings</Text>
        <Text className="text-gray-500 mb-6">
          Customize your experience with these settings
        </Text>

        <ModeSection
          icon={<Palette className="text-primary-600" size={24} />}
          title="Themes"
          description="Customize your app appearance"
          onPress={() => navigation.navigate('ModeUserThemes')}
        />

        <ModeSection
          icon={<BookOpen className="text-primary-600" size={24} />}
          title="Quizzes"
          description="Manage your quiz settings"
          onPress={() => navigation.navigate('ModeUserQuizzes')}
        />

        <ModeSection
          icon={<UserCog className="text-primary-600" size={24} />}
          title="Settings"
          description="Configure your mode preferences"
          onPress={() => navigation.navigate('ModeUserSettings')}
        />
      </Box>
    </Box>
  );
};

export default ModeUserLayout; 