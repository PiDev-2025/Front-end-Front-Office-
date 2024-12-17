import { atom, atomFamily, selector } from "recoil";
import { getUserChats } from "../apis/Chat";
import { jwtDecodedState, jwtState } from "./user";

// ---

export const aChatsOpened = atom<object | null>({
  key: "chatsOpenedState",
  default: null,
});

// ---

// export const aChats1V1Rooms = atom<object | null>({
//   key: "aChats1V1MessagesState",
//   default: [],
// });

export const sChats1V1Rooms = selector<object | null>({
  key: "sChats1V1MessagesSelector",
  get: async ({ get }) => {
    try {
      const data = await getUserChats(
        get(jwtDecodedState).ID.split(":")[1],
        get(jwtState).jwt
      );
      return data;
    } catch (error) {
      console.error("Error fetching status:", error);
      return null;
    }
  },
  // set: ({ set }, newValue) => {
  //   set(chats1V1MessagesSelectorState, newValue);
  // },
});

// export const cbUpdate1V1Rooms = useRecoilCallback(
//   ({ set }) =>
//     async (id, jwt) => {
//       try {
//         const newMessages = await getUserChats(id, jwt.jwt);
//         console.log("newMessages", newMessages);
//       } catch (error) {
//         console.error("Error fetching status:", error);
//         throw error;
//       }
//     }
// );

// ---

export const sChats1V1MessagesInRoom = selector<object | null>({
  key: "sChats1V1MessagesSelector",
  get: async ({ get }) => {
    try {
      const data = await getUserChats(
        get(jwtDecodedState).ID.split(":")[1],
        get(jwtState).jwt
      );
      return data;
    } catch (error) {
      console.error("Error fetching status:", error);
      return null;
    }
  },
  // set: ({ set }, newValue) => {
  //   set(chats1V1MessagesSelectorState, newValue);
  // },
});

export const sfRoomMessages = atomFamily({
  key: "RoomMessagesState",
  default: (room) => ({
    messages: [
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
        username: "thzr0wwtsspvdm3jtdz4",
      },
      {
        avatar:
          "https://cdn.builder.io/api/v1/image/assets/TEMP/09534b4d2a9ac3383cb3858912714a3bdea0d5a6dba0627671943b17493dfabc?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
        username: "Sandra",
        message: "Chillax",
        timestamp: "2min ago",
      },
    ],
    // lastMessage: null,
    // input: null,
    // Add other room-specific states here
  }),
});
