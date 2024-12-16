import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  ScrollView,
  TextInput,
} from "react-native";
import { Button } from "react-native-paper";
import { jwtDecodedState, jwtState } from "../../states/user";
import { chats1V1Messages } from "../../states/chat";
import { useGotoRecoilSnapshot, useRecoilState, useRecoilValue } from "recoil";
interface MessageItemProps {
  // avatar: string;
  // name?: string;
  // message?: string;
  // time: string;
  // isGroup?: boolean;
  // memberCount?: number;
  // isThematic?: boolean;
  // thematicType?: string;
  room: string;
}
import {
  create1V1Chat,
  send1V1Message,
  get1V1Messages,
  get1V1MessagesAmount,
  getUserChats,
} from "../../apis/Chat";
const MessageItem: React.FC<MessageItemProps> = ({
  room,
  // avatar,
  // name,
  // message,
  // time,
  // isGroup,
  // memberCount,
  // isThematic,
  // thematicType,
}) => (
  <View
    style={styles2.messageContainer}
    onTouchEnd={() => console.log(`Room: ${room}`)}
  >
    <View style={styles2.messageContent}>
      <Image
        resizeMode="contain"
        source={{
          uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/d9e5323e3e31cdede93efcaa8bc9c2188f50e166bcf77987bf0ce0ce300bea47?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
        }}
        style={[
          styles2.avatar,
          // isThematic ? styles2.thematicAvatar : styles2.userAvatar,
        ]}
      />
      <View style={styles2.textContainer}>
        {/* <Text style={styles2.nameText}>
          {isThematic
            ? `Thematique : ${thematicType}`
            : isGroup
            ? `Groupe : ${name}`
            : name}
        </Text>
        <Text style={styles2.messageText}>
          {isThematic ? `${memberCount} membres` : message}
        </Text> */}
        <Text>{room}</Text>
      </View>
    </View>
    {/* <Text style={styles2.timeText}>{time}</Text> */}
  </View>
);

const ChatList: React.FC = () => {
  const [jwtDecoded, setJwtDecoded] = useRecoilState(jwtDecodedState);
  // const [messages1V1, setMessages1V1] = useRecoilState(chats1V1Messages);
  const messages = [
    {
      avatar:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/2b36c155d0ebdfbf55a048df75a822847ea865213513a357dfedf94cce7835b4?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
      name: "Baptiste Mallet",
      message: "Salut c'est cool de pouvoir echanger",
      time: "Hier",
      chatId: "1",
    },
    // {
    //   avatar:
    //     "https://cdn.builder.io/api/v1/image/assets/TEMP/25dc4628ffcc6716804f6e4b7af7a397e929de8848169610fb83686d0cb418d2?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
    //   name: "Baptiste, Mathilde et 2 autres",
    //   message: "Salut c'est cool de pouvoir echanger",
    //   time: "Hier",
    //   isGroup: true,
    // },
    // {
    //   avatar:
    //     "https://cdn.builder.io/api/v1/image/assets/TEMP/25dc4628ffcc6716804f6e4b7af7a397e929de8848169610fb83686d0cb418d2?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
    //   name: "Baptiste, Mathilde et 2 autres",
    //   message: "Salut c'est cool de pouvoir echanger",
    //   time: "Hier",
    //   isGroup: true,
    // },
    // {
    //   avatar:
    //     "https://cdn.builder.io/api/v1/image/assets/TEMP/7949539254f43c9e57fd6c3131b3fcccb6596f0d9adbc61b0c91439ee01689d4?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
    //   thematicType: "Anxiété",
    //   memberCount: 308,
    //   time: "Hier",
    //   isThematic: true,
    // },
    // {
    //   avatar:
    //     "https://cdn.builder.io/api/v1/image/assets/TEMP/d9e5323e3e31cdede93efcaa8bc9c2188f50e166bcf77987bf0ce0ce300bea47?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
    //   thematicType: "Maladie",
    //   memberCount: 308,
    //   time: "Hier",
    //   isThematic: true,
    // },
  ];
  // useEffect(() => {
  //   messagesApi();
  // });
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const data = await getUserChats(jwtDecoded.ID.split(":")[1], jwt.jwt);
  //       console.log(data);
  //       setMessages1V1(data);
  //     } catch (error) {
  //       console.error("Error fetching more items:", error);
  //     }
  //   };
  //   fetchData();
  // }, [jwtDecoded, jwt, setMessages1V1]);
  const messages1V1 = useRecoilValue(chats1V1Messages);
  const [searchQuery, setSearchQuery] = React.useState("");
  console.log("messages1V1", messages1V1);
  const filteredMessages1V1 = messages1V1.filter(
    (msg) => msg.room?.toLowerCase().includes(searchQuery.toLowerCase())
    // msg.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // msg.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    // msg.thematicType?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [jwt, setJwt] = useRecoilState(jwtState);
  // console.log("messages.length", messages1V1.length);
  const newChat = async () => {
    console.log("go to matchmaking");
    console.log(jwtDecoded.ID);
    console.log(searchQuery, jwtDecoded.ID.split(":")[1]);
    if (jwtDecoded && jwtDecoded.ID) {
      try {
        const data = await create1V1Chat(
          jwtDecoded.ID.split(":")[1],
          searchQuery,
          jwt.jwt
        );
        console.log("chat created supposed data here");
        console.log(data);
        if (data.chatId) {
          console.log("chatId", data.chatId);
          console.log(messages.length);
        }
        setSearchQuery("");
      } catch (error) {
        console.error("Error fetching more items:", error);
      }
    } else {
      console.error("jwtDecoded or jwtDecoded.ID is null");
    }
  };
  return (
    <View style={styles2.container}>
      <Text style={styles2.titleText}>{jwtDecoded.ID}</Text>
      {/* <View style={styles2.header}></View>
      {/* <View style={styles2.searchContainer}></View> */}
      <TextInput
        style={styles2.searchInput}
        placeholder="Rechercher un contact"
        placeholderTextColor="rgba(145, 145, 145, 1)"
        accessibilityLabel="Search contacts input field"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView style={styles2.messagesList}>
        {messages1V1 ? (
          messages1V1.map((item, index) => (
            <MessageItem key={index} room={item.room} />
          ))
        ) : (
          <Text>Loading...</Text>
        )}
      </ScrollView>
      <Button onPress={newChat}>+ Nouvelle Conversation</Button>
    </View>
  );
};

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: "auto",
    maxWidth: 480,
    padding: 10,
  },
  header: {
    marginBottom: 24,
  },
  titleText: {
    fontSize: 20,
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#CDCDCD",
    borderWidth: 1,
    borderRadius: 5,
    padding: 12,
    marginTop: 16,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    maxHeight: 40,
    color: "#919191",
  },
  messagesList: {
    marginTop: 24,
  },
  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  messageContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  userAvatar: {
    borderRadius: 20,
  },
  thematicAvatar: {
    borderRadius: 4,
  },
  textContainer: {
    flex: 1,
  },
  nameText: {
    fontSize: 14,
    color: "#000",
  },
  messageText: {
    fontSize: 12,
    color: "#919191",
  },
  timeText: {
    fontSize: 12,
    color: "#919191",
  },
});

export default ChatList;
