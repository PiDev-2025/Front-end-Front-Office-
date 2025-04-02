import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ElysiaClient, ChatMessage } from 'ts-elysia-client';
import { useAtom } from 'jotai';
import { jwtDecodedAtom } from '../../states/user';
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { MessageSquare, User, Users, MessageCircle, ComponentIcon, HashIcon, UserRoundIcon, TargetIcon, CodeIcon, GlobeIcon, List, PinIcon, Square } from 'lucide-react-native';
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

export default function NewChat(): React.JSX.Element {
	const [jwtDecoded] = useAtom(jwtDecodedAtom) as [JwtDecoded | null, (value: JwtDecoded | null) => void];
	const [searchQuery, setSearchQuery] = useState("");
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
			// Filter out the current user and transform the response to match our Profile type
			const filteredProfiles = response
				.filter(user => user.user_id !== myUserId)
				.map(user => ({
					id: user.user_id,
					name: "User " + user.user_id,
					picture: user.pictures_public[0] || "https://via.placeholder.com/150",
					localization_code: user.localization_code.toString(),
					localization_country: user.localization_country,
					distance: 0, // This would need to be calculated based on user locations
					commonTheme: user.themes.length, // Using the number of themes as a proxy for common themes
					mantra: {
						sc: "",
						fr: "" // No mantra in UserInformation
					}
				}));
			setProfiles(filteredProfiles);
		} catch (error) {
			console.error("Error loading profiles:", error);
		}
	};

	const filteredProfiles = profiles.filter(profile =>
		profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
		profile.localization_code.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<Box className="flex-1 bg-white p-4">
			<Text className="text-xl mb-4">{jwtDecoded?.ID}</Text>
			<TextInput
				className="border border-gray-300 rounded-md p-2 mb-4"
				placeholder="Rechercher un contact"
				placeholderTextColor="rgba(145, 145, 145, 1)"
				value={searchQuery}
				onChangeText={setSearchQuery}
			/>
			<ScrollView>
				{filteredProfiles.map((profile) => (
					<NewChat_ItemProfile key={profile.id} profile={profile} />
				))}
			</ScrollView>
		</Box>
	);
}

const styles = StyleSheet.create({
	listContent: {
		paddingTop: 16,
	},
});
