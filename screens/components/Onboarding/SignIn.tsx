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
import { SafeAreaView, StyleSheet } from "react-native";
import { ElysiaClient } from "ts-elysia-client/src/client";
import {
	emailAtom,
	jwtAtom,
	jwtDecodedAtom,
	passwordAtom,
	userIDAtom,
} from "../../states/user";
import LinearGradient from 'react-native-linear-gradient';
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { getRandomProfessionalStyle } from "../../styles/professionalStyles";

// Custom interface for JWT payload
interface CustomJwtPayload {
	ID: string;
	[key: string]: any;
}

export function SignIn(): React.JSX.Element {
	const navigation = useNavigation();
	const [email, setEmail] = useAtom(emailAtom);
	const [password, setPassword] = useAtom(passwordAtom);
	const [userId, setUserID] = useAtom(userIDAtom);
	const [jwt, setJwt] = useAtom(jwtAtom);
	const [jwtDecoded, setJwtDecoded] = useAtom(jwtDecodedAtom);
	const [showPassword, setShowPassword] = React.useState(false);
	const [error, setError] = React.useState<string | null>(null);
	const [gradientStyle, setGradientStyle] = React.useState(getRandomProfessionalStyle());
	const apiClient = React.useMemo(() => {
		const client = ElysiaClient.getInstance();
		client.setEnvironment('production');
		return client;
	}, []);

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

	const signinUser = async () => {
		try {
			if (email && password) {
				console.log('Attempting to sign in with:', { email });
				const response = await apiClient.signIn(email, password);
				const token = response.jwt;
				if (token) {
					setJwt(token);
					const _jwtDecoded = jwtDecode<CustomJwtPayload>(token);
					setJwtDecoded(_jwtDecoded);
					if (_jwtDecoded.ID) {
						setUserID(_jwtDecoded.ID);
					}
					navigation.navigate("SympathyWorld" as never);
				} else {
					throw new Error("No token received");
				}
			} else {
				setError("Please fill in all fields");
			}
		} catch (error) {
			console.error("Error signing in:", error);
			if (error instanceof Error) {
				if (error.message.includes('Network request failed')) {
					setError("Unable to connect to the server. Please check your internet connection and try again.");
				} else if (error.message.includes('HTTP error! status: 401')) {
					setError("Invalid email or password");
				} else if (error.message.includes('HTTP error! status: 404')) {
					setError("Server not found. Please try again later.");
				} else {
					setError(error.message);
				}
			} else {
				setError("An unexpected error occurred. Please try again.");
			}
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
								Bienvenue
							</Heading>
							<Text size="sm" className="text-white/80 text-center">
								{/* Sign in to continue your journey */}
							</Text>
						</VStack>

						<VStack space="md">
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
									</Input>
								</VStack>
							</FormControl>

							<FormControl>
								<VStack space="xs">
									<Text size="sm" className="text-white" style={{ color: "#ffffff" }}>Password</Text>
									<Input>
										<InputField
											type={showPassword ? "text" : "password"}
											value={password || ""}
											onChangeText={(text) => setPassword(text)}
											placeholder="Enter your password"
											style={{ color: "#ffffff" }}
											placeholderTextColor="#ffffff80"
										/>
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
								onPress={signinUser}
								style={{
									backgroundColor: "#ffffff",
								}}
							>
								<ButtonText style={{ color: "#6366f1" }}>Connexion</ButtonText>
							</Button>

							<HStack space="sm" className="justify-center mt-4">
								<Button
									variant="link"
									onPress={() => navigation.navigate("UserSignUp" as never)}
								>
									<ButtonText size="xs" style={{ color: "#ffffff" }}>
										Vous n'avez pas de compte ? Enregistrez-vous
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
}); 