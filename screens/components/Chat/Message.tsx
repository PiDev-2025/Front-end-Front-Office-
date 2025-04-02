import * as React from "react";
import { Image, StyleSheet, View } from "react-native";
import { jwtDecodedAtom } from "../../states/user";
import { MessageProps } from "./types";
import { useAtom } from "jotai";
import { MessageBubble } from "./MessageBubble";

export const Message: React.FC<MessageProps> = ({
	avatar,
	message,
	username,
	timestamp,
	isOutgoing = false,
}) => {
	return (
		<View style={styles.container}>
			<MessageBubble
				message={message}
				timestamp={timestamp}
				isOutgoing={isOutgoing}
				username={!isOutgoing ? username : undefined}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		marginVertical: 4,
	},
});
