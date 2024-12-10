import { atom } from "recoil";

const usernameState = atom<string | null>({
  key: "usernameState",
  default: null,
});
const emailState = atom<string | null>({
  key: "emailState",
  default: null,
});
const passwordState = atom<string | null>({
  key: "passwordState",
  default: null,
});
const jwtState = atom<string | null>({
  key: "jwtState",
  default: {},
});
export { usernameState, emailState, passwordState, jwtState };
