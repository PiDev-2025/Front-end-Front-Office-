// https://recoiljs.org/docs/guides/asynchronous-data-queries

import React from "react";
import { View, Text } from "react-native";
import { useAtom } from "jotai";
import { jwtAtom } from "./states/user";

export const States: React.FC = () => {
	const [jwt] = useAtom(jwtAtom);

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<Text>JWT: {jwt}</Text>
		</View>
	);
};
