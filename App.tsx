import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer, Theme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider, useAtom } from "jotai";
import React from "react";
import { Platform } from "react-native";
import { NAV_THEME } from "./libs/constants";
import { useColorScheme } from "./libs/useColorScheme";
import { jwtAtom } from "./screens/states/user";

// Screens
import APIsScreen from "./screens/APIs";
import EnvironmentScreen from "./screens/Environment";
import MapStyle from "./screens/Map";
import QCTScreen from "./screens/QCTScreen";
import StatesScreen from "./screens/States";
import UserProfile from "./screens/UserProfile";
import UserSignInScreen from "./screens/UserSignIn";
import UserSignUpScreen from "./screens/UserSignUp";
import ChatList from "./screens/components/Chat/ChatList";
import ChatScreen from "./screens/components/Chat/ChatScreen";
import NewChat from "./screens/components/Chat/NewChat";
import ProScreen from "./screens/components/Pro/ProScreen";

// Tab Icons (you can use your preferred icon library)
import { Icon } from "components/ui/icon";
import { Home, Map, MessageCircle, User } from "lucide-react-native";

const LIGHT_THEME: Theme = {
	dark: false,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	dark: true,
	colors: NAV_THEME.dark,
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
function MainTabs() {
	return (
		<Tab.Navigator
			screenOptions={{
				tabBarStyle: {
					backgroundColor: "#fff",
					borderTopWidth: 0,
					elevation: 10,
				},
				tabBarActiveTintColor: "#007AFF",
				tabBarInactiveTintColor: "#8E8E93",
			}}
		>
			<Tab.Screen
				name="Home"
				component={QCTScreen}
				options={{
					tabBarIcon: ({ color }) => (
						<Icon as={Home} color={color} size="xl" />
					),
					headerShown: false,
				}}
			/>
			<Tab.Screen
				name="Chat"
				component={ChatList}
				options={{
					tabBarIcon: ({ color }) => (
						<Icon as={MessageCircle} color={color} size="xl" />
					),
					headerShown: false,
				}}
			/>
			<Tab.Screen
				name="Map"
				component={MapStyle}
				options={{
					tabBarIcon: ({ color }) => (
						<Icon as={Map} color={color} size="xl" />
					),
					headerShown: false,
				}}
			/>
			{/* <Tab.Screen
				name="Professionals"
				component={Professionnals}
				options={{
					tabBarIcon: ({ color }) => (
						<Icon as={Briefcase} color={color} size="xl" />
					),
					headerShown: false,
				}}
			/> */}
			<Tab.Screen
				name="Profile"
				component={UserProfile}
				options={{
					tabBarIcon: ({ color }) => (
						<Icon as={User} color={color} size="xl" />
					),
					headerShown: false,
				}}
			/>
		</Tab.Navigator>
	);
}

// Auth Stack
function AuthStack() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="SignIn" component={UserSignInScreen} />
			<Stack.Screen name="SignUp" component={UserSignUpScreen} />
		</Stack.Navigator>
	);
}

// Main App Component
export default function App(): React.JSX.Element {
	const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
	const [jwt] = useAtom(jwtAtom);

	React.useEffect(() => {
		(async () => {
			const theme = await AsyncStorage.getItem("theme");
			if (Platform.OS === "web") {
				document.documentElement.classList.add("bg-background");
			}

			if (!theme) {
				await AsyncStorage.setItem("theme", colorScheme);
				setIsColorSchemeLoaded(true);
				return;
			}

			const colorTheme = theme === "dark" ? "dark" : "light";
			if (colorTheme !== colorScheme) {
				setColorScheme(colorTheme);
			}
			setIsColorSchemeLoaded(true);
		})().catch(console.error);
	}, []);

	if (!isColorSchemeLoaded) {
		return null;
	}

	return (
		<GluestackUIProvider mode={isDarkColorScheme ? "dark" : "light"}>
			<Provider>
				<NavigationContainer
					theme={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}
				>
					<Stack.Navigator screenOptions={{ headerShown: false }}>
						{jwt ? (
							<>
								<Stack.Screen
									name="Main"
									component={MainTabs}
								/>
								<Stack.Screen
									name="Environment"
									component={EnvironmentScreen}
								/>
								<Stack.Screen
									name="APIs"
									component={APIsScreen}
								/>
								<Stack.Screen
									name="States"
									component={StatesScreen}
								/>
								<Stack.Screen
									name="ChatScreen"
									component={ChatScreen}
								/>
								<Stack.Screen
									name="NewChat"
									component={NewChat}
								/>
								<Stack.Screen
									name="Pro"
									component={ProScreen}
								/>
							</>
						) : (
							<Stack.Screen name="Auth" component={AuthStack} />
						)}
					</Stack.Navigator>
				</NavigationContainer>
			</Provider>
		</GluestackUIProvider>
	);
}
