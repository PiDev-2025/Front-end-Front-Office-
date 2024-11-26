import React from "react";
import { SafeAreaView, Text, Button } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { List, MD3Colors } from "react-native-paper";
import { GIT_TAG, API_URL } from "@env";
function EnvironmentScreen(): React.JSX.Element {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <List.Section style={{ marginLeft: 20 }}>
        <List.Item
          title={`GIT_TAG=${GIT_TAG}`}
          left={() => <List.Icon icon="folder" />}
        />
        <List.Item
          title={`API_URL=${API_URL}`}
          left={() => <List.Icon color={MD3Colors.tertiary70} icon="folder" />}
        />
      </List.Section>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </SafeAreaView>
  );
}

export default EnvironmentScreen;
