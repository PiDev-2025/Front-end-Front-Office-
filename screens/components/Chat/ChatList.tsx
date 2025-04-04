import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Pressable, RefreshControl, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ElysiaClient, Chat } from 'ts-elysia-client';
import { ChatGroup } from 'ts-elysia-client/src/client';
import { useAtom } from 'jotai';
import { jwtDecodedAtom } from '../../states/user';
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { MessageSquare, User, Users, MessageCircle, ComponentIcon, HashIcon, UserRoundIcon, TargetIcon, UserPlus, Users2, Hash, Briefcase, BookOpen, LifeBuoy } from 'lucide-react-native';
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Grid, GridItem } from "@/components/ui/grid";
import { Input, InputField } from "@/components/ui/input";
import { ChatListItemProps } from "./types";

type RootStackParamList = {
	Chat: {
		room: string;
		usersInRoom: Array<{
			userId2: string;
		}>;
	};
};

type NavigationProp = {
	navigate: (screen: keyof RootStackParamList, params?: any) => void;
};

// Type for the actual API response
type UserChatResponse = {
	room: string;
	usersInRoom: Array<{
		userId2: string;
	}>;
	type?: '1v1' | 'group' | 'thematic' | 'professional';
	name?: string;
	theme?: string;
	lastMessage?: string;
	messageCount?: number;
	activityType?: string;
	professionalType?: string;
	rating?: number;
};

const client = ElysiaClient.getInstance();

const RoomItem: React.FC<{ item: UserChatResponse & { myUserId: string } }> = ({ item }) => {
	const navigation = useNavigation<NavigationProp>();
	const { room, usersInRoom } = item;

	const goToChat = () => {
		navigation.navigate('Chat' as never, { room, usersInRoom } as never);
	};

	return (
		<Pressable onPress={goToChat}>
			<Box className="mb-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
				<Box className="p-3">
					<HStack space="md" className="items-center">
						<Box className="relative">
							<Image
								resizeMode="cover"
								source={{
									uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/d9e5323e3e31cdede93efcaa8bc9c2188f50e166bcf77987bf0ce0ce300bea47?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
								}}
								className="w-12 h-12 rounded-full border-2 border-blue-100"
							/>
							<Box className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
						</Box>
						<Grid className="flex-1 gap-y-1 gap-x-2 grid-cols-1" _extra={{ className: "grid-cols-1" }}>
							<GridItem className="bg-white/50 text-center col-span-1 rounded-lg" _extra={{ className: "col-span-1" }}>
								<Badge size="md" variant="solid" action="success" className="bg-blue-500">
									<BadgeIcon as={UserRoundIcon} className="ml-2" />
									<BadgeText className="ml-2 text-white">
										{usersInRoom[0].userId2}
									</BadgeText>
								</Badge>
							</GridItem>
							<GridItem className="bg-white/50 text-center col-span-1 rounded-lg" _extra={{ className: "col-span-1" }}>
								<Grid className="grid-cols-2 gap-x-2" _extra={{ className: "grid-cols-2" }}>
									<GridItem _extra={{ className: "col-span-1" }}>
										<Badge size="md" variant="solid" action="muted" className="bg-gray-100">
											<BadgeIcon as={MessageSquare} className="ml-2 text-gray-600" />
											<BadgeText className="ml-2 text-gray-600">3/98</BadgeText>
										</Badge>
									</GridItem>
									<GridItem _extra={{ className: "col-span-1" }}>
										<Badge size="md" variant="solid" action="muted" className="bg-gray-100">
											<BadgeIcon as={TargetIcon} className="ml-2 text-gray-600" />
											<BadgeText className="ml-2 text-gray-600">Entraide</BadgeText>
										</Badge>
									</GridItem>
								</Grid>
							</GridItem>
						</Grid>
					</HStack>
				</Box>
			</Box>
		</Pressable>
	);
};

const RoomGroupItem: React.FC<{ item: UserChatResponse & { myUserId: string } }> = ({ item }) => {
	const navigation = useNavigation<NavigationProp>();
	const { room, usersInRoom, name, lastMessage, messageCount, activityType } = item;

	const goToChat = () => {
		navigation.navigate('Chat' as never, { room, usersInRoom } as never);
	};

	return (
		<Pressable onPress={goToChat}>
			<Box className="mb-6 rounded-xl bg-blue-50">
				<Box className="p-4">
					<HStack space="md" className="items-center">
						<Image
							resizeMode="contain"
							source={{
								uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/25dc4628ffcc6716804f6e4b7af7a397e929de8848169610fb83686d0cb418d2?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
							}}
							className="w-10 h-10 mr-3"
						/>
						<Grid className="flex-1 gap-y-2 gap-x-2 grid-cols-1" _extra={{ className: "grid-cols-1" }}>
							<GridItem className="bg-white/50 text-center col-span-1 rounded-lg" _extra={{ className: "col-span-1" }}>
								<Badge size="md" variant="solid" action="warning">
									<BadgeIcon as={ComponentIcon} className="ml-2" />
									<BadgeText className="ml-2">
										{name || "L'équipe Cool de Montpel"}
									</BadgeText>
								</Badge>
							</GridItem>
							<GridItem className="bg-white/50 text-center col-span-1 rounded-lg" _extra={{ className: "col-span-1" }}>
								<Grid className="grid-cols-2 gap-x-2" _extra={{ className: "grid-cols-2" }}>
									<GridItem _extra={{ className: "col-span-1" }}>
										<Badge size="md" variant="solid" action="muted">
											<BadgeIcon as={MessageSquare} className="ml-2" />
											<BadgeText className="ml-2">12/{messageCount || 0}</BadgeText>
										</Badge>
									</GridItem>
									<GridItem _extra={{ className: "col-span-1" }}>
										<Badge size="md" variant="solid" action="muted">
											<BadgeIcon as={Users} className="ml-2" />
											<BadgeText className="ml-2">{usersInRoom?.length || 0} membres</BadgeText>
										</Badge>
									</GridItem>
								</Grid>
							</GridItem>
						</Grid>
					</HStack>
				</Box>
			</Box>
		</Pressable>
	);
};

const RoomThemeItem: React.FC<{ item: UserChatResponse & { myUserId: string } }> = ({ item }) => {
	const navigation = useNavigation<NavigationProp>();
	const { room, usersInRoom, theme, lastMessage, messageCount } = item;

	const goToChat = () => {
		navigation.navigate('Chat' as never, { room, usersInRoom } as never);
	};

	return (
		<Pressable onPress={goToChat}>
			<Box className="mb-6 rounded-xl bg-blue-50">
				<Box className="p-4">
					<HStack space="md" className="items-center">
						<Image
							resizeMode="contain"
							source={{
								uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/7949539254f43c9e57fd6c3131b3fcccb6596f0d9adbc61b0c91439ee01689d4?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
							}}
							className="w-10 h-10 mr-3"
						/>
						<Grid className="flex-1 gap-y-2 gap-x-2 grid-cols-1" _extra={{ className: "grid-cols-1" }}>
							<GridItem className="bg-white/50 text-center col-span-1 rounded-lg" _extra={{ className: "col-span-1" }}>
								<Badge size="md" variant="solid" action="info">
									<BadgeIcon as={HashIcon} className="ml-2" />
									<BadgeText className="ml-2">
										{theme || "difficulte_professionnelle"}
									</BadgeText>
								</Badge>
							</GridItem>
							<GridItem className="bg-white/50 text-center col-span-1 rounded-lg" _extra={{ className: "col-span-1" }}>
								<Grid className="grid-cols-1 gap-x-2" _extra={{ className: "grid-cols-1" }}>
									<GridItem _extra={{ className: "col-span-1" }}>
										<Badge size="md" variant="solid" action="muted">
											<BadgeIcon as={MessageSquare} className="ml-2" />
											<BadgeText className="ml-2">5/{messageCount || 0}</BadgeText>
										</Badge>
									</GridItem>
								</Grid>
							</GridItem>
						</Grid>
					</HStack>
				</Box>
			</Box>
		</Pressable>
	);
};

const RoomProfessionalItem: React.FC<{ item: UserChatResponse & { myUserId: string } }> = ({ item }) => {
	const navigation = useNavigation<NavigationProp>();
	const { room, usersInRoom, name, lastMessage, messageCount, professionalType, rating } = item;

	const goToChat = () => {
		navigation.navigate('Chat' as never, { room, usersInRoom } as never);
	};

	return (
		<Pressable onPress={goToChat}>
			<Box className="mb-6 rounded-xl bg-blue-50">
				<Box className="p-4">
					<HStack space="md" className="items-center">
						<Image
							resizeMode="contain"
							source={{
								uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/7949539254f43c9e57fd6c3131b3fcccb6596f0d9adbc61b0c91439ee01689d4?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
							}}
							className="w-10 h-10 mr-3"
						/>
						<Grid className="flex-1 gap-y-2 gap-x-2 grid-cols-1" _extra={{ className: "grid-cols-1" }}>
							<GridItem className="bg-white/50 text-center col-span-1 rounded-lg" _extra={{ className: "col-span-1" }}>
								<Badge size="md" variant="solid" action="info" className="bg-indigo-500">
									<BadgeIcon as={UserRoundIcon} className="ml-2" />
									<BadgeText className="ml-2">
										{name || "Dr. Smith"}
									</BadgeText>
								</Badge>
							</GridItem>
							<GridItem className="bg-white/50 text-center col-span-1 rounded-lg" _extra={{ className: "col-span-1" }}>
								<Grid className="grid-cols-2 gap-x-2" _extra={{ className: "grid-cols-2" }}>
									<GridItem _extra={{ className: "col-span-1" }}>
										<Badge size="md" variant="solid" action="muted" className="bg-indigo-400">
											<BadgeIcon as={MessageSquare} className="ml-2" />
											<BadgeText className="ml-2">2/{messageCount || 0}</BadgeText>
										</Badge>
									</GridItem>
									<GridItem _extra={{ className: "col-span-1" }}>
										<Badge size="md" variant="solid" action="muted" className="bg-indigo-300">
											<BadgeIcon as={TargetIcon} className="ml-2" />
											<BadgeText className="ml-2">{professionalType || "Psychologue"}</BadgeText>
										</Badge>
									</GridItem>
								</Grid>
							</GridItem>
						</Grid>
					</HStack>
				</Box>
			</Box>
		</Pressable>
	);
};

interface JwtDecoded {
	ID: string;
}

const ChatTypeButton: React.FC<{
	icon: React.ReactNode;
	title: string;
	onPress: () => void;
}> = ({ icon, title, onPress }) => {
	return (
		<Button
			variant="outline"
			size="sm"
			className="flex-1 mx-1 mb-2"
			onPress={onPress}
		>
			<HStack space="xs" className="items-center">
				{icon}
				<ButtonText className="text-xs">{title}</ButtonText>
			</HStack>
		</Button>
	);
};

export function ChatList(): React.JSX.Element {
	const navigation = useNavigation<NavigationProp>();
	const [jwtDecoded] = useAtom(jwtDecodedAtom) as [JwtDecoded | null, (value: JwtDecoded | null) => void];
	const [refreshing, setRefreshing] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const myUserId = jwtDecoded ? jwtDecoded.ID.split(":")[1] : null;
	const [chats, setChats] = React.useState<(UserChatResponse & { myUserId: string })[]>([]);
	const apiClient = React.useMemo(() => {
		const client = ElysiaClient.getInstance();
		client.setEnvironment('production');
		return client;
	}, []);

	useEffect(() => {
		console.log('ChatList mounted, myUserId:', myUserId);
		loadChats();
	}, [myUserId]);

	const loadChats = async () => {
		try {
			if (!myUserId) {
				console.log('No myUserId available, skipping chat load');
				return;
			}

			console.log('Loading chats for user:', myUserId);
			const response = await apiClient.getUserChats(myUserId);
			const userChats = response as unknown as UserChatResponse[];
			console.log('Raw user chats response:', userChats);
			// Pull room details for each chat
			for (const chat of userChats) {
				try {
					const roomDetails = await apiClient.getChat(chat.room);
					console.log('Room details for', chat.room, ':', roomDetails);
				} catch (error) {
					console.error('Error fetching room details for', chat.room, ':', error);
				}
			}
			
			if (!Array.isArray(userChats)) {
				console.error('userChats is not an array:', userChats);
				return;
			}

			const processedChats = userChats.map(chat => ({
				room: chat.room,
				usersInRoom: chat.usersInRoom || [],
				type: chat.type || '1v1',
				name: chat.name,
				theme: chat.theme,
				lastMessage: chat.lastMessage,
				messageCount: chat.messageCount || 0,
				activityType: chat.activityType,
				professionalType: chat.professionalType,
				rating: chat.rating,
				myUserId
			}));

			// Add fake data for group and thematic chats
			const fakeGroupChats = [
				{
					room: "group_1",
					usersInRoom: [{ userId2: "user1" }, { userId2: "user2" }, { userId2: "user3" }],
					type: "group" as const,
					name: "L'équipe Cool de Montpellier",
					myUserId,
					lastMessage: "RDV Au fitzpatrick à 16H le dernier arrivé paye le billard.",
					messageCount: 204,
					activityType: "Sortir"
				},
				{
					room: "group_2",
					usersInRoom: [{ userId2: "user4" }, { userId2: "user5" }],
					type: "group" as const,
					name: "Les Amis du Cinéma",
					myUserId,
					lastMessage: "Qui veut aller voir le dernier film Marvel ce weekend ?",
					messageCount: 156,
					activityType: "Culture"
				}
			];

			const fakeThematicChats = [
				{
					room: "theme_1",
					usersInRoom: [{ userId2: "user6" }, { userId2: "user7" }, { userId2: "user8" }],
					type: "thematic" as const,
					theme: "difficulte_professionnelle",
					myUserId,
					lastMessage: "Le prochain webinar est le 12/02 à 14h prenez soin de vous!",
					messageCount: 1503
				},
				{
					room: "theme_2",
					usersInRoom: [{ userId2: "user9" }, { userId2: "user10" }],
					type: "thematic" as const,
					theme: "sport_et_bien_etre",
					myUserId,
					lastMessage: "Quelqu'un veut faire une session de yoga ensemble ?",
					messageCount: 892
				}
			];

			const fakeProfessionalChats = [
				{
					room: "prof_1",
					usersInRoom: [{ userId2: "prof1" }],
					type: "professional" as const,
					name: "Dr. Marie Laurent",
					myUserId,
					lastMessage: "Je vous propose un rendez-vous le 15/03 à 14h.",
					messageCount: 45,
					professionalType: "Psychologue",
					rating: 4.8
				},
				{
					room: "prof_2",
					usersInRoom: [{ userId2: "prof2" }],
					type: "professional" as const,
					name: "Dr. Jean Dupont",
					myUserId,
					lastMessage: "Voici votre plan de suivi personnalisé.",
					messageCount: 32,
					professionalType: "Coach",
					rating: 4.9
				}
			];

			// Combine all chats
			const allChats = [...processedChats, ...fakeGroupChats, ...fakeThematicChats, ...fakeProfessionalChats];
			console.log('Final processed chats:', allChats);
			setChats(allChats);
		} catch (error) {
			console.error('Error loading chats:', error);
		}
	};

	const filteredChats = chats.filter(chat => {
		const searchLower = searchQuery.toLowerCase();
		
		switch (chat.type) {
			case '1v1':
				return chat.usersInRoom[0]?.userId2?.toLowerCase().includes(searchLower) ||
					chat.room?.toLowerCase().includes(searchLower);
			case 'group':
				return (chat.name || "L'équipe Cool de Montpel").toLowerCase().includes(searchLower) ||
					chat.room?.toLowerCase().includes(searchLower);
			case 'thematic':
				return (chat.theme || "difficulte_professionnelle").toLowerCase().includes(searchLower) ||
					chat.room?.toLowerCase().includes(searchLower);
			case 'professional':
				return (chat.name || "Dr. Smith").toLowerCase().includes(searchLower) ||
					chat.room?.toLowerCase().includes(searchLower);
			default:
				return chat.room?.toLowerCase().includes(searchLower);
		}
	});

	const renderItem = ({ item }: { item: UserChatResponse & { myUserId: string } }) => {
		switch (item.type) {
			case 'group':
				return <RoomGroupItem item={item} />;
			case 'thematic':
				return <RoomThemeItem item={item} />;
			case 'professional':
				return <RoomProfessionalItem item={item} />;
			default:
				return <RoomItem item={item} />;
		}
	};

	return (
		<Box className="flex-1 bg-gray-50">
			<Box className="flex-1 p-2">
				<Input
					size="md"
					className="mb-3 rounded-lg bg-white shadow-sm"
				>
					<InputField
						placeholder="Rechercher un contact"
						value={searchQuery}
						onChangeText={setSearchQuery}
						className="py-2"
					/>
				</Input>
				<FlatList
					data={filteredChats}
					renderItem={renderItem}
					keyExtractor={(item) => item.room}
					contentContainerStyle={styles.listContent}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={loadChats} />
					}
					ListEmptyComponent={() => (
						<Box className="flex-1 items-center justify-center p-4">
							<Text className="text-gray-500 text-center">No chats available</Text>
						</Box>
					)}
					showsVerticalScrollIndicator={false}
				/>
				<Box className="mt-3 mb-4">
					<Text className="text-sm font-semibold mb-2 text-gray-700">Nouvelle Conversation</Text>
					<VStack space="xs">
						<HStack space="xs">
							<ChatTypeButton
								icon={<UserPlus size={16} className="text-blue-500" />}
								title="1v1"
								onPress={() => navigation.navigate('Chat' as never, { room: '', usersInRoom: [] })}
							/>
							<ChatTypeButton
								icon={<Users2 size={16} className="text-green-500" />}
								title="Groupe"
								onPress={() => navigation.navigate('Chat' as never, { room: '', usersInRoom: [] })}
							/>
							<ChatTypeButton
								icon={<Hash size={16} className="text-purple-500" />}
								title="Thématique"
								onPress={() => navigation.navigate('Chat' as never, { room: '', usersInRoom: [] })}
							/>
						</HStack>
						<HStack space="xs">
							<ChatTypeButton
								icon={<Briefcase size={16} className="text-orange-500" />}
								title="Pro"
								onPress={() => navigation.navigate('Chat' as never, { room: '', usersInRoom: [] })}
							/>
							<ChatTypeButton
								icon={<BookOpen size={16} className="text-red-500" />}
								title="Dédié"
								onPress={() => navigation.navigate('Chat' as never, { room: '', usersInRoom: [] })}
							/>
							<ChatTypeButton
								icon={<LifeBuoy size={16} className="text-teal-500" />}
								title="Support"
								onPress={() => navigation.navigate('Chat' as never, { room: '', usersInRoom: [] })}
							/>
						</HStack>
					</VStack>
				</Box>
			</Box>
		</Box>
	);
}

const styles = StyleSheet.create({
	listContent: {
		paddingTop: 8,
		paddingBottom: 8,
	},
});
