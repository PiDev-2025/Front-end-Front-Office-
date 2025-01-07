import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  View,
  useColorScheme,
} from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";

import Section from "./components/Section";
// import {Button as PaperButton} from 'react-native-paper';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
          {/* <Text style={{ fontSize: 20, textAlign: "center", marginTop: 25 }}>
            SympathyWorld - 0.0.1
          </Text> */}
          {/* <Section title="Environment" /> */}
          {/* <Section title="APIs" /> */}
          {/* <Section title="States" /> */}
          <Section title="User" />
          <Section title="UserProfile" />
          <Section title="ChatList" />
          {/* <Section title="VideoChat" /> */}
          {/* <Section title="Chats" /> */}
          {/* <LearnMoreLinks /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default QCTScreen;
