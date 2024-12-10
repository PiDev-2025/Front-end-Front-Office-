import axios from "axios";

async function userSignUp(username: string, email: string, password: string) {
  const origin = "qct-sw.react-native.screens.apis.User.userSignUp";
  console.log(origin);
  const options = {
    method: "POST",
    url: `${process.env.API_URL}/auth/user/signup`,
    headers: {
      "content-type": "application/json",
      origin: origin,
      authorization: `Bearer ${process.env.API_ELYSIA_JWT_USER_SIGNUP__SIGNIN}`,
    },
    data: { email, password, username },
  };

  try {
    const { data } = await axios.request(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function userSignIn(email: string, password: string) {
  const origin = "qct-sw.react-native.screens.apis.User.userSignIn";
  console.log(origin);
  const options = {
    method: "POST",
    url: `${process.env.API_URL}/auth/user/signin`,
    headers: {
      "content-type": "application/json",
      origin: origin,
      authorization: `Bearer ${process.env.API_ELYSIA_JWT_USER_SIGNUP__SIGNIN}`,
    },
    data: { email, password },
  };

  try {
    const { data } = await axios.request(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export { userSignUp, userSignIn };
