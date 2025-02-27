import * as React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { jwtDecodedState } from "../../states/user";
import { MessageProps } from "./types";
export const Message: React.FC<MessageProps> = ({
	avatar,
	message,
	senderId,
	isoTimeStamp,
	timestamp,
}) => {
	const [jwtDecoded, setJwtDecoded] = useRecoilState(jwtDecodedState);
	const isOutgoing = senderId === jwtDecoded.ID.split(":")[1] ? true : false;
	const containerStyle = isOutgoing
		? styles.outgoingContainer
		: styles.incomingContainer;
	const messageStyle = isOutgoing
		? styles.outgoingMessage
		: styles.incomingMessage;
	const textStyle = isOutgoing ? styles.outgoingText : styles.incomingText;

	return (
		<View style={containerStyle}>
			<View style={styles.messageWrapper}>
				{!isOutgoing && (
					<View style={styles.userInfo}>
						{avatar && (
							<Image
								source={{ uri: avatar }}
								style={styles.avatar}
								resizeMode="contain"
							/>
						)}
						<Text style={styles.username}>{senderId}</Text>
					</View>
				)}
				<View style={messageStyle}>
					<Text style={textStyle}>{message}</Text>
				</View>
				<Text style={styles.timestamp}>{isoTimeStamp}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	outgoingContainer: {
		alignItems: "flex-end",
		marginVertical: 6,
		paddingHorizontal: 32,
	},
	incomingContainer: {
		alignItems: "flex-start",
		marginVertical: 6,
		paddingHorizontal: 32,
	},
	messageWrapper: {
		maxWidth: "80%",
	},
	userInfo: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 4,
		gap: 6,
	},
	avatar: {
		width: 18,
		height: 18,
		borderRadius: 25,
	},
	username: {
		fontFamily: "Archivo",
		fontSize: 14,
		fontWeight: "500",
	},
	incomingMessage: {
		backgroundColor: "#F0F0F0",
		borderRadius: 10,
		padding: 12,
	},
	outgoingMessage: {
		backgroundColor: "#23C2EE",
		borderRadius: 10,
		padding: 12,
	},
	incomingText: {
		color: "#000000",
		fontSize: 14,
	},
	outgoingText: {
		color: "#FFFFFF",
		fontSize: 14,
	},
	timestamp: {
		fontSize: 12,
		color: "#8C8C8C",
		marginTop: 4,
		paddingHorizontal: 12,
	},
});
