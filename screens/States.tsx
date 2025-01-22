// https://recoiljs.org/docs/guides/asynchronous-data-queries

import React from "react";
import { SafeAreaView, Text, TextInput, View } from "react-native";
import { RecoilRoot, atom, selector, useAtom, useRecoilValue } from "recoil";

// Define the text state atom
const textState = atom({
	key: "textState", // unique ID
	default: "", // default value
});

// Define the character count selector
const charCountState = selector({
	key: "charCountState", // unique ID
	get: ({ get }) => {
		const text = get(textState);
		return text.length;
	},
});

// Component for displaying the character counter
function CharacterCounter() {
	return (
		<View>
			<TextInputField />
			<CharacterCount />
		</View>
	);
}

// Input component
function TextInputField() {
	const [text, setText] = useAtom(textState);

	return (
		<View style={{ marginVertical: 10 }}>
			<TextInput
				style={{
					borderWidth: 1,
					borderColor: "#ccc",
					padding: 10,
					borderRadius: 5,
				}}
				placeholder="Type something..."
				value={text}
				onChangeText={setText} // React Native uses `onChangeText`
			/>
			<Text style={{ marginTop: 5 }}>Echo: {text}</Text>
		</View>
	);
}

// Character count display component
function CharacterCount() {
	const count = useRecoilValue(charCountState);

	return <Text>Character Count: {count}</Text>;
}

// Main screen
function StatesScreen(): React.JSX.Element {
	return (
		<RecoilRoot>
			<SafeAreaView style={{ flex: 1, padding: 20 }}>
				<CharacterCounter />
			</SafeAreaView>
		</RecoilRoot>
	);
}

export default StatesScreen;
