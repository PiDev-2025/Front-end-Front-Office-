import { atom } from "recoil";

const usernameState = atom<string | null>({
  key: "usernameState",
  default: "damien_sw.co",
});
const emailState = atom<string | null>({
  key: "emailState",
  default: "damien@sympathyworld.co",
});
const passwordState = atom<string | null>({
  key: "passwordState",
  default: "Test1234",
});
const jwtState = atom<string | null>({
  key: "jwtState",
  default: {},
});
const jwtDecodedState = atom<string | null>({
  key: "jwtDecoded",
  default: {},
});
export { usernameState, emailState, passwordState, jwtState, jwtDecodedState };
