import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Image, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ElysiaClient, ChatMessage } from 'ts-elysia-client';
import { useAtom } from 'jotai';
import { jwtDecodedAtom } from '../../states/user';
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { MessageSquare, User, Users, MessageCircle, ComponentIcon, HashIcon, UserRoundIcon, TargetIcon, CodeIcon, GlobeIcon, List, PinIcon, Square, UserPlus, Users2, Hash, Briefcase, BookOpen, LifeBuoy, MessageCirclePlus } from 'lucide-react-native';
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Grid, GridItem } from "@/components/ui/grid";
import { Card } from "@/components/ui/card";
import { Center } from "@/components/ui/center";
import {
	AlertDialog,
	AlertDialogBackdrop,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import {
	FormControl,
	FormControlHelper,
	FormControlHelperText,
	FormControlLabel,
	FormControlLabelText,
} from "@/components/ui/form-control";
import {
	Checkbox,
	CheckboxGroup,
	CheckboxIcon,
	CheckboxIndicator,
	CheckboxLabel,
} from "@/components/ui/checkbox";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Heading } from "@/components/ui/heading";

interface Profile {
	id: string;
	name: string;
	picture: string;
	localization_code: string;
	localization_country: string;
	distance: number;
	commonTheme: number;
	mantra: {
		sc: string;
		fr: string;
	};
}

interface ChatRequest {
	intentions: string[];
	message: string;
}

interface JwtDecoded {
	ID: string;
}

type ChatNavigationParams = {
	room: string;
	usersInRoom: { userId2: string }[];
};

type NavigationProp = {
	navigate: (screen: string, params: ChatNavigationParams) => void;
};

const NewChatPopupSelect: React.FC<{ profile: Profile; onSubmit: (request: ChatRequest) => void }> = ({ profile, onSubmit }) => {
	const [values, setValues] = React.useState<string[]>([]);
	const [message, setMessage] = React.useState("");

	const handleSubmit = () => {
		onSubmit({
			intentions: values,
			message
		});
	};

	return (
		<>
			<FormControl>
				<FormControlLabel>
					<FormControlLabelText>
						Selectionner Vos Intentions
					</FormControlLabelText>
				</FormControlLabel>
				<CheckboxGroup
					className="my-2"
					value={values}
					onChange={(keys) => {
						setValues(keys);
					}}
				>
					<VStack space="sm">
						<Checkbox size="sm" value="amical">
							<CheckboxIndicator className="mr-2">
								<CheckboxIcon as={Square} />
							</CheckboxIndicator>
							<CheckboxLabel>Amical</CheckboxLabel>
						</Checkbox>
						<Checkbox size="sm" value="entraide">
							<CheckboxIndicator className="mr-2">
								<CheckboxIcon as={Square} />
							</CheckboxIndicator>
							<CheckboxLabel>Entraide</CheckboxLabel>
						</Checkbox>
						<Checkbox size="sm" value="flirt">
							<CheckboxIndicator className="mr-2">
								<CheckboxIcon as={Square} />
							</CheckboxIndicator>
							<CheckboxLabel>Flirt</CheckboxLabel>
						</Checkbox>
					</VStack>
				</CheckboxGroup>
				<FormControlHelper>
					<FormControlHelperText>
						Votre demande peut-être refusé
					</FormControlHelperText>
				</FormControlHelper>
			</FormControl>
			<FormControl>
				<FormControlLabel>
					<FormControlLabelText>Commentaire</FormControlLabelText>
				</FormControlLabel>
				<Textarea className="min-w-[200px] min-h-[400px]">
					<TextareaInput 
						placeholder="Laissez un message personnalisé qui donnera envie d'accepter votre requete"
						value={message}
						onChangeText={setMessage}
					/>
				</Textarea>
			</FormControl>
			<Button onPress={handleSubmit} className="mt-4">
				<ButtonText>Envoyer</ButtonText>
			</Button>
		</>
	);
};

const NewChatPopup: React.FC<{ profile: Profile; onSubmit: (request: ChatRequest) => void }> = ({ profile, onSubmit }) => {
	const [showAlertDialog, setShowAlertDialog] = React.useState(false);
	const handleClose = () => setShowAlertDialog(false);

	return (
		<>
			<Button onPress={() => setShowAlertDialog(true)}>
				<ButtonText>Parlons!</ButtonText>
			</Button>
			<AlertDialog
				isOpen={showAlertDialog}
				onClose={handleClose}
				size="md"
			>
				<AlertDialogBackdrop />
				<AlertDialogContent>
					<AlertDialogHeader>
						<Heading
							className="text-typography-950 font-semibold"
							size="md"
						>
							Précisez votre demande
						</Heading>
					</AlertDialogHeader>
					<AlertDialogBody className="mt-3 mb-4">
						<NewChatPopupSelect profile={profile} onSubmit={onSubmit} />
					</AlertDialogBody>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

const NewChat_ItemProfile: React.FC<{ profile: Profile }> = ({ profile }) => {
	const navigation = useNavigation<NavigationProp>();
	const [jwtDecoded] = useAtom(jwtDecodedAtom) as [JwtDecoded | null, (value: JwtDecoded | null) => void];
	const apiClient = React.useMemo(() => {
		const client = ElysiaClient.getInstance();
		client.setEnvironment('production');
		return client;
	}, []);

	const handleSubmit = async (request: ChatRequest) => {
		try {
			if (!jwtDecoded?.ID) {
				console.error("jwtDecoded or jwtDecoded.ID is null");
				return;
			}

			const myUserId = jwtDecoded.ID.split(":")[1];
			const response = await apiClient.create1V1Chat(myUserId, profile.id);
			
			const message: ChatMessage = {
				chatId: response.id,
				senderId: myUserId,
				message: request.message,
				createdAt: new Date().toISOString()
			};
			await apiClient.sendMessage(message);

			if (response.id) {
				navigation.navigate('Chat', {
					room: response.id,
					usersInRoom: [{ userId2: profile.id }]
				});
			}
		} catch (error) {
			console.error("Error creating chat:", error);
		}
	};

	return (
		<Box className="justify-center w-full justify-center h-80">
			<Center>
				<VStack className="p-2" space="md" reversed={false}>
					<Card className="p-5 rounded-lg max-w-[360px] m-3">
						<Image
							source={{
								uri: profile.picture,
							}}
							style={{
								marginBottom: 24,
								height: 240,
								width: "100%",
								borderRadius: 8,
								aspectRatio: 4 / 3,
							}}
						/>
						<VStack className="mb-6">
							<Center>
								<Heading size="md" className="mb-2">
									{profile.name}
								</Heading>
								<Text size="sm">{profile.mantra.fr}</Text>
							</Center>
						</VStack>
						<Grid className="gap-2 mb-6" _extra={{ className: "grid-cols-2" }}>
							<Badge size="md" variant="solid" action="success">
								<BadgeIcon as={CodeIcon} className="ml-2" />
								<BadgeText className="ml-4">
									{profile.localization_code}
								</BadgeText>
							</Badge>
							<Badge size="md" variant="solid" action="warning">
								<BadgeIcon as={GlobeIcon} className="ml-2" />
								<BadgeText>
									{profile.localization_country}
								</BadgeText>
							</Badge>
							<Badge size="md" variant="solid" action="info">
								<BadgeIcon as={PinIcon} className="ml-2" />
								<BadgeText>{profile.distance} km</BadgeText>
							</Badge>
							<Badge size="md" variant="solid" action="error">
								<BadgeIcon as={List} className="ml-2" />
								<BadgeText>
									{profile.commonTheme} / 6 Thèmes
								</BadgeText>
							</Badge>
						</Grid>
						<Box className="flex-col sm:flex-row">
							<NewChatPopup profile={profile} onSubmit={handleSubmit} />
						</Box>
					</Card>
				</VStack>
			</Center>
		</Box>
	);
};

const ChatSection: React.FC<{
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
					<MessageCirclePlus className="text-gray-400" />
				</HStack>
			</Card>
		</Pressable>
	);
};

export default function NewChat(): React.JSX.Element {
	const navigation = useNavigation<NavigationProp>();
	const [jwtDecoded] = useAtom(jwtDecodedAtom) as [JwtDecoded | null, (value: JwtDecoded | null) => void];
	const [profiles, setProfiles] = useState<Profile[]>([]);
	const apiClient = React.useMemo(() => {
		const client = ElysiaClient.getInstance();
		client.setEnvironment('production');
		return client;
	}, []);

	useEffect(() => {
		loadProfiles();
	}, []);

	const loadProfiles = async () => {
		try {
			if (!jwtDecoded?.ID) {
				console.error("jwtDecoded or jwtDecoded.ID is null");
				return;
			}

			const myUserId = jwtDecoded.ID.split(":")[1];
			const response = await apiClient.getUserInformation();
			const filteredProfiles = response
				.filter(user => user.user_id !== myUserId)
				.map(user => ({
					id: user.user_id,
					name: "User " + user.user_id,
					picture: user.pictures_public[0] || "https://via.placeholder.com/150",
					localization_code: user.localization_code.toString(),
					localization_country: user.localization_country,
					distance: 0,
					commonTheme: user.themes.length,
					mantra: {
						sc: "",
						fr: ""
					}
				}));
			setProfiles(filteredProfiles);
		} catch (error) {
			console.error("Error loading profiles:", error);
		}
	};

	return (
		<Box className="flex-1 bg-white">
			<ScrollView className="flex-1 p-4">
				<ChatSection
					icon={<UserPlus className="text-primary-600" size={24} />}
					title="Chat 1v1"
					description="Discutez en privé avec un utilisateur"
					onPress={() => navigation.navigate('NewChat1v1', { room: '', usersInRoom: [] })}
				/>

				<ChatSection
					icon={<Users2 className="text-primary-600" size={24} />}
					title="Groupe de discussion"
					description="Créez ou rejoignez un groupe de discussion"
					onPress={() => navigation.navigate('NewGroupChat', { room: '', usersInRoom: [] })}
				/>

				<ChatSection
					icon={<Hash className="text-primary-600" size={24} />}
					title="Chat thématique"
					description="Participez à des discussions sur des thèmes spécifiques"
					onPress={() => navigation.navigate('NewThemeChat', { room: '', usersInRoom: [] })}
				/>

				<ChatSection
					icon={<Briefcase className="text-primary-600" size={24} />}
					title="Chat professionnel"
					description="Échangez avec des professionnels"
					onPress={() => navigation.navigate('NewProChat', { room: '', usersInRoom: [] })}
				/>

				<ChatSection
					icon={<BookOpen className="text-primary-600" size={24} />}
					title="Chat dédié"
					description="Accédez à des ressources spécifiques et échangez avec des experts"
					onPress={() => navigation.navigate('NewDedicatedChat', { room: '', usersInRoom: [] })}
				/>

				<ChatSection
					icon={<LifeBuoy className="text-primary-600" size={24} />}
					title="Support"
					description="Obtenez de l'aide et des réponses à vos questions"
					onPress={() => navigation.navigate('NewSupportChat', { room: '', usersInRoom: [] })}
				/>

				<Box className="h-20" /> {/* Spacer for bottom button */}
			</ScrollView>

			<Box className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
				<Button
					variant="solid"
					size="lg"
					className="w-full"
					onPress={() => navigation.navigate('NewChat1v1', { room: '', usersInRoom: [] })}
				>
					<ButtonText>Nouvelle Conversation</ButtonText>
				</Button>
			</Box>
		</Box>
	);
}

const styles = StyleSheet.create({
	listContent: {
		paddingTop: 16,
	},
});
