import React, { useEffect, useState, useRef } from 'react';
import { View, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ScrollView, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ElysiaClient, ChatMessage } from 'ts-elysia-client';
import { useAtom } from 'jotai';
import { jwtDecodedAtom } from '../../states/user';
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, ArrowLeft } from 'lucide-react-native';
import { ChatHeader } from './ChatHeader';

type RouteParams = {
	room: string;
	usersInRoom: Array<{
		userId2: string;
	}>;
};

const client = ElysiaClient.getInstance();

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
	const [message, setMessage] = useState('');
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);
	const scrollViewRef = useRef<ScrollView>(null);
	const myUserId = jwtDecoded ? (jwtDecoded as any).ID.split(":")[1] : null;
	const otherUserId = usersInRoom[0]?.userId2;

	useEffect(() => {
		const keyboardDidShowListener = Keyboard.addListener(
			Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
			() => {
				setKeyboardVisible(true);
			}
		);
		const keyboardDidHideListener = Keyboard.addListener(
			Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
			() => {
				setKeyboardVisible(false);
			}
		);

		return () => {
			keyboardDidShowListener.remove();
			keyboardDidHideListener.remove();
		};
	}, []);

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

	const handleSend = async () => {
		if (!message.trim() || !myUserId || !room) {
			console.error('Missing required data:', { message, myUserId, room });
			return;
		}

		try {
			const msg: ChatMessage = {
				chatId: room,
				senderId: myUserId,
				message: message.trim(),
				createdAt: new Date().toISOString()
			};
			console.log('Sending message:', msg);
			await client.sendMessage(msg);
			setMessage('');
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
			<Box 
				key={messageKey}
				className={`flex-row ${isMyMessage ? 'justify-end' : 'justify-start'} mb-4 px-4`}
			>
				<Box 
					className={`max-w-[80%] rounded-lg p-3 ${
						isMyMessage ? 'bg-indigo-500' : 'bg-gray-100'
					}`}
				>
					<Text 
						className={`${isMyMessage ? 'text-white' : 'text-gray-900'}`}
					>
						{msg.message}
					</Text>
					<Text 
						className={`text-xs mt-1 ${
							isMyMessage ? 'text-indigo-100' : 'text-gray-500'
						}`}
					>
						{msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { 
							hour: '2-digit', 
							minute: '2-digit' 
						}) : 'Just now'}
					</Text>
				</Box>
			</Box>
		);
	};

	return (
		<KeyboardAvoidingView 
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			className="flex-1 bg-white"
			keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
		>
			<Box className="flex-1">
				{/* Header */}
				<Box className="p-4 border-b border-gray-100 pt-16">
					<Box className="flex-row items-center space-x-4">
						<Button
							variant="outline"
							onPress={() => navigation.goBack()}
							className="p-0"
						>
							<ArrowLeft size={24} color="#374151" />
						</Button>
						<Text className="text-xl font-semibold">Chat with User {otherUserId}</Text>
					</Box>
				</Box>

				{/* Messages */}
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<ScrollView
						ref={scrollViewRef}
						className="flex-1"
						contentContainerStyle={styles.messagesContainer}
						onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
						keyboardShouldPersistTaps="handled"
					>
						{messages.map((msg, index) => renderMessage(msg, index))}
					</ScrollView>
				</TouchableWithoutFeedback>

				{/* Input Area */}
				<Box className="p-4 border-t border-gray-100 bg-white">
					<Box className="flex-row items-end space-x-2">
						<Input
							value={message}
							onChangeText={setMessage}
							placeholder="Type a message..."
							className="flex-1 min-h-[40px]"
							multiline
						/>
						<Button
							onPress={handleSend}
							className="bg-indigo-500"
							disabled={!message.trim()}
						>
							<Send size={20} color="white" />
						</Button>
					</Box>
				</Box>
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
