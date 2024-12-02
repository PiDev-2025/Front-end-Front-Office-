import axios from "axios";

async function userSignUp(username: string, email: string, password: string) {
  const origin = "qct-sw.react-native.screens.apis.User.userSignUp";
  console.log(origin);
  const options = {
    method: "POST",
    url: `${process.env.API_URL}/user/signup`,
    headers: {
      "content-type": "application/json",
      origin: origin,
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

export { userSignUp };
