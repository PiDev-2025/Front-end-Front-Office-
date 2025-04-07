import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Pressable, RefreshControl, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../../../libs/api';
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
import { ChatListItem } from './ChatListItem';

type RootStackParamList = {
	Chat: {
		room: string;
		usersInRoom: any[];
		type: string;
	};
	NewChat: undefined;
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
	[key: string]: any;
}

interface Chat {
	id: string;
	name?: string;
	type: string;
	users: any[];
	lastMessage?: string;
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

export const ChatList: React.FC = () => {
	const navigation = useNavigation<NavigationProp>();
	const [jwtDecoded] = useAtom(jwtDecodedAtom) as [JwtDecoded, any];
	const [chats, setChats] = useState<Chat[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [refreshing, setRefreshing] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');

	const fetchChats = async () => {
		try {
			setLoading(true);
			if (!jwtDecoded?.ID) {
				throw new Error('User ID not found');
			}
			const userId = jwtDecoded.ID.split(':')[1];
			const response = await api.chat.get(userId);
			setChats(response);
			setError(null);
		} catch (error) {
			console.error('Error fetching chats:', error);
			setError('Failed to load chats. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchChats();
		setRefreshing(false);
	};

	useEffect(() => {
		fetchChats();
	}, [jwtDecoded?.ID]);

	const filteredChats = chats.filter(chat => {
		const searchLower = searchQuery.toLowerCase();
		return (
			chat.name?.toLowerCase().includes(searchLower) ||
			chat.lastMessage?.toLowerCase().includes(searchLower)
		);
	});

	const handleChatPress = (chat: Chat) => {
		navigation.navigate('Chat', {
			room: chat.id,
			usersInRoom: chat.users,
			type: chat.type
		});
	};

	if (loading && !refreshing) {
		return (
			<Box className="flex-1 items-center justify-center bg-gray-50">
				<Text>Loading chats...</Text>
			</Box>
		);
	}

	return (
		<Box className="flex-1 bg-gray-50">
			<Box className="flex-1 p-2">
				<Input
					size="md"
					className="mb-3 rounded-lg bg-white shadow-sm"
				>
					<InputField
						placeholder="Rechercher un contact"
						className="py-2"
						value={searchQuery}
						onChangeText={setSearchQuery}
					/>
				</Input>
				<FlatList
					data={filteredChats}
					renderItem={({ item }) => (
						<ChatListItem
							key={item.id}
							chat={item}
							onPress={() => handleChatPress(item)}
							myUserId={jwtDecoded.ID}
						/>
					)}
					keyExtractor={(item) => item.id}
					contentContainerStyle={styles.listContent}
					ListEmptyComponent={() => (
						<Box className="flex-1 items-center justify-center p-4">
							{error ? (
								<VStack space="sm" className="items-center">
									<Text className="text-red-500 text-center">{error}</Text>
									<Button
										variant="outline"
										size="sm"
										onPress={fetchChats}
										className="mt-2"
									>
										<ButtonText>Retry</ButtonText>
									</Button>
								</VStack>
							) : (
								<Text className="text-gray-500 text-center">
									{searchQuery ? 'No chats found' : 'No chats available'}
								</Text>
							)}
						</Box>
					)}
					refreshControl={
						<RefreshControl
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					}
					showsVerticalScrollIndicator={false}
				/>
				<Box className="mt-3 mb-4">
					<Text className="text-sm font-semibold mb-2 text-gray-700">Nouvelle Conversation</Text>
					<VStack space="xs">
						<HStack space="xs">
							<ChatTypeButton
								icon={<UserPlus size={16} className="text-blue-500" />}
								title="1v1"
								onPress={() => navigation.navigate('NewChat' as never)}
							/>
							<ChatTypeButton
								icon={<Users2 size={16} className="text-green-500" />}
								title="Groupe"
								onPress={() => navigation.navigate('NewChat' as never)}
							/>
							<ChatTypeButton
								icon={<Hash size={16} className="text-purple-500" />}
								title="Thématique"
								onPress={() => navigation.navigate('NewChat' as never)}
							/>
						</HStack>
						<HStack space="xs">
							<ChatTypeButton
								icon={<Briefcase size={16} className="text-orange-500" />}
								title="Pro"
								onPress={() => navigation.navigate('NewChat' as never)}
							/>
							<ChatTypeButton
								icon={<BookOpen size={16} className="text-red-500" />}
								title="Dédié"
								onPress={() => navigation.navigate('NewChat' as never)}
							/>
							<ChatTypeButton
								icon={<LifeBuoy size={16} className="text-teal-500" />}
								title="Support"
								onPress={() => navigation.navigate('NewChat' as never)}
							/>
						</HStack>
					</VStack>
				</Box>
			</Box>
		</Box>
	);
};

const styles = StyleSheet.create({
	listContent: {
		paddingBottom: 20,
	},
});
