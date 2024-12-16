import * as React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type MessageProps = {
  avatar: string;
  name: string;
  message: string;
  time: string;
  isOwnMessage?: boolean;
};

type ChatHeaderProps = {
  memberCount: number;
  theme: string;
};

const messages: MessageProps[] = [
  {
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/09534b4d2a9ac3383cb3858912714a3bdea0d5a6dba0627671943b17493dfabc?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
    name: "Sandra",
    message: "Hello comment vas-tu ?",
    time: "10min ago",
  },
  {
    avatar: "",
    name: "",
    message: "Salut ça va super et toi ?",
    time: "10min ago",
    isOwnMessage: true,
  },
  {
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/d863ed261a67b538712ab4ace9351ef081280f520fe0b64e3a147b24af3b2a73?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
    name: "Eric",
    message: "Yes nickel alors tu as pensé quoi de Alien Romulus ?",
    time: "10min ago",
  },
  {
    avatar: "",
    name: "",
    message:
      "C'était génial j'ai adoré le casting est incroyable, le scénraio très réussi.\nVFX au top du top bref j'ai pris ma claque!",
    time: "10min ago",
    isOwnMessage: true,
  },
  {
    avatar: "",
    name: "",
    message: "Et toi du coup t'as kiffé aussi ou t'as pas été le voir encore ?",
    time: "10min ago",
    isOwnMessage: true,
  },
  {
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/f18c4920a9012333e564115bd6e68c3c3157b02f7f118b8af78fbcb330b78bee?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
    name: "Nicolas",
    message: "Hello comment vas-tu ?",
    time: "10min ago",
  },
  {
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/e9c0c0b6616c8fd5a8524dbdc954b7e5692dbae145cdb396f55366494489a2a6?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
    name: "Melina",
    message: "Hello tout le monde et bienvenue au nouveaux!",
    time: "10min ago",
  },
];

const ChatMessage = ({
  avatar,
  name,
  message,
  time,
  isOwnMessage,
}: MessageProps) => {
  if (isOwnMessage) {
    return (
      <View style={styles.ownMessageContainer}>
        <View style={styles.ownMessageContent}>
          <View style={styles.ownMessageBubble}>
            <Text style={styles.ownMessageText}>{message}</Text>
          </View>
          <View style={styles.messageTimeContainer}>
            <Text style={styles.messageTimeText}>{time}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.messageContainer}>
      <View style={styles.messageContent}>
        <View style={styles.userInfoContainer}>
          <Image
            style={styles.avatarImage}
            source={{ uri: avatar }}
            resizeMode="contain"
          />
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{name}</Text>
          </View>
        </View>
        <View style={styles.messageBubble}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
        <View style={styles.messageTimeContainer}>
          <Text style={styles.messageTimeText}>{time}</Text>
        </View>
      </View>
    </View>
  );
};

const ChatHeader = ({ memberCount, theme }: ChatHeaderProps) => (
  <View style={styles.headerContainer}>
    <View style={styles.headerContent}>
      <View style={styles.headerLeft}>
        <Image
          style={styles.backIcon}
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/45998531dc3f7c079cc79046d8f66085b23cf1e513954095aec35d31cad5463c?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
          }}
          resizeMode="contain"
        />
        <Image
          style={styles.groupIcon}
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/7949539254f43c9e57fd6c3131b3fcccb6596f0d9adbc61b0c91439ee01689d4?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
          }}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.themeText}>Thematique : {theme}</Text>
          <Text style={styles.memberCountText}>{memberCount} membres</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <Image
          style={styles.actionIcon}
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/7d5ce998d880ebd93f7e42934c2b3a0b7aaf3329475c75a3b5cecb0a5498ba7f?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
          }}
          resizeMode="contain"
        />
        <Image
          style={styles.actionIcon}
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/16356548a14c12b9eb3d894ed437a13a3507a8f44b7010e545a935c2419b867a?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
          }}
          resizeMode="contain"
        />
        <Image
          style={styles.actionIcon}
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/7891c6c9e61fb55499da760e2fd2d4d802b17c49f21767edf3556031034c40c0?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
          }}
          resizeMode="contain"
        />
      </View>
    </View>
  </View>
);

const ChatScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <ChatHeader memberCount={308} theme="Anxiété" />

          {/* <View style={styles.feedbackqs */}

          <View style={styles.messagesContainer}>
            {messages.map((msg, index) => (
              <ChatMessage key={index} {...msg} />
            ))}
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Écrire un message"
                  placeholderTextColor="rgba(145, 145, 145, 1)"
                />
              </View>
              <TouchableOpacity style={styles.sendButton}>
                <Image
                  style={styles.sendIcon}
                  source={{
                    uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/5f03c393f3102fd6c48d1b3bdfcffdff60c97615900b5cced378de053843dd63?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
                  }}
                  resizeMode="contain"
                />
                <Text style={styles.sendButtonText}>Envoyer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: "auto",
    maxWidth: 480,
    width: "100%",
  },
  contentWrapper: {
    height: 854,
    justifyContent: "space-between",
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderColor: "rgba(217, 217, 217, 1)",
    padding: 16,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  groupIcon: {
    width: 40,
    height: 40,
    borderRadius: 4,
  },
  themeText: {
    fontSize: 14,
    fontFamily: "Archivo",
    fontWeight: "500",
  },
  memberCountText: {
    fontSize: 12,
    color: "rgba(145, 145, 145, 1)",
  },
  headerRight: {
    flexDirection: "row",
    gap: 23,
  },
  actionIcon: {
    width: 18,
    height: 18,
  },
  feedbackContainer: {
    marginTop: 32,
    alignItems: "center",
  },
  feedbackContent: {
    borderWidth: 1,
    borderColor: "rgba(201, 243, 255, 1)",
    borderRadius: 10,
    padding: 16,
    width: 352,
    maxWidth: "100%",
  },
  feedbackTitle: {
    fontSize: 12,
    fontFamily: "Archivo",
    fontWeight: "600",
  },
  feedbackOptions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
  },
  feedbackOption: {
    fontSize: 12,
    color: "rgba(100, 100, 100, 1)",
    fontFamily: "Archivo",
    fontWeight: "500",
  },
  feedbackSlider: {
    flex: 1,
    height: 8,
  },
  sliderTrack: {
    flex: 1,
    justifyContent: "center",
  },
  sliderThumb: {
    width: 15,
    height: 15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(35, 194, 238, 1)",
  },
  messagesContainer: {
    marginTop: 32,
    paddingHorizontal: 32,
  },
  messageContainer: {
    paddingVertical: 2,
    marginBottom: 12,
  },
  messageContent: {
    maxWidth: "70%",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  avatarImage: {
    width: 18,
    height: 18,
    borderRadius: 25,
  },
  nameContainer: {
    justifyContent: "center",
  },
  nameText: {
    fontSize: 14,
    fontFamily: "Archivo",
    fontWeight: "500",
  },
  messageBubble: {
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
    padding: 12,
    marginTop: 4,
  },
  messageText: {
    fontSize: 14,
    color: "#000",
  },
  ownMessageContainer: {
    paddingVertical: 2,
    marginBottom: 12,
    alignItems: "flex-end",
  },
  ownMessageContent: {
    maxWidth: "70%",
  },
  ownMessageBubble: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    padding: 12,
  },
  ownMessageText: {
    fontSize: 14,
    color: "#FFF",
  },
  messageTimeContainer: {
    paddingHorizontal: 12,
    marginTop: 4,
  },
  messageTimeText: {
    fontSize: 12,
    color: "rgba(140, 140, 140, 1)",
  },
  inputContainer: {
    borderTopWidth: 1,
    borderColor: "rgba(217, 217, 217, 1)",
    padding: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  textInputContainer: {
    flex: 1,
    minWidth: 240,
  },
  textInput: {
    fontSize: 14,
    fontFamily: "Archivo",
    fontWeight: "500",
    color: "rgba(145, 145, 145, 1)",
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sendIcon: {
    width: 20,
    height: 20,
  },
  sendButtonText: {
    fontSize: 12,
    fontFamily: "Archivo",
    fontWeight: "700",
  },
});

export default ChatScreen;
