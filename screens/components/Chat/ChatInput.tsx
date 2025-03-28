import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Send } from 'lucide-react-native';
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { ChatInputProps } from './types';

export const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
	const [message, setMessage] = useState('');
	const [isKeyboardVisible, setKeyboardVisible] = useState(false);

	const handleSend = () => {
		if (message.trim()) {
			onSend(message);
			setMessage('');
		}
	};

	return (
		<Box className="p-4 border-t border-gray-100 bg-white">
			<View style={styles.container}>
				<TextInput
					style={styles.input}
					value={message}
					onChangeText={setMessage}
					placeholder="Type a message..."
					placeholderTextColor="#94a3b8"
					multiline
					onFocus={() => setKeyboardVisible(true)}
					onBlur={() => setKeyboardVisible(false)}
				/>
				<TouchableOpacity
					onPress={handleSend}
					style={[
						styles.sendButton,
						!message.trim() && styles.sendButtonDisabled
					]}
				>
					<Send size={20} color={message.trim() ? '#6366f1' : '#94a3b8'} />
				</TouchableOpacity>
			</View>
		</Box>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		alignItems: 'flex-end',
		gap: 8,
	},
	input: {
		flex: 1,
		minHeight: 40,
		maxHeight: 120,
		paddingHorizontal: 12,
		paddingVertical: 8,
		backgroundColor: '#f1f5f9',
		borderRadius: 20,
		fontSize: 16,
		color: '#1e293b',
	},
	sendButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: '#f1f5f9',
		alignItems: 'center',
		justifyContent: 'center',
	},
	sendButtonDisabled: {
		opacity: 0.5,
	},
});
