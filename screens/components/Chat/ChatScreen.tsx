import * as React from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { ChatHeader } from "./ChatHeader";
import { Feedback } from "./FeedBack";
import { Message } from "./Message";
import { ChatInput } from "./ChatInput";
import { MessageProps } from "./types";
import ChatList from "./ChatList";
const initialMessages: MessageProps[] = [
  {
    avatar:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/09534b4d2a9ac3383cb3858912714a3bdea0d5a6dba0627671943b17493dfabc?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
    username: "Sandra",
    message: "Hello comment vas-tu ?",
    timestamp: "10min ago",
  },
  {
    message: "Salut ça va super et toi ?",
    timestamp: "10min ago",
    username: "User",
    isOutgoing: true,
  },
  // Add all other messages here
];

export const ChatScreen: React.FC = () => {
  const [messages, setMessages] =
    React.useState<MessageProps[]>(initialMessages);

  const scrollViewRef = React.useRef<ScrollView>(null);
  const chatList = React.useState<boolean>(null);
  const handleSend = (message: string) => {
    setMessages([
      ...messages,
      {
        message,
        timestamp: "Just now",
        username: "User",
        isOutgoing: true,
      },
    ]);
  };
  // return <ChatList />;
  if (chatList) {
    return <ChatList />;
  }
  return (
    <View style={styles.container}>
      <ChatHeader
        themeTitle="Anxiété"
        memberCount={308}
        onSettingsPress={() => {}}
        onNotificationsPress={() => {}}
        onMenuPress={() => {}}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ flexGrow: 1 }}
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {/* <Feedback
          question="Cette conversation vous est-elle utile ?"
          onYes={() => {}}
          onNo={() => {}}
        /> */}
        {messages.map((msg, index) => (
          <Message key={index} {...msg} />
        ))}
      </ScrollView>
      <ChatInput onSend={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // maxWidth: 480,
    width: "100%",
    marginHorizontal: "auto",
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
});
