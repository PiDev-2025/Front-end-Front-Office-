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
import { SafeAreaView, StyleSheet, ImageBackground } from "react-native";
import {
	emailAtom,
	jwtAtom,
	jwtDecodedAtom,
	passwordAtom,
	userIDAtom,
} from "../../states/user";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { api } from '../../../libs/api';
import apiClient, { useInitializeApiClient } from '../../../libs/apiClient';

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

	// Initialize the API client with the token atom
	useInitializeApiClient();

	const handleState = () => {
		setShowPassword((showState) => !showState);
	};

	const signinUser = async () => {
		try {
			if (email && password) {
				console.log('Attempting to sign in with:', { email });
				const response = await apiClient.login({ email, password });
				const token = response.token;
				if (token) {
					setJwt(token);
					const _jwtDecoded = jwtDecode<CustomJwtPayload>(token);
					setJwtDecoded(_jwtDecoded);
					if (_jwtDecoded.ID) {
						setUserID(_jwtDecoded.ID);
					}
					navigation.navigate("NoelisGarden" as never);
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
			<ImageBackground
				source={require('../../assets/background.gif')}
				style={styles.background}
				resizeMode="cover"
				loadingIndicatorSource={require('../../assets/background.gif')}
				defaultSource={require('../../assets/background.gif')}
			>
				<Card style={styles.card}>
					<VStack space="md" style={styles.form}>
						<Heading size="xl" style={styles.title}>Noelis</Heading>
						<Heading size="sm" style={styles.title}>connection</Heading>
						{error && <Text style={styles.error}>{error}</Text>}
						<FormControl>
							<Input>
								<InputField
									placeholder="Email"
									value={email || ''}
									onChangeText={setEmail}
									autoCapitalize="none"
									keyboardType="email-address"
								/>
							</Input>
						</FormControl>
						<FormControl>
							<Input>
								<InputField
									placeholder="Password"
									value={password || ''}
									onChangeText={setPassword}
									secureTextEntry={!showPassword}
								/>
								<InputSlot onPress={handleState}>
									<InputIcon as={showPassword ? EyeOffIcon : EyeIcon} />
								</InputSlot>
							</Input>
						</FormControl>
						<Button onPress={signinUser}>
							<ButtonText>Sign In</ButtonText>
						</Button>
					</VStack>
				</Card>
			</ImageBackground>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	background: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	card: {
		width: '90%',
		maxWidth: 400,
		padding: 20,
		backgroundColor: 'rgba(255, 255, 255, 0.9)', // Add some transparency
	},
	form: {
		width: '100%',
	},
	title: {
		textAlign: 'center',
		marginBottom: 20,
	},
	error: {
		color: 'red',
		textAlign: 'center',
		marginBottom: 10,
	},
}); 