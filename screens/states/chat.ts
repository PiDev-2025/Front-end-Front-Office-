import {
  DefaultValue,
  atom,
  atomFamily,
  selector,
  selectorFamily,
} from "recoil";
import { get1V1Messages, getUserChats } from "../apis/Chat";
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

export const messagesRefreshTrigger = atom({
  key: "messagesRefreshTrigger",
  default: 0,
});

export const sfRoomMessages = selectorFamily({
  key: "RoomMessagesSelector",
  get:
    (room: string) =>
    async ({ get }) => {
      try {
        get(messagesRefreshTrigger);
        const jwt = get(jwtState)?.jwt;
        if (!jwt) {
          throw new Error("JWT is null or undefined");
        }
        console.log("roomMessagesSelector", room, jwt);
        return {
          messages: await get1V1Messages(room, jwt),
        };
      } catch (error) {
        console.error("Error fetching status:", error);
        return null;
      }
    },
  set:
    (param: string) =>
    ({ set }, value: any) => {
      if (value instanceof DefaultValue) {
        console.log("------ SET------", value);
        set(messagesRefreshTrigger, Math.random());
        messages.push(value);
      }
    },
});

export const afRoomMessages = atomFamily({
  key: "RoomMessagesState",
  default: (room: string) => sfRoomMessages(room),
});
