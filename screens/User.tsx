// https://recoiljs.org/docs/guides/asynchronous-data-queries
import React from "react";
import { SafeAreaView, Button, TextInput, Text } from "react-native";
import {
  usernameState,
  emailState,
  passwordState,
  jwtState,
} from "./states/user";
import { userSignUp, userSignIn } from "./apis/User";
import { useRecoilState } from "recoil";
function ListUserChats(): React.JSX.Element {
  const [username, setUsername] = useRecoilState(usernameState);
  const [email, setEmail] = useRecoilState(emailState);
  const [password, setPassword] = useRecoilState(passwordState);
  const [jwt, setJwt] = useRecoilState(jwtState);

  const signupUser = async () => {
    try {
      if (username && email && password) {
        const data = await userSignUp(username, email, password);
        console.log(data);
        setJwt(data);
      } else {
        console.error("userID cannot be null");
      }
    } catch (error) {
      console.error("Error fetching more items:", error);
    }
  };

  const signinUser = async () => {
    try {
      if (email && password) {
        const data = await userSignIn(email, password);
        console.log(data);
        setJwt(data);
      } else {
        console.error("userID cannot be null");
      }
    } catch (error) {
      console.error("Error fetching more items:", error);
    }
  };

  return (
    <SafeAreaView>
      <TextInput
        placeholder="Username"
        value={username || ""}
        onChangeText={(text) => setUsername(text)}
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Email"
        value={email || ""}
        onChangeText={(text) => setEmail(text)}
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password || ""}
        onChangeText={(text) => setPassword(text)}
        style={{
          height: 40,
          borderColor: "gray",
          borderWidth: 1,
          marginBottom: 10,
        }}
      />
      {/* <Button title="Login" onPress={loginUser} /> */}
      <Button title="SignUp" onPress={signupUser} />
      <Button title="SignIn" onPress={signinUser} />
      <Text> {jwt.jwt}</Text>
    </SafeAreaView>
  );
}

// Main screen
function UserScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <ListUserChats />
    </SafeAreaView>
  );
}

export default UserScreen;
