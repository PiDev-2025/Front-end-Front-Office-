import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAtom } from 'jotai';
import { jwtDecodedAtom } from '../../states/user';
import { ChatCreationForm } from './ChatCreationForm';
import { User, Users, Hash, Briefcase, BookOpen, LifeBuoy, MessageSquare, Plus } from 'lucide-react-native';
import {
	Box,
	Button,
	ButtonText,
	Text,
	VStack,
	HStack,
	Badge,
	BadgeText,
	BadgeIcon,
	AlertDialog,
	AlertDialogBackdrop,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogBody,
	AlertDialogFooter,
} from "../../../components/ui";
import { api } from '../../../libs/api';

interface JwtDecoded {
	ID: string;
	[key: string]: any;
}

interface NavigationProps {
	navigate: (screen: string, params?: {
		room: string;
		usersInRoom: string[];
		type: string;
		name?: string;
		theme?: string;
	}) => void;
	goBack: () => void;
}

interface RouteParams {
	initialType?: 'group' | 'theme' | 'pro';
}

const ChatTypeButton: React.FC<{
	icon: React.ReactNode;
	label: string;
	onPress: () => void;
}> = ({ icon, label, onPress }) => (
	<Button
		variant="outline"
		onPress={onPress}
		className="w-full h-32 flex-col items-center justify-center"
	>
		<Box className="mb-2">{icon}</Box>
		<ButtonText className="text-center">{label}</ButtonText>
	</Button>
);

const NewChat: React.FC = () => {
	const navigation = useNavigation<NavigationProps>();
	const route = useRoute();
	const params = route.params as RouteParams;
	const [jwtDecoded] = useAtom(jwtDecodedAtom) as [JwtDecoded, any];
	const [showForm, setShowForm] = useState(false);
	const [selectedType, setSelectedType] = useState<'group' | 'theme' | 'pro' | null>(null);

	useEffect(() => {
		if (params?.initialType) {
			setSelectedType(params.initialType);
			setShowForm(true);
		}
	}, [params]);

	const handleCreateChat = async (data: {
		type: 'group' | 'theme' | 'pro';
		name?: string;
		description?: string;
		activityType?: string;
		theme?: string;
		professionalType?: string;
		styles?: {
			main_bg?: string;
			other_bubble?: string;
			my_bubble?: string;
		};
	}) => {
		try {
			const response = await api.chat.post({
				name: data.name,
				type: data.type,
				theme: data.theme,
				description: data.description,
				activityType: data.activityType,
				professionalType: data.professionalType,
				styles: data.styles
			});

			if (response?.id) {
				navigation.navigate('Chat', {
					room: response.id,
					usersInRoom: [jwtDecoded.ID],
					type: data.type
				});
			}
		} catch (error) {
			console.error('Error creating chat:', error);
		}
	};

	return (
		<Box className="flex-1 bg-gray-50 p-4">
			<VStack space="md">
				<Text className="text-2xl font-bold mb-4">New Chat</Text>
				
				<HStack space="md" className="flex-wrap">
					<Box className="w-[48%] mb-4">
						<ChatTypeButton
							icon={<Users size={24} />}
							label="Group Chat"
							onPress={() => {
								setSelectedType('group');
								setShowForm(true);
							}}
						/>
					</Box>
					
					<Box className="w-[48%] mb-4">
						<ChatTypeButton
							icon={<Hash size={24} />}
							label="Thematic Chat"
							onPress={() => {
								setSelectedType('theme');
								setShowForm(true);
							}}
						/>
					</Box>
					
					<Box className="w-[48%] mb-4">
						<ChatTypeButton
							icon={<Briefcase size={24} />}
							label="Professional Chat"
							onPress={() => {
								setSelectedType('pro');
								setShowForm(true);
							}}
						/>
					</Box>
				</HStack>
			</VStack>

			<AlertDialog isOpen={showForm} onClose={() => {
				setShowForm(false);
				if (params?.initialType) {
					navigation.goBack();
				}
			}}>
				<AlertDialogBackdrop />
				<AlertDialogContent>
					<AlertDialogHeader>
						<Text className="text-xl font-semibold">
							{selectedType === 'group' && 'Create Group Chat'}
							{selectedType === 'theme' && 'Create Thematic Chat'}
							{selectedType === 'pro' && 'Create Professional Chat'}
						</Text>
					</AlertDialogHeader>
					<AlertDialogBody>
						{selectedType && (
							<ChatCreationForm
								type={selectedType}
								onClose={() => {
									setShowForm(false);
									if (params?.initialType) {
										navigation.goBack();
									}
								}}
								onSubmit={handleCreateChat}
							/>
						)}
					</AlertDialogBody>
				</AlertDialogContent>
			</AlertDialog>
		</Box>
	);
};

export default NewChat;
