import { useRoute } from "@react-navigation/native";
import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRecoilState } from "recoil";
import { sfRoomMessages } from "../../states/chat";
import { jwtDecodedState } from "../../states/user";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { Message } from "./Message";

export const ChatScreen: React.FC = () => {
  const route = useRoute();
  const { room } = route.params;
  console.log(`roomId:${room}`);
  const [roomState, setRoomState] = useRecoilState(sfRoomMessages(room));
  const [jwtDecoded, setJwtDecoded] = useRecoilState(jwtDecodedState);
  // const addMessage = (newMessage) => {
  //   setRoomState((prevState) => ({
  //     ...prevState,
  //     messages: [...prevState.messages, newMessage],
  //     lastMessage: newMessage,
  //   }));
  // };

  const scrollViewRef = React.useRef<ScrollView>(null);
  const handleSend = (message: string) => {
    setRoomState((prevState) => ({
      ...prevState,
      messages: [
        ...prevState.messages,
        {
          message,
          timestamp: new Date().toISOString(),
          username: jwtDecoded.ID.split(":")[1],
        },
      ],
    }));
  };

  return (
    <View style={styles.container}>
      <ChatHeader
        themeTitle={room}
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
        {roomState.messages.map((msg, index) => (
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
