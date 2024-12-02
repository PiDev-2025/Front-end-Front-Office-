// https://recoiljs.org/docs/guides/asynchronous-data-queries
import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView, Text, View, Button, TextInput } from "react-native";
import { ScrollView } from "react-native";
import {
  create1V1Chat,
  send1V1Message,
  get1V1Messages,
  get1V1MessagesAmount,
  getUserChats,
} from "./apis/Chat";
import { ChatScreen as FigmaChatScreen } from "./components/Chat/ChatScreen";
import { atom, useRecoilState } from "recoil";
const chatIdState = atom<string | null>({
  key: "chatIdState",
  default: null,
});

const messageAmountState = atom<string | null>({
  key: "messageAmountState",
  default: null,
});

const userIdState = atom<string | null>({
  key: "userIdState",
  default: null,
});

function Creator1V1Chat(): React.JSX.Element {
  const API_URL = process.env.API_URL;
  const [chatId, setChatId] = useRecoilState(chatIdState);
  const [users, setUsers] = useState<{
    userId1: string | null;
    userId2: string | null;
  }>({ userId1: null, userId2: null });
  const createChat = async () => {
    try {
      if (users.userId1 && users.userId2) {
        const data = await create1V1Chat(users.userId1, users.userId2);
        console.log(data);
        setChatId(data.chatId);
      } else {
        console.error("User IDs cannot be null");
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <TextInput
          placeholder="User ID 1"
          value={users.userId1 || ""}
          onChangeText={(text) => setUsers({ ...users, userId1: text })}
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            marginBottom: 10,
          }}
        />
        <TextInput
          placeholder="User ID"
          value={users.userId2 || ""}
          onChangeText={(text) => setUsers({ ...users, userId2: text })}
          style={{
            height: 40,
            borderColor: "gray",
            borderWidth: 1,
            marginBottom: 10,
          }}
        />
        <Button title="Create Chat" onPress={createChat} />
        <Text>Chat ID: {chatId}</Text>
      </View>
    </SafeAreaView>
  );
}

function Chat1V1(): React.JSX.Element {
  const API_URL = process.env.API_URL;
  const [chatId, setChatId] = useRecoilState(chatIdState);
  const [messagesAmount, setMessagesAmount] =
    useRecoilState(messageAmountState);
  const [messages, setMessages] = useState<
    | {
        senderId?: string;
        message?: string;
        timestamp?: number;
        isoTimeStamp?: string;
        err?: string | null;
      }[]
    | null
  >(null);
  const [items, setItems] = useState<string[]>([]);

  const fetchMessages = async () => {
    try {
      if (chatId) {
        const data = await get1V1Messages(chatId, 11, 0);
        console.log(data);

        setMessages(data);
      } else {
        console.error("Chat ID cannot be null");
      }
    } catch (error) {
      console.error("Error fetching more items:", error);
    }
  };

  const fetchStatus = async () => {
    try {
      if (chatId) {
        const data = await get1V1MessagesAmount(chatId);
        console.log(data);
        setMessagesAmount(data.messagesAmount);
      } else {
        console.error("Chat ID cannot be null");
      }
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchMessages();
  }, [chatId]);
  // fetchStatus();
  return (
    <SafeAreaView>
      <Text>Messages Amount: {messagesAmount}</Text>
      {/* <Text>messages {JSON.stringify(messages)}</Text> */}
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (
            nativeEvent.layoutMeasurement.height +
              nativeEvent.contentOffset.y >=
            nativeEvent.contentSize.height - 20
          ) {
            fetchMessages();
          }
        }}
        scrollEventThrottle={400}
      >
        {messages?.map((item, index) => (
          <Text key={index}>{item.message}</Text>
        ))}
      </ScrollView>
      <Button title="fetchStatus" onPress={fetchStatus} />r
      <Button title="fetchMessages" onPress={fetchMessages} />r
    </SafeAreaView>
  );
}

function ListUserChats(): React.JSX.Element {
  const [userId, setUserId] = useRecoilState(userIdState);
  const [chats, setChats] = useState<
    | {
        room?: string;
        usersInRoom?: { userId1: string; userId2: string }[];
      }[]
    | null
  >(null);

  const fetchMessages = async () => {
    try {
      if (userId) {
        const data = await getUserChats(userId);
        console.log(data);
        setChats(data);
      } else {
        console.error("userID cannot be null");
      }
    } catch (error) {
      console.error("Error fetching more items:", error);
    }
  };

  return (
    <SafeAreaView>
      var response = [];
      <TextInput
        placeholder="User ID 2"
        value={userId || ""}
        onChangeText={(text) => setUserId(text)}
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
      />
      <Button title="fetchUserChats" onPress={fetchMessages} />
      {chats?.map((chat, index) => (
        <View key={index} style={{ marginBottom: 10 }}>
          <Text>Room: {chat.room}</Text>
          {chat.usersInRoom?.map((user, userIndex) => (
            <Text key={userIndex}>
              User 1: {user.userId1}, User 2: {user.userId2}
            </Text>
          ))}
        </View>
      ))}
    </SafeAreaView>
  );
}

// Main screen
function ChatScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      {/* <Creator1V1Chat />
      <Chat1V1 />
      <ListUserChats /> */}
      <FigmaChatScreen />
    </SafeAreaView>
  );
}

export default ChatScreen;
