import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ElysiaClient, Chat } from 'ts-elysia-client';
import { useAtom } from 'jotai';
import { jwtDecodedAtom } from '../../states/user';
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { MessageSquare, User } from 'lucide-react-native';

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

const client = ElysiaClient.getInstance();

export const ChatList: React.FC = () => {
	const navigation = useNavigation<NavigationProp>();
	const [chatRooms, setChatRooms] = useState<Chat[]>([]);
	const [jwtDecoded] = useAtom(jwtDecodedAtom);
	const [refreshing, setRefreshing] = useState(false);
	const myUserId = jwtDecoded ? (jwtDecoded as any).ID.split(":")[1] : null;

	useEffect(() => {
		loadChatRooms();
	}, []);

	const loadChatRooms = async () => {
		try {
			if (myUserId) {
				const rooms = await client.getUserChats(myUserId);
				setChatRooms(rooms);
			}
		} catch (error) {
			console.error('Error loading chat rooms:', error);
		}
	};

	const onRefresh = async () => {
		setRefreshing(true);
		await loadChatRooms();
		setRefreshing(false);
	};

	const renderItem = ({ item }: { item: Chat }) => {
		const otherUserId = item.participants.find(id => id !== myUserId) || '';
		const lastMessage = item.lastMessage;

		return (
			<Pressable
				onPress={() => navigation.navigate('Chat', {
					room: item.id,
					usersInRoom: [{ userId2: otherUserId }]
				})}
				className="flex-row items-center space-x-3 p-4 bg-white border-b border-gray-100"
			>
				<Box className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center">
					<User size={24} color="#6366f1" />
				</Box>
				<Box className="flex-1">
					<Text className="text-base font-medium">User {otherUserId}</Text>
					{lastMessage && (
						<Text className="text-sm text-gray-500" numberOfLines={1}>
							{lastMessage.message}
						</Text>
					)}
				</Box>
				{lastMessage && (
					<Text className="text-xs text-gray-400">
						{new Date(lastMessage.createdAt).toLocaleDateString()}
					</Text>
				)}
			</Pressable>
		);
	};

	return (
		<View style={styles.container}>
			<Box className="p-4 border-b border-gray-100">
				<Text className="text-xl font-semibold">Conversations</Text>
			</Box>
			<FlatList
				data={chatRooms}
				renderItem={renderItem}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.list}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f9fafb',
	},
	list: {
		flexGrow: 1,
	},
});
