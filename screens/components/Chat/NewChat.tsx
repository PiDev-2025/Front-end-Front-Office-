import { Input, InputField } from "@/components/ui/input";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useRecoilState, useRecoilValue } from "recoil";
import { sChats1V1Rooms } from "../../states/chat";
import { jwtDecodedState, jwtState } from "../../states/user";

interface MessageItemProps {
  room: string;
}

const NewChat_Item: React.FC<MessageItemProps> = ({ item }) => {
  const navigation = useNavigation();
  const { room, usersInRoom, myUserId } = item;
  console.log(myUserId);
  console.log(room, usersInRoom);
  const goToChat = () => {
    navigation.navigate("ChatScreen", { room, usersInRoom });
  };
  return (
    <View style={styles2.messageContainer} onTouchEnd={goToChat}>
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
          <Text>{usersInRoom[0].userId2}</Text>
          <Text style={styles2.roomId}>room : {myUserId}</Text>
        </View>
      </View>
      {/* <Text style={styles2.timeText}>{time}</Text> */}
    </View>
  );
};
const NewChat: React.FC = () => {
  const [jwt, setJwt] = useRecoilState(jwtState);
  const [jwtDecoded, setJwtDecoded] = useRecoilState(jwtDecodedState);
  const [searchQuery, setSearchQuery] = React.useState("");
  const rooms1V1 = useRecoilValue(sChats1V1Rooms);
  const filteredRooms1V1 = rooms1V1.filter((msg) =>
    msg.room?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const newChat = async () => {
    console.log("go to matchmaking", searchQuery, jwtDecoded.ID.split(":")[1]);
    // console.log();
    // if (jwtDecoded && jwtDecoded.ID) {
    //   try {
    //     const data = await create1V1Chat(
    //       jwtDecoded.ID.split(":")[1],
    //       searchQuery,
    //       jwt.jwt
    //     );
    //     console.log("chat created supposed data here");
    //     console.log(data);
    //     if (data.chatId) {
    //       console.log("chatId", data.chatId);
    //       console.log(messages.length);
    //     }
    //     setSearchQuery("");
    //   } catch (error) {
    //     console.error("Error fetching more items:", error);
    //   }
    // } else {
    //   console.error("jwtDecoded or jwtDecoded.ID is null");
    // }
  };
  return (
    <View style={styles2.container}>
      <Text style={styles2.titleText}>{jwtDecoded.ID}</Text>

      <Select>
        <SelectTrigger variant="underlined" size="lg">
          <SelectInput placeholder="Thème #1" />
          {/* <SelectIcon className="mr-3" as={ChevronDownIcon} /> */}
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            <SelectItem label="UX Research" value="ux" />
            <SelectItem label="Web Development" value="web" />
            <SelectItem
              label="Cross Platform Development Process"
              value="Cross Platform Development Process"
            />
            <SelectItem label="UI Designing" value="ui" isDisabled={true} />
            <SelectItem label="Backend Development" value="backend" />
          </SelectContent>
        </SelectPortal>
      </Select>

      <Select>
        <SelectTrigger variant="underlined" size="lg">
          <SelectInput placeholder="Thème #2" />
          {/* <SelectIcon className="mr-3" as={ChevronDownIcon} /> */}
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            <SelectItem label="UX Research" value="ux" />
            <SelectItem label="Web Development" value="web" />
            <SelectItem
              label="Cross Platform Development Process"
              value="Cross Platform Development Process"
            />
            <SelectItem label="UI Designing" value="ui" isDisabled={true} />
            <SelectItem label="Backend Development" value="backend" />
          </SelectContent>
        </SelectPortal>
      </Select>

      <Select>
        <SelectTrigger variant="underlined" size="lg">
          <SelectInput placeholder="Thème #3" />
          {/* <SelectIcon className="mr-3" as={ChevronDownIcon} /> */}
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent>
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>
            <SelectItem label="UX Research" value="ux" />
            <SelectItem label="Web Development" value="web" />
            <SelectItem
              label="Cross Platform Development Process"
              value="Cross Platform Development Process"
            />
            <SelectItem label="UI Designing" value="ui" isDisabled={true} />
            <SelectItem label="Backend Development" value="backend" />
          </SelectContent>
        </SelectPortal>
      </Select>

      <Input
        variant="outline"
        size="md"
        isDisabled={false}
        isInvalid={false}
        isReadOnly={false}
      >
        <InputField placeholder="Enter Text here..." />
      </Input>
      {/* <View style={styles2.header}></View>
      {/* <View style={styles2.searchContainer}></View> */}
      {/* <TextInput
        style={styles2.searchInput}
        placeholder="Rechercher un contact"
        placeholderTextColor="rgba(145, 145, 145, 1)"
        accessibilityLabel="Search contacts input field"
        value={searchQuery}
        onChangeText={setSearchQuery}
      /> */}
      {/* 
      <ScrollView style={styles2.messagesList}>
        {filteredRooms1V1.map((item, index) => (
          <NewChat_Item
            key={index}
            item={{ ...item, myUserId: jwtDecoded.ID.split(":")[1] }}
          />
        ))}
      </ScrollView> */}
      {/* <Button onPress={newChat}>+ Nouvelle Conversation</Button> */}
      {/* <FlatGrid
        itemDimension={210}
        data={[1, 2, 3]}
        renderItem={({ item }) => (
          <>
            {item === 1 && (
                <>
                    {console.log("item", item)}
                </>
            )}
          </>
        )}
      /> */}
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
  roomId: {
    fontSize: 10,
    color: "#3660da",
  },
});

export default NewChat;
