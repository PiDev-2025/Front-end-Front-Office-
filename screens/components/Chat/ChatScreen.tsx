import { useFocusEffect, useRoute } from "@react-navigation/native";
import React from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	View,
} from "react-native";
import { APIClient } from "@/elysia-client/src/client";
import { useAtom } from "jotai";
import { jwtDecodedAtom, jwtAtom } from "../../states/user";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { Message } from "./Message";

interface RouteParams {
	room: string;
	usersInRoom: Array<{
		userId2: string;
	}>;
}

interface JwtDecoded {
	ID: string;
	[key: string]: any;
}

// Initialize API client
const apiClient = new APIClient(process.env.API_URL);

export const ChatScreen: React.FC = () => {
	const route = useRoute();
	const { room, usersInRoom } = route.params as RouteParams;
	console.log(`roomId:${room}`);
	const [jwt] = useAtom(jwtAtom);
	console.log(`jwt:${jwt}`);
	const [messages, setMessages] = React.useState<any[]>([]);
	const [jwtDecoded, setJwtDecoded] = useAtom(jwtDecodedAtom);
	const myUserId = jwtDecoded ? (jwtDecoded as JwtDecoded).ID.split(":")[1] : null;
	const otherUserId = usersInRoom[0].userId2;
	console.log(`myUserId:${myUserId}`, `otherUserId:${otherUserId}`);
	const scrollViewRef = React.useRef<ScrollView>(null);

	const handleSend = async (message: string) => {
		if (!myUserId) {
			console.error('User ID not available');
			return;
		}

		const now = new Date();
		console.log(now, now.toISOString());
		const msg = {
			message,
			isoTimeStamp: now.toISOString(),
			senderId: myUserId,
			timestamp: now.getTime(),
		};
		
		try {
			const response = await apiClient.sendMessage(room, msg);
			console.log('Message sent:', response);
			setMessages(prev => [...prev, response]);
		} catch (error) {
			console.error('Error sending message:', error);
		}
	};

	const [keyboardVisible, setKeyboardVisible] = React.useState(false);

	useFocusEffect(
		React.useCallback(() => {
			console.log("Component is focused");
			const intervalId = setInterval(async () => {
				await handleRefresh();
			}, 4000);

			return () => {
				console.log("Component is unfocused");
				clearInterval(intervalId);
			};
		}, [])
	);

	const handleRefresh = async () => {
		try {
			const newMessages = await apiClient.getMessages(room, 0, 50);
			setMessages(newMessages);
		} catch (error) {
			console.error('Error refreshing messages:', error);
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
			<ScrollView
				onScroll={() => setKeyboardVisible(false)}
				style={styles.content}
				contentContainerStyle={{ flexGrow: 1 }}
				ref={scrollViewRef}
				onContentSizeChange={() =>
					scrollViewRef.current?.scrollToEnd({ animated: true })
				}
			>
				{messages.map((msg, index) => (
					<Message key={index} {...msg} />
				))}
			</ScrollView>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardAvoidingView}
				keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
			>
				<ChatInput onSend={handleSend} />
			</KeyboardAvoidingView>
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
