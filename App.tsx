import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import React from "react";
import "./global.css";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
	NavigationContainer,
	Theme,
	ThemeProvider,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform } from "react-native";
import { NAV_THEME } from "./libs/constants";
import { useColorScheme } from "./libs/useColorScheme";
// import APIsScreen from "./screens/APIs";
// import EnvironmentScreen from "./screens/Environment";
import Map from "./screens/Map";
// import ProfessionalProfile from "./screens/ProfessionalProfile";
import QCTScreen from "./screens/QCTScreen";
// import StatesScreen from "./screens/States";
// import UserProfile from "./screens/UserProfile";
import UserSignInScreen from "./screens/UserSignIn";
import UserSignUpScreen from "./screens/UserSignUp";
import { ChatList } from "./screens/components/Chat/ChatList";
import ChatScreen from "./screens/components/Chat/ChatScreen";
import NewChat from "./screens/components/Chat/NewChat";
import ProScreen from "./screens/components/Pro/ProScreen";
import Program from "./screens/components/Program/Program";
import MoodLabScreen from "./screens/components/MoodLab/MoodLabScreen";
import DesignerScreen from "./screens/components/Designer/DesignerScreen";
import { jwtAtom } from "./screens/states/user";
import { UploadScreen } from "./screens/components/Upload/UploadScreen";
import { ModeUserScreen } from "./screens/components/ModeUser/ModeUser";
import ModeUserLayout from "./screens/components/ModeUser/ModeUserLayout";
import { ModeUserSettings } from "./screens/components/ModeUser/ModeUserSettings";
import { ModeUserThemes } from "./screens/components/ModeUser/ModeUserThemes";

// Import ChatV2 screens
import ChatV2ListScreen from './screens/components/ChatV2/ChatV2ListScreen';
import ChatV2RoomScreen from './screens/components/ChatV2/ChatV2RoomScreen';
import ChatV2NewRoomScreen from './screens/components/ChatV2/ChatV2NewRoomScreen';

// Import API Client initialization
import { useInitializeApiClient } from './libs/apiClient'; 
import { initializeStorage, useSetStorageInitialized, isStorageInitializedAtom } from '@/api-client/api-client/src/storage';
import { ActivityIndicator, View } from 'react-native';
import { useAtomValue } from 'jotai';

// --- JOTAIL --- Import Jotai Provider and store
import { Provider as JotaiProvider, createStore } from "jotai";

// Initialize storage for Jotai atomWithStorage *before* component definition
initializeStorage(AsyncStorage);

const LIGHT_THEME: Theme = {
	dark: false,
	colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
	dark: true,
	colors: NAV_THEME.dark,
};

// const UserTabs = createBottomTabNavigator({
//   screens: {
//     SignUp: UserScreen,
//     SignIn: UserScreen,
//   },
// });
// const Stack = createStackNavigator({
//   screens: {
//     User: {
//       screen: UserTabs,
//     },
//   },
// });
const Stack = createStackNavigator();
const TabUser = createBottomTabNavigator();
import { LogIn, Mail, User } from "lucide-react-native";

function UserTabs() {
	return (
		<TabUser.Navigator
			screenOptions={{
				tabBarStyle: {
					backgroundColor: 'rgba(255, 255, 255, 0.9)',
					borderTopWidth: 0,
					elevation: 0,
					height: 60,
					paddingBottom: 8,
				},
				tabBarActiveTintColor: '#6366f1',
				tabBarInactiveTintColor: '#94a3b8',
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: '500',
				},
			}}
		>
			<TabUser.Screen 
				name="UserSignIn" 
				component={UserSignInScreen} 
				options={{ 
					headerShown: false,
					tabBarLabel: 'Connexion',
					tabBarIcon: ({ color }) => (
						<LogIn size={24} color={color} />
					),
				}}
			/>
			<TabUser.Screen 
				name="UserSignUp" 
				component={UserSignUpScreen} 
				options={{ 
					headerShown: false,
					tabBarLabel: 'Enregistrement', 
					tabBarIcon: ({ color }) => (
						<User size={24} color={color} />
					),
				}}
			/>
		</TabUser.Navigator>
	);
}

// Create Jotai store
const customStore = createStore();

// App.(js|ts)
export default function App(): React.JSX.Element {
	const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

	// Get storage initialization status
	const isStorageReady = useAtomValue(isStorageInitializedAtom);

	// Initialize API client (runs on every render, but ok)
	useInitializeApiClient();

	// Hook to set storage initialized (runs only once)
	const setStorageInitialized = useSetStorageInitialized();
	React.useEffect(() => {
	  setStorageInitialized();
	}, [setStorageInitialized]);

	// Theme loading effect
	React.useEffect(() => {
		(async () => {
			const theme = await AsyncStorage.getItem("theme");
			if (Platform.OS === "web") {
				// Adds the background color to the html element to prevent white background on overscroll.
				document.documentElement.classList.add("bg-background");
			}
			if (!theme) {
				AsyncStorage.setItem("theme", colorScheme);
				setIsColorSchemeLoaded(true);
				return;
			}
			const colorTheme = theme === "dark" ? "dark" : "light";
			if (colorTheme !== colorScheme) {
				setColorScheme(colorTheme);

				setIsColorSchemeLoaded(true);
				return;
			}
			setIsColorSchemeLoaded(true);
		})().finally(() => {
			// SplashScreen.hideAsync(); // Keep this commented if causing errors
		});
	}, [colorScheme, setColorScheme]); // Added dependencies

	// **** Wait for BOTH color scheme AND storage to be ready ****
	if (!isColorSchemeLoaded || !isStorageReady) {
		// Show a loading indicator while waiting
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" />
			</View>
		);
	}

	return (
		<GluestackUIProvider mode="light">
			<ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
				{/* <PostHogProvider
          apiKey="phc_DehZjG9DpbcKUWsd29cmJFfYFp18l8SRE5Cof5Mt2wR"
          options={{
            host: "https://us.i.posthog.com",
			}}
			> */}
				<JotaiProvider store={customStore}>
					{/* <DevTools store={customStore} /> */}
					<NavigationContainer>
						<Stack.Navigator initialRouteName="User">
							{jwtAtom ? (
								<>
									<Stack.Screen
										name="NoelisGarden"
										component={QCTScreen}
										options={{
											headerShown: true,
										}}
									/>
									{/* <Stack.Screen
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
									/> */}
									<Stack.Screen
										name="Chat"
										component={ChatScreen}
										options={{
											headerShown: true,
										}}
									/>
									<Stack.Screen
										name="ChatList"
										component={ChatList}
										options={{
											headerShown: true,
											title: "Conversations",
										}}
									/>
									<Stack.Screen
										name="NewChat"
										component={NewChat}
										options={{
											headerShown: true,
											title: "New Chat",
										}}
									/>
									<Stack.Screen
										name="ChatScreen"
										component={ChatScreen}
										initialParams={{
											roomId: "1337",
										}}
										options={{
											headerShown: true,
										}}
									/>
									<Stack.Screen
										name="User"
										component={UserTabs}
										options={{
											headerShown: false,
										}}
									/>
									{/* <Stack.Screen
										name="UserProfile"
										component={UserProfile}
										options={{
											headerShown: true,
										}}
									/> */}
									<Stack.Screen
										name="Pro"
										component={ProScreen}
										options={{
											headerShown: true,
										}}
									/>
									<Stack.Screen
										name="Map"
										component={Map}
										options={{
											headerShown: true,
										}}
									/>
									<Stack.Screen
										name="Programs"
										component={Program}
										options={{
											headerShown: true,
										}}
									/>
									<Stack.Screen
										name="MoodLab"
										component={MoodLabScreen}
										options={{
											headerShown: true,
										}}
									/>
									<Stack.Screen
										name="Designer"
										component={DesignerScreen} 
										options={{
											headerShown: true,
										}}
									/>
									<Stack.Screen
										name="Upload"
										component={UploadScreen}
										options={{
											headerShown: true,
											title: "Gestionnaire de médias",
										}}
									/>
									<Stack.Screen
										name="ModeUser"
										component={ModeUserScreen}
										options={{
											headerShown: true,
											title: "User Modes",
										}}
									/>
									<Stack.Screen
										name="ModeUserLayout"
										component={ModeUserLayout}
										options={{
											headerShown: true,
											title: "Mode Settings",
										}}
									/>
									<Stack.Screen
										name="ModeUserThemes"
										component={ModeUserThemes}
										options={{
											headerShown: true,
											title: "Themes",
										}}
									/>
									<Stack.Screen
										name="ModeUserQuizzes"
										component={ModeUserLayout}
										options={{
											headerShown: true,
											title: "Quizzes",
										}}
									/>
									<Stack.Screen
										name="ModeUserSettings"
										component={ModeUserSettings}
										options={{
											headerShown: true,
											title: "Settings",
										}}
									/>
									{/* Add ChatV2 Screens */}
									<Stack.Screen
										name="ChatV2List"
										component={ChatV2ListScreen}
										options={{
											headerShown: true,
											title: "Chat V2",
										}}
									/>
									<Stack.Screen
										name="ChatV2Room"
										component={ChatV2RoomScreen}
										options={({ route }) => ({
                      headerShown: true,
                      // @ts-expect-error // TODO: Fix type later
                      title: route.params?.roomName || 'Chat Room', // Dynamically set title if needed
                    })}
									/>
									<Stack.Screen
										name="ChatV2NewRoom"
										component={ChatV2NewRoomScreen}
										options={{
											headerShown: true,
											title: "New Chat Room",
										}}
									/>
									{/* <Stack.Screen
										name="ProfessionalProfile"
										component={ProfessionalProfile}
										options={{
											headerShown: true,
										}}
									/> */}
								</>
							) : (
								<Stack.Screen
									name="User"
									component={UserTabs}
									options={{ headerShown: false }}
								/>
							)}
						</Stack.Navigator>
						{/* </PostHogProvider> */}
					</NavigationContainer>
				</JotaiProvider>
			</ThemeProvider>
		</GluestackUIProvider>
	);
}
