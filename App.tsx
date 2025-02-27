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
import APIsScreen from "./screens/APIs";
import EnvironmentScreen from "./screens/Environment";
import QCTScreen from "./screens/QCTScreen";
import StatesScreen from "./screens/States";
import UserProfile from "./screens/UserProfile";
import UserSignInScreen from "./screens/UserSignIn";
import UserSignUpScreen from "./screens/UserSignUp";
import VideoChatScreen from "./screens/VideoChat";
import ChatList from "./screens/components/Chat/ChatList";
import ChatScreen from "./screens/components/Chat/ChatScreen";
import NewChat from "./screens/components/Chat/NewChat";
import ProScreen from "./screens/components/Pro/ProScreen";
import { jwtAtom } from "./screens/states/user";

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
function UserTabs() {
	return (
		<TabUser.Navigator>
			<TabUser.Screen name="UserSignIn" component={UserSignInScreen} />
			<TabUser.Screen name="UserSignUp" component={UserSignUpScreen} />
		</TabUser.Navigator>
	);
}

// --- JOTAIL ---
import { Provider, createStore } from "jotai";
import { DevTools } from "jotai-devtools";
import "jotai-devtools/styles.css";
const customStore = createStore();

// App.(js|ts)
export default function App(): React.JSX.Element {
	const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
	const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);
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
			SplashScreen.hideAsync();
		});
	}, []);

	if (!isColorSchemeLoaded) {
		return null;
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
				<Provider store={customStore}>
					<DevTools store={customStore} />
					<NavigationContainer>
						<Stack.Navigator initialRouteName="User">
							{jwtAtom ? (
								<>
									<Stack.Screen
										name="SympathyWorld"
										component={QCTScreen}
										options={{
											headerShown: true,
										}}
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
										name="Chat"
										component={ChatScreen}
										options={{
											headerShown: false,
										}}
									/>
									<Stack.Screen
										name="VideoChat"
										component={VideoChatScreen}
									/>
									<Stack.Screen
										name="ChatList"
										component={ChatList}
									/>
									<Stack.Screen
										name="NewChat"
										component={NewChat}
									/>
									<Stack.Screen
										name="ChatScreen"
										component={ChatScreen}
										initialParams={{
											roomId: "1337",
										}}
									/>
									<Stack.Screen
										name="User"
										component={UserTabs}
										options={{
											headerShown: true,
										}}
									/>
									<Stack.Screen
										name="UserProfile"
										component={UserProfile}
										options={{
											headerShown: true,
										}}
									/>
									<Stack.Screen
										name="Pro"
										component={ProScreen}
										options={{
											headerShown: true,
										}}
									/>
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
				</Provider>
			</ThemeProvider>
		</GluestackUIProvider>
	);
}
