import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Pressable, RefreshControl, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ElysiaClient, Chat } from 'ts-elysia-client';
import { ChatGroup } from 'ts-elysia-client/src/client';
import { useAtom } from 'jotai';
import { jwtDecodedAtom } from '../../states/user';
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { MessageSquare, User, Users, MessageCircle, ComponentIcon, HashIcon, UserRoundIcon, TargetIcon } from 'lucide-react-native';
import { Button, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Grid, GridItem } from "@/components/ui/grid";
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
	type?: '1v1' | 'group' | 'thematic';
	name?: string;
	theme?: string;
	lastMessage?: string;
	messageCount?: number;
	activityType?: string;
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
			<Box className="mb-6">
				<HStack space="md" className="items-center">
					<Image
						resizeMode="contain"
						source={{
							uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/d9e5323e3e31cdede93efcaa8bc9c2188f50e166bcf77987bf0ce0ce300bea47?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
						}}
						className="w-10 h-10 mr-3"
					/>
					<Grid className="flex-1 gap-y-2 gap-x-2 grid-cols-2" _extra={{ className: "grid-cols-2" }}>
						<GridItem className="bg-background-50 text-center col-span-1" _extra={{ className: "col-span-1" }}>
							<Badge size="md" variant="solid" action="success">
								<BadgeIcon as={UserRoundIcon} className="ml-2" />
								<BadgeText className="ml-4">
									{usersInRoom[0].userId2}
								</BadgeText>
							</Badge>
						</GridItem>
						<GridItem className="bg-background-50 text-center col-span-1" _extra={{ className: "col-span-1" }}>
							<Grid className="gap-y-1 gap-x-6 grid-cols-6" _extra={{ className: "grid-cols-6" }}>
								<GridItem className="bg-background-50 text-center col-span-2" _extra={{ className: "col-span-2" }}>
									<Badge size="md" variant="solid" action="muted">
										<BadgeIcon as={MessageSquare} className="ml-2" />
										<BadgeText className="ml-4">98</BadgeText>
									</Badge>
								</GridItem>
								<GridItem className="bg-background-50 text-center col-span-4" _extra={{ className: "col-span-4" }}>
									<Badge size="md" variant="solid" action="muted">
										<BadgeIcon as={TargetIcon} className="ml-2" />
										<BadgeText className="ml-4">Entraide</BadgeText>
									</Badge>
								</GridItem>
							</Grid>
						</GridItem>
						{/* <GridItem className="bg-background-50 rounded-md text-center col-span-2" _extra={{ className: "col-span-2" }}>
							<Text className="text-sm">
								C'était super de se rencontrer à la librairie, on remets çà!
							</Text>
						</GridItem> */}
					</Grid>
				</HStack>
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
			<Box className="mb-6">
				<HStack space="md" className="items-center">
					<Image
						resizeMode="contain"
						source={{
							uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/25dc4628ffcc6716804f6e4b7af7a397e929de8848169610fb83686d0cb418d2?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
						}}
						className="w-10 h-10 mr-3"
					/>
					<Grid className="flex-1 gap-y-2 gap-x-2 grid-cols-2" _extra={{ className: "grid-cols-2" }}>
						<GridItem className="bg-background-50 text-center col-span-2" _extra={{ className: "col-span-2" }}>
							<VStack space="sm">
								<Badge size="md" variant="solid" action="warning">
									<BadgeIcon as={ComponentIcon} className="ml-2" />
									<BadgeText className="ml-4">
										{name || "L'équipe Cool de Montpel"}
									</BadgeText>
								</Badge>
								<Grid className="gap-x-2 grid-cols-2" _extra={{ className: "grid-cols-2" }}>
									<GridItem>
										<Badge size="md" variant="solid" action="muted">
											<BadgeIcon as={MessageSquare} className="ml-2" />
											<BadgeText className="ml-4">{messageCount || 0} </BadgeText>
										</Badge>
									</GridItem>
									<GridItem>
										<Badge size="md" variant="solid" action="muted">
											<BadgeIcon as={Users} className="ml-2" />
											<BadgeText className="ml-4">{usersInRoom?.length || 0} membres</BadgeText>
										</Badge>
									</GridItem>
								</Grid>
							</VStack>
						</GridItem>
						{/* <GridItem className="bg-background-50 rounded-md text-center col-span-2" _extra={{ className: "col-span-2" }}>
							<Text className="text-sm">
								{lastMessage || "Aucun message"}
							</Text>
						</GridItem> */}
					</Grid>
				</HStack>
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
			<Box className="mb-6">
				<HStack space="md" className="items-center">
					<Image
						resizeMode="contain"
						source={{
							uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/7949539254f43c9e57fd6c3131b3fcccb6596f0d9adbc61b0c91439ee01689d4?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
						}}
						className="w-10 h-10 mr-3"
					/>
					<Grid className="flex-1 gap-y-2 gap-x-2 grid-cols-1" _extra={{ className: "grid-cols-1" }}>
						<GridItem className="bg-background-50 text-center col-span-1" _extra={{ className: "col-span-1" }}>
							<Badge size="md" variant="solid" action="info">
								<BadgeIcon as={HashIcon} className="ml-2" />
								<BadgeText className="ml-4">
									{theme || "difficulte_professionnelle"}
								</BadgeText>
							</Badge>
						</GridItem>
						<GridItem className="bg-background-50 text-center col-span-1" _extra={{ className: "col-span-1" }}>
							<VStack space="sm">
								<Badge size="md" variant="solid" action="muted">
									<BadgeIcon as={MessageSquare} className="ml-2" />
									<BadgeText className="ml-4">{messageCount || 0}</BadgeText>
								</Badge>
							</VStack>
						</GridItem>
						{/* <GridItem className="bg-background-50 rounded-md text-center col-span-2" _extra={{ className: "col-span-2" }}>
							<Text className="text-sm">
								{lastMessage || "Aucun message"}
							</Text>
						</GridItem> */}
					</Grid>
				</HStack>
			</Box>
		</Pressable>
	);
};

interface JwtDecoded {
	ID: string;
}

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
			
			if (!Array.isArray(userChats)) {
				console.error('userChats is not an array:', userChats);
				return;
			}

			const validChats = userChats.filter(chat => chat && chat.room && chat.usersInRoom);
			console.log('Valid chats after filtering:', validChats);
			
			const processedChats = validChats.map(chat => ({
				...chat,
				myUserId,
				type: chat.type || '1v1' // Default to 1v1 if type not specified
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

			// Combine real and fake chats
			const allChats = [...processedChats, ...fakeGroupChats, ...fakeThematicChats];
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
			default:
				return <RoomItem item={item} />;
		}
	};

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
			/>
			<Button
				variant="solid"
				size="md"
				className="m-4"
				onPress={() => navigation.navigate('NewChat' as never)}
			>
				<ButtonText>+ Nouvelle Conversation</ButtonText>
			</Button>
		</Box>
	);
}

const styles = StyleSheet.create({
	listContent: {
		paddingTop: 16,
	},
});
