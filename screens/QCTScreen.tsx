import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
} from "react-native";

import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Colors, LearnMoreLinks } from "react-native/Libraries/NewAppScreen";

import Section from "./components/Section";
// import {Button as PaperButton} from 'react-native-paper';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { GIT_TAG, API_URL } from "@env";

function QCTScreen(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}
        >
          <Text style={{ fontSize: 20, textAlign: "center", marginTop: 25 }}>
            SympathyWorld - 0.0.1
          </Text>
          <Section title="Environment" />
          <Section title="APIs" />
          <Section title="States" />
          <Section title="Chat" />
          <Section title="User" />
          <Section title="VideoChat" />
          <Section title="ThemeChatScreen" />
          {/* <LearnMoreLinks /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default QCTScreen;
