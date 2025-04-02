import React, { useEffect, useState, useRef } from 'react';
import { View, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ScrollView, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ElysiaClient, ChatMessage } from 'ts-elysia-client';
import { useAtom } from 'jotai';
import { jwtDecodedAtom } from '../../states/user';
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Send, ArrowLeft, User } from 'lucide-react-native';
import { ChatInput } from './ChatInput';
import { Message } from './Message';

type RouteParams = {
	room: string;
	usersInRoom: Array<{
		userId2: string;
	}>;
};

const client = ElysiaClient.getInstance();

const ChatHeader: React.FC<{ otherUserId: string; onBack: () => void }> = ({ otherUserId, onBack }) => (
	<Box className="p-4 border-b border-gray-100 pt-20 bg-white">
		<Box className="flex-row items-center space-x-4">
			<Button
				variant="outline"
				onPress={onBack}
				className="p-0"
			>
				<ArrowLeft size={24} color="#374151" />
			</Button>
			<Box className="flex-row items-center space-x-3">
				<Box className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center">
					<User size={24} color="#6366f1" />
				</Box>
				<Box>
					<Text className="text-xl font-semibold">User {otherUserId}</Text>
					<Text className="text-sm text-gray-500">Online</Text>
				</Box>
			</Box>
		</Box>
	</Box>
);

export const ChatScreen: React.FC = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const params = route.params as RouteParams;
	const room = params?.room;
	const usersInRoom = params?.usersInRoom || [];
	
	if (!room) {
		console.error('Room ID is missing from route params');
		return null;
	}

	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [jwtDecoded] = useAtom(jwtDecodedAtom);
	const scrollViewRef = useRef<ScrollView>(null);
	const myUserId = jwtDecoded ? (jwtDecoded as any).ID.split(":")[1] : null;
	const otherUserId = usersInRoom[0]?.userId2;

	useEffect(() => {
		loadMessages();
	}, [room]);

	const loadMessages = async () => {
		try {
			const chatMessages = await client.getMessages(room, 50, 0, 0);
			setMessages(chatMessages);
		} catch (error) {
			console.error('Error loading messages:', error);
		}
	};

	const handleSend = async (messageText: string) => {
		if (!messageText.trim() || !myUserId || !room) {
			console.error('Missing required data:', { messageText, myUserId, room });
			return;
		}

		try {
			const msg: ChatMessage = {
				chatId: room,
				senderId: myUserId,
				message: messageText.trim(),
				createdAt: new Date().toISOString()
			};
			console.log('Sending message:', msg);
			await client.sendMessage(msg);
			loadMessages();
		} catch (error) {
			console.error('Error sending message:', error);
		}
	};

	const renderMessage = (msg: ChatMessage, index: number) => {
		if (!msg || !msg.senderId) return null;
		
		const isMyMessage = msg.senderId === myUserId;
		const messageKey = `${room}-${msg.senderId}-${msg.createdAt || Date.now()}-${index}`;
		
		return (
			<Message
				key={messageKey}
				message={msg.message}
				timestamp={msg.createdAt || new Date().toISOString()}
				isOutgoing={isMyMessage}
				username={!isMyMessage ? `User ${msg.senderId}` : undefined}
			/>
		);
	};

	return (
		<KeyboardAvoidingView 
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			className="flex-1 bg-white"
			keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}
		>
			<Box className="flex-1">
				<ChatHeader 
					otherUserId={otherUserId} 
					onBack={() => navigation.goBack()} 
				/>

				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView
						ref={scrollViewRef}
						className="flex-1"
						contentContainerStyle={styles.messagesContainer}
						onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
						keyboardShouldPersistTaps="handled"
						showsVerticalScrollIndicator={false}
					>
						{messages.map((msg, index) => renderMessage(msg, index))}
					</ScrollView>
				</TouchableWithoutFeedback>

				<ChatInput onSend={handleSend} />
			</Box>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	messagesContainer: {
		paddingVertical: 16,
		paddingBottom: 32,
	},
});

export default ChatScreen;
