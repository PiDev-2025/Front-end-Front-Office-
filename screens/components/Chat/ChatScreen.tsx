import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ElysiaClient, ChatMessage } from 'ts-elysia-client';
import { useAtom } from 'jotai';
import { jwtDecodedAtom } from '../../states/user';
import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { Message } from './Message';
import { ChatInput } from './ChatInput';
import { ChatHeader } from './ChatHeader';

interface RouteParams {
	room: string;
	usersInRoom: Array<{
		userId2: string;
	}>;
}

const client = ElysiaClient.getInstance();

export const ChatScreen: React.FC = () => {
	const route = useRoute();
	const { room, usersInRoom } = route.params as RouteParams;
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [jwtDecoded] = useAtom(jwtDecodedAtom);
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);
	const scrollViewRef = useRef<ScrollView>(null);
	const myUserId = jwtDecoded ? (jwtDecoded as any).ID.split(":")[1] : null;
	const otherUserId = usersInRoom[0].userId2;
	console.log(`myUserId:${myUserId}`, `otherUserId:${otherUserId}`);

	useEffect(() => {
		loadMessages();
	}, [room]);

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

	const loadMessages = async () => {
		try {
			const msgs = await client.getMessages(room, 50, 0, 0);
			setMessages(msgs);
		} catch (error) {
			console.error('Error loading messages:', error);
		}
	};

	const handleSend = async (message: string) => {
		if (!message.trim() || !myUserId) return;

		try {
			const msg: ChatMessage = {
				chatId: room,
				senderId: myUserId,
				message: message.trim(),
				createdAt: new Date().toISOString()
			};
			const sentMsg = await client.sendMessage(msg);
			setMessages(prev => [...prev, sentMsg]);
			scrollViewRef.current?.scrollToEnd({ animated: true });
		} catch (error) {
			console.error('Error sending message:', error);
		}
	};

	return (
		<View style={styles.container}>
			<ChatHeader
				themeTitle={otherUserId}
				memberCount={308}
				onSettingsPress={() => {}}
				onNotificationsPress={() => {}}
				onMenuPress={() => {}}
			/>
			<Box className="flex-1 bg-gray-50">
				<ScrollView
					ref={scrollViewRef}
					className="flex-1 p-4"
					onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
					onLayout={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
				>
					{messages.map((msg, index) => (
						<Message
							key={index}
							message={msg.message}
							username={msg.senderId === myUserId ? "You" : `User ${msg.senderId}`}
							timestamp={msg.createdAt}
							isOutgoing={msg.senderId === myUserId}
						/>
					))}
				</ScrollView>
				<ChatInput onSend={handleSend} />
			</Box>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// maxWidth: 480,
		width: "100%",
		marginHorizontal: "auto",
		backgroundColor: "#FFFFFF",
	},
	content: {
		flex: 1,
	},
	container_keyboard: {
		flex: 1,
		width: "100%",
		backgroundColor: "#FFFFFF",
	},
	keyboardAvoidingView: {
		flex: 1,
	},
});

export default ChatScreen;
