import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { useNavigation } from "@react-navigation/native";
import { useAtom } from "jotai";
import { jwtDecode } from "jwt-decode";
import { EyeIcon, EyeOffIcon, Mail, Lock, User } from "lucide-react-native";
import React from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { APIClient } from "@/elysia-client/src/client";
import {
	emailAtom,
	jwtAtom,
	jwtDecodedAtom,
	passwordAtom,
	usernameAtom,
} from "./states/user";
import LinearGradient from 'react-native-linear-gradient';
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { getRandomProfessionalStyle } from "./styles/professionalStyles";

// Custom interface for JWT payload
interface CustomJwtPayload {
	ID: string;
	[key: string]: any;
}

// Initialize API client
const apiClient = new APIClient(process.env.API_URL);

function UserSignUp(): React.JSX.Element {
	const navigation = useNavigation();
	const [username, setUsername] = useAtom(usernameAtom);
	const [email, setEmail] = useAtom(emailAtom);
	const [password, setPassword] = useAtom(passwordAtom);
	const [jwt, setJwt] = useAtom(jwtAtom);
	const [jwtDecoded, setJwtDecoded] = useAtom(jwtDecodedAtom);
	const [showPassword, setShowPassword] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [gradientStyle, setGradientStyle] = React.useState(getRandomProfessionalStyle());

	React.useEffect(() => {
		// Change gradient every 5 seconds
		const interval = setInterval(() => {
			setGradientStyle(getRandomProfessionalStyle());
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	const handleState = () => {
		setShowPassword((showState) => !showState);
	};

	const signupUser = async () => {
		try {
			if (username && email && password) {
				await apiClient.signUp({ email, password, name: username });
				const token = apiClient.getToken(); // You'll need to add this method to the client
				if (token) {
					setJwt(token);
					const _jwtDecoded = jwtDecode<CustomJwtPayload>(token);
					setJwtDecoded(_jwtDecoded);
					navigation.navigate("UserProfile" as never);
				} else {
					throw new Error("No token received");
				}
			} else {
				setError("Please fill in all fields");
			}
		} catch (error) {
			console.error("Error signing up:", error);
			setError("Failed to create account");
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			{/* Background Gradient */}
			<Box style={StyleSheet.absoluteFill}>
				<LinearGradient
					colors={['#6366f1', '#818cf8', '#a5b4fc']}
					style={StyleSheet.absoluteFill}
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
				/>
			</Box>

			{/* Content */}
			<Box className="flex-1 justify-center items-center px-4">
				<Card className="w-full max-w-md p-6 rounded-xl bg-white/10 border-white/20">
					<VStack space="xl">
						<VStack space="sm" className="items-center">
							<Heading size="xl" className="text-center" style={{ color: "#ffffff" }}>
								Créer un compte
							</Heading>
							<Text size="sm" className="text-white/80 text-center">
								{/* Sign up to start your journey */}
							</Text>
						</VStack>

						<VStack space="md">
							<FormControl>
								<VStack space="xs">
									<Text size="sm" className="text-white" style={{ color: "#ffffff" }}>Nom d'utilisateur</Text>
									<Input>
										<InputField
											type="text"
											value={username || ""}
											onChangeText={(text) => setUsername(text)}
											placeholder="Enter your username"
											style={{ color: "#ffffff" }}
											placeholderTextColor="#ffffff80"
										/>
										<InputSlot className="pr-3">
											{/* <InputIcon as={User} style={{ color: "#ffffff" }} /> */}
										</InputSlot>
									</Input>
								</VStack>
							</FormControl>

							<FormControl>
								<VStack space="xs">
									<Text size="sm" className="text-white" style={{ color: "#ffffff" }}>Email</Text>
									<Input>
										<InputField
											type="text"
											value={email || ""}
											onChangeText={(text) => setEmail(text)}
											placeholder="Enter your email"
											style={{ color: "#ffffff" }}
											placeholderTextColor="#ffffff80"
										/>
										<InputSlot className="pr-3">
											{/* <InputIcon as={Mail} style={{ color: "#ffffff" }} /> */}
										</InputSlot>
									</Input>
								</VStack>
							</FormControl>

							<FormControl>
								<VStack space="xs">
									<Text size="sm" className="text-white" style={{ color: "#ffffff" }}>Mot de passe</Text>
									<Input>
										<InputField
											type={showPassword ? "text" : "password"}
											value={password || ""}
											onChangeText={(text) => setPassword(text)}
											placeholder="Enter your password"
											style={{ color: "#ffffff" }}
											placeholderTextColor="#ffffff80"
										/>
										<InputSlot className="pr-3">
											{/* <InputIcon as={Lock} style={{ color: "#ffffff" }} /> */}
										</InputSlot>
										<InputSlot
											className="pr-3"
											onPress={handleState}
										>
											<InputIcon
												as={showPassword ? EyeIcon : EyeOffIcon}
												style={{ color: "#ffffff" }}
											/>
										</InputSlot>
									</Input>
								</VStack>
							</FormControl>

							{error && (
								<Text size="sm" style={{ color: '#EF4444' }}>
									{error}
								</Text>
							)}

							<Button
								variant="solid"
								size="md"
								className="mt-4"
								onPress={signupUser}
								style={{
									backgroundColor: "#ffffff",
								}}
							>
								<ButtonText style={{ color: "#6366f1" }}>S'inscrire</ButtonText>
							</Button>

							<HStack space="sm" className="justify-center mt-4">
								<Button
									variant="link"
									onPress={() => navigation.navigate("UserSignIn" as never)}
								>
									<ButtonText size="xs" style={{ color: "#ffffff" }}>
										Déjà un compte ? Connectez-vous
									</ButtonText>
								</Button>
							</HStack>
						</VStack>
					</VStack>
				</Card>
			</Box>
		</SafeAreaView>
	);
}

// Main screen
function UserSignUpScreen(): React.JSX.Element {
	return <UserSignUp />;
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
});

export default UserSignUpScreen;
