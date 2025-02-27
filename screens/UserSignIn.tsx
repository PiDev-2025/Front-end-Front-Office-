import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import { jwtDecode } from "jwt-decode";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import React from "react";
import { SafeAreaView, Text } from "react-native";
import { userSignIn } from "./apis/User";
import {
	emailAtom,
	jwtAtom,
	jwtDecodedAtom,
	passwordAtom,
	userIDAtom,
	usernameAtom,
} from "./states/user";
function UserSignIn(): React.JSX.Element {
	const navigation = useNavigation();
	const [username, setUsername] = useAtom(usernameAtom);
	const [email, setEmail] = useAtom(emailAtom);
	const [password, setPassword] = useAtom(passwordAtom);
	const [userId, setUserID] = useAtom(userIDAtom);
	const [jwt, setJwt] = useAtom(jwtAtom);
	const [jwtDecoded, setJwtDecoded] = useAtom(jwtDecodedAtom);
	const [showPassword, setShowPassword] = React.useState(false);
	const handleState = () => {
		setShowPassword((showState) => !showState);
	};
	const signinUser = async () => {
		try {
			if (username && email && password) {
				const data = await userSignIn(email, password);
				if (!data) {
					throw new Error("Failed to sign in");
				} else {
					// console.log(data);
					setJwt(data);
					if (data) {
						const _jwtDecoded = jwtDecode(data);
						setJwtDecoded(_jwtDecoded);
						// console.log("jwtDecoded", _jwtDecoded);
						if (_jwtDecoded.ID) {
							setUserID(_jwtDecoded.ID);
							console.log(`userID:${userId}`);
							// await AsyncStorage.setItem("userID", userID);
						}
					}
				}
				navigation.navigate("SympathyWorld", {});
			} else {
				console.error("userID cannot be null");
			}
		} catch (error) {
			console.error("Error fetching more items:", error);
		}
	};

	return (
		<SafeAreaView>
			<Box className="justify-center h-full ">
				<FormControl className="p-4 border border-outline-300">
					<VStack space="xl">
						<VStack space="xs">
							<Text className="text-typography-500">Email</Text>
							<Input className="min-w-[250px]">
								<InputField
									type="text"
									value={email || ""}
									onChangeText={(text) => setEmail(text)}
								/>
							</Input>
						</VStack>
						<VStack space="xs">
							<Text className="text-typography-500">
								Password
							</Text>
							<Input className="text-center">
								<InputField
									type={showPassword ? "text" : "password"}
									value={password || ""}
									onChangeText={(text) => setPassword(text)}
								/>
								<InputSlot
									className="pr-3"
									onPress={handleState}
								>
									<InputIcon
										as={showPassword ? EyeIcon : EyeOffIcon}
									/>
								</InputSlot>
							</Input>
						</VStack>
						<Button
							variant="solid"
							className="mt-2"
							onPress={signinUser}
						>
							<ButtonText>SignIn</ButtonText>
						</Button>
					</VStack>
				</FormControl>
				{/* <Text> {jwt}</Text> */}
			</Box>
		</SafeAreaView>
	);
}

// Main screen
function UserSignInScreen(): React.JSX.Element {
	return (
		<SafeAreaView style={{ flex: 1, padding: 20 }}>
			<UserSignIn />
		</SafeAreaView>
	);
}

export default UserSignInScreen;
