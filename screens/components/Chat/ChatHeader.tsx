import * as React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ChatHeaderProps } from "./types";

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  themeTitle,
  memberCount,
  onSettingsPress,
  onNotificationsPress,
  onMenuPress,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <View style={styles.themeInfo}>
          <Image
            source={{
              uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/45998531dc3f7c079cc79046d8f66085b23cf1e513954095aec35d31cad5463c?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
            }}
            style={styles.themeIcon}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.themeTitle}>Thematique : {themeTitle}</Text>
            <Text style={styles.memberCount}>{memberCount} membres</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={onSettingsPress}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/7d5ce998d880ebd93f7e42934c2b3a0b7aaf3329475c75a3b5cecb0a5498ba7f?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
              }}
              style={styles.actionIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onNotificationsPress}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/16356548a14c12b9eb3d894ed437a13a3507a8f44b7010e545a935c2419b867a?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
              }}
              style={styles.actionIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onMenuPress}>
            <Image
              source={{
                uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/84187743e76546f291095c60362c9f438b5862430bbe580cf1f7ee9fd7234db4?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
              }}
              style={styles.actionIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#D9D9D9",
    padding: 8,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 40,
  },
  themeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  themeIcon: {
    width: 24,
    height: 24,
  },
  themeTitle: {
    fontSize: 14,
    fontFamily: "Archivo",
    fontWeight: "500",
  },
  memberCount: {
    fontSize: 12,
    color: "#919191",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 23,
  },
  actionIcon: {
    width: 18,
    height: 18,
  },
});
