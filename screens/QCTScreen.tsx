import React from "react";
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	View,
	useColorScheme,
	Pressable,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { useNavigation } from '@react-navigation/native';
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { 
	User, 
	Code2, 
	Briefcase, 
	MessageSquare, 
	Map, 
	Brain, 
	Settings,
	HelpCircle,
	BookOpen,
	Users2,
	Hash,
	LifeBuoy
} from 'lucide-react-native';

const QCTSection: React.FC<{
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

function QCTScreen(): React.JSX.Element {
	const navigation = useNavigation();
	const isDarkMode = useColorScheme() === "dark";
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};

	return (
		<SafeAreaView style={backgroundStyle}>
			<StatusBar
				barStyle={isDarkMode ? "light-content" : "dark-content"}
				backgroundColor={backgroundStyle.backgroundColor}
			/>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={backgroundStyle}
				className="p-4"
			>
				<View
					style={{
						backgroundColor: isDarkMode ? Colors.black : Colors.white,
					}}
					className="rounded-lg"
				>
					<Box className="p-4">
						<Text className="text-2xl font-bold mb-6">SympathyWorld</Text>
						
						<QCTSection
							icon={<User className="text-primary-600" size={24} />}
							title="Profil Utilisateur"
							description="Gérez votre profil et vos informations personnelles"
							onPress={() => navigation.navigate('User')}
						/>

						<QCTSection
							icon={<Code2 className="text-primary-600" size={24} />}
							title="Programmes"
							description="Découvrez et suivez des programmes personnalisés"
							onPress={() => navigation.navigate('Programs')}
						/>

						<QCTSection
							icon={<Briefcase className="text-primary-600" size={24} />}
							title="Espace Pro"
							description="Accédez à votre espace professionnel"
							onPress={() => navigation.navigate('Pro')}
						/>

						<QCTSection
							icon={<MessageSquare className="text-primary-600" size={24} />}
							title="Chats"
							description="Gérez vos conversations et discussions"
							onPress={() => navigation.navigate('ChatList')}
						/>

						<QCTSection
							icon={<Map className="text-primary-600" size={24} />}
							title="Carte"
							description="Explorez la carte et trouvez des ressources près de vous"
							onPress={() => navigation.navigate('Map')}
						/>

						<QCTSection
							icon={<Brain className="text-primary-600" size={24} />}
							title="MoodLab"
							description="Analysez et suivez votre bien-être émotionnel"
							onPress={() => navigation.navigate('MoodLab')}
						/>

						<QCTSection
							icon={<Settings className="text-primary-600" size={24} />}
							title="Paramètres"
							description="Personnalisez votre expérience"
							onPress={() => navigation.navigate('Settings')}
						/>

						<QCTSection
							icon={<HelpCircle className="text-primary-600" size={24} />}
							title="Aide"
							description="Trouvez des réponses à vos questions"
							onPress={() => navigation.navigate('Help')}
						/>
					</Box>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

export default QCTScreen;
