import { atom, selector } from "recoil";
import { jwtDecodedState, jwtState } from "./user";
import {
  create1V1Chat,
  send1V1Message,
  get1V1Messages,
  get1V1MessagesAmount,
  getUserChats,
} from "../apis/Chat";
const chats1V1Messages = selector<object | null>({
  key: "chats1V1MessagesState",
  get: async ({ get }) => {
    try {
      const data = await getUserChats(
        get(jwtDecodedState).ID.split(":")[1],
        get(jwtState).jwt
      );
      return data;
    } catch (error) {
      console.error("Error fetching status:", error);
    }
  },
});

export { chats1V1Messages };
