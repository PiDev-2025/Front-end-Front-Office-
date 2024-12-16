import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Theme, ThemeProvider } from "@react-navigation/native";
import EnvironmentScreen from "./screens/Environment";
import QCTScreen from "./screens/QCTScreen";
import APIsScreen from "./screens/APIs";
import StatesScreen from "./screens/States";
import ChatScreen from "./screens/Chat";
import UserScreen from "./screens/User";
import VideoChatScreen from "./screens/VideoChat";
import ChatsScreen from "./screens/Chats";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { NAV_THEME } from "./libs/constants";
import { useColorScheme } from "./libs/useColorScheme";
import { jwtState } from "./screens/states/user";

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
      <TabUser.Screen name="SignUp" component={UserScreen} />
      <TabUser.Screen name="SignIn" component={UserScreen} />
    </TabUser.Navigator>
  );
}

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
    <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SympathyWorld">
          {jwtState ? (
            <>
              <Stack.Screen
                name="SympathyWorld"
                component={QCTScreen}
                options={{ headerShown: true }}
              />
              <Stack.Screen name="Environment" component={EnvironmentScreen} />
              <Stack.Screen name="APIs" component={APIsScreen} />
              <Stack.Screen name="States" component={StatesScreen} />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{ headerShown: true }}
              />
              <Stack.Screen name="VideoChat" component={VideoChatScreen} />
              <Stack.Screen name="Chats" component={ChatsScreen} />
              <Stack.Screen name="User" component={UserTabs} />
            </>
          ) : (
            <Stack.Screen
              name="User"
              component={UserScreen}
              options={{ headerShown: true }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
