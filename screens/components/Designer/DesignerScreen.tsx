import React from 'react';
import { ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Button, ButtonText, ButtonIcon } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Input, InputField } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { FacebookIcon, ArrowRightIcon, HeartIcon, Palette } from 'lucide-react-native'; // Using Palette as a placeholder for Designer theme
// Assuming LinearGradient is kept, otherwise, this import would be removed.
// import LinearGradient from 'react-native-linear-gradient';

// --- Login Card Component ---
const LoginCard: React.FC = () => {
  return (
    <Card className="p-5 w-full mb-5 bg-background-0">
        <HStack className="justify-between items-center mb-4">
            <Text className="text-sm font-bold text-typography-900">DESIGNER MARYAM</Text>
            <Button variant="link">
                <ButtonText className="text-sm text-typography-600">SIGN UP</ButtonText>
            </Button>
        </HStack>
        <Text className="text-2xl font-bold text-typography-900 mb-4">LOG IN</Text>
        <VStack space="md" className="mb-4">
            <Input>
                <InputField placeholder="e-mail address" />
            </Input>
            <Input>
                <InputField placeholder="password" secureTextEntry />
            </Input>
        </VStack>
        <HStack className="justify-between items-center mb-4">
            <Text className="text-xs text-typography-500">Please consume responsibly.</Text>
            <Button className="rounded-full w-12 h-12 bg-typography-700">
                <ButtonIcon as={ArrowRightIcon} color="$white" />
            </Button>
        </HStack>
        <Button variant="outline" action="secondary" className="mt-2">
             <ButtonIcon as={FacebookIcon} className="text-blue-600 mr-2" />
            <ButtonText className="text-blue-600">Login with Facebook</ButtonText>
        </Button>
    </Card>
  );
};

// --- Event Card Component ---
const EventCard: React.FC = () => {
  // Placeholder for LinearGradient effect if library is used
  // const GradientCircle = () => <LinearGradient colors={['#ffffff00', '#4A90E2']} style={{position: 'absolute', width: 150, height: 150, borderRadius: 75, right: 20, top: 20}} />;

  return (
    <Card className="p-5 w-full mb-5 bg-background-0 relative overflow-hidden">
        <VStack space="xs">
            <Text className="text-base font-bold text-typography-800">Wed</Text>
            <Text className="text-5xl font-bold text-typography-900">17th</Text>
            <Text className="text-base text-typography-600">18 PM</Text>
            <Text className="text-base text-typography-800">Oxford Street</Text>
            <Text className="text-base text-typography-800">London</Text>
        </VStack>
        {/* <GradientCircle /> Placeholder */}
        <Box className="absolute w-36 h-36 rounded-full bg-blue-200 opacity-50 right-5 top-5" />
        <Text className="absolute right-[-25px] top-[70px] text-sm text-typography-600 transform -rotate-90">Grand opening</Text>
        <Text className="absolute right-[-15px] top-[120px] text-xs text-typography-600 transform -rotate-90">New store</Text>
    </Card>
  );
};

// --- New In Card Component ---
const NewInCard: React.FC = () => {
  return (
    <Card className="p-5 w-full bg-typography-900">
        <HStack className="justify-between items-center">
            <VStack>
                <Text className="text-2xl font-bold text-background-0">NEW IN</Text>
                <Text className="text-sm text-typography-400">DESIGNER MARYAM</Text>
            </VStack>
            <HStack space="md" className="items-center">
                <Icon as={HeartIcon} size="md" color="$white" />
                <Button size="sm" className="bg-background-950 rounded-full px-5">
                    <ButtonText className="text-background-0 text-sm">JOIN</ButtonText>
                </Button>
            </HStack>
        </HStack>
    </Card>
  );
};

// --- Main Designer Screen ---
const DesignerScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-orange-50">
        {/* Background decorative elements can be added here if needed */}
        <Box className="p-5 flex-1 justify-center items-center">
            {/* Simplified background elements - replace with actual implementation if needed */}
            {/* <Box className="absolute w-36 h-36 rounded-full bg-neutral-300 bottom-12 left-5 opacity-70" />
            <Box className="absolute w-24 h-24 rounded-full bg-blue-200 bottom-24 right-12 opacity-80" />
            <Box className="absolute w-16 h-16 rounded-full bg-yellow-200 bottom-8 right-24 opacity-60" /> */}

            <LoginCard />
            <EventCard />
            <NewInCard />
        </Box>
    </ScrollView>
  );
};

export default DesignerScreen; 