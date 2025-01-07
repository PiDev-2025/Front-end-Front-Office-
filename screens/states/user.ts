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
const sexState = atom<string | undefined>({
  key: "sexState",
  default: "Homme",
});
const localizationState = atom<string | null>({
  key: "localizationState",
  default: "34070",
});
const ageState = atom<string | null>({
  key: "ageState",
  default: "35",
});
const jwtState = atom<object | null>({
  key: "jwtState",
  default: {},
});
const jwtDecodedState = atom<object | null>({
  key: "jwtDecoded",
  default: {},
});
const picturesState = atom<object | null>({
  key: "picturesState",
  default: {},
});
export {
  usernameState,
  emailState,
  passwordState,
  jwtState,
  jwtDecodedState,
  sexState,
  localizationState,
  ageState,
  picturesState,
};
