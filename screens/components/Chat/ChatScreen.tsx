import { useFocusEffect, useRoute } from "@react-navigation/native";
import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRecoilState } from "recoil";
import { get1V1Messages, send1V1Message } from "../../apis/Chat";
import { afRoomMessages, afRoomMessagesAmount } from "../../states/chat";
import { jwtDecodedState, jwtState } from "../../states/user";
import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { Message } from "./Message";
export const ChatScreen: React.FC = () => {
  const route = useRoute();
  const { room, usersInRoom } = route.params;
  console.log(`roomId:${room}`);
  const [jwt] = useRecoilState(jwtState);
  console.log(`jwt:${jwt.jwt}`);
  const [roomState, setRoomState] = useRecoilState(afRoomMessages(room));
  const [jwtDecoded, setJwtDecoded] = useRecoilState(jwtDecodedState);
  const myUserId = jwtDecoded.ID.split(":")[1];
  const otherUserId = usersInRoom[0].userId2;
  console.log(`myUserId:${myUserId}`, `otherUserId:${otherUserId}`);
  const scrollViewRef = React.useRef<ScrollView>(null);

  const handleSend = async (message: string) => {
    const now = new Date();
    console.log(now, now.toISOString());
    const msg = {
      message,
      isoTimeStamp: now.toISOString(),
      senderId: myUserId,
      timestamp: now.getTime(),
    };
    const response = await send1V1Message(
      room,
      myUserId,
      msg.message,
      msg.isoTimeStamp,
      msg.timestamp,
      jwt.jwt
    );
    console.log(response);
    setRoomState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, response],
    }));
    console.log(message.length);
  };
  // const resetRoomState = useResetRecoilState(afRoomMessages(room));
  // React.useEffect(() => {
  //   const intervalId = setInterval(async () => {
  //     await handleRefresh();
  //   }, 4000);
  // }, []);
  useFocusEffect(
    React.useCallback(() => {
      // Your effect code here
      console.log("Component is focused");
      const intervalId = setInterval(async () => {
        await handleRefresh();
      }, 4000);
      // This return function will run when the component is unfocused
      return () => {
        console.log("Component is unfocused");
        clearInterval(intervalId);
        // Clean up or stop whatever was started in useEffect
      };
    }, [])
  );
  // return () => clearInterval(intervalId);
  // const resetRoomState = useResetRecoilState(afRoomMessages(room));
  // });
  const [roomMessagesAmount, setRoomMessagesAmount] = useRecoilState(
    afRoomMessagesAmount(room)
  );
  const handleRefresh = async () => {
    // console.log("yo2");
    // const amount = await get1V1MessagesAmount(room, jwt.jwt);
    // console.log(
    //   // roomMessagesAmount.amount.messagesAmount,
    //   // "<",
    //   roomMessagesAmount.amount.messagesAmount,
    //   amount.messagesAmount
    //   // roomMessagesAmount.amount.messagesAmount < amount.messagesAmount
    // );
    // if (roomMessagesAmount.amount.messagesAmount < amount.messagesAmount) {
    //   console.log("UPDATE");
    // }
    // console.log(
    //   roomState.messages.length,
    //   roomState.messages[roomState.messages.length - 1000].timestamp
    // );
    setRoomState({
      messages: await get1V1Messages(
        room,
        jwt.jwt,
        0,
        -8,
        -1
        // roomState.messages[100].timestamp
        // 0
      ),
    });
    // setRoomMessagesAmount(await get1V1MessagesAmount(room, jwt.jwt));
    // // resetRoomState();
    // console.log("yo3");
  };
  return (
    <View style={styles.container}>
      <ChatHeader
        themeTitle={otherUserId}
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
      {/* <Button onPress={() => handleRefresh()} title="refresh" /> */}
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
