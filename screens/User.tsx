// https://recoiljs.org/docs/guides/asynchronous-data-queries
import React from "react";
import { SafeAreaView, Button, TextInput } from "react-native";
import { getUserChats } from "./apis/Chat";
import { atom, useRecoilState } from "recoil";
import { userSignUp } from "./apis/User";
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
  default: null,
});

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

  //   const loginUser = async () => {
  //     try {
  //       if (userId) {
  //         const data = await getUserChats(userId);
  //         console.log(data);
  //         setChats(data);
  //       } else {
  //         console.error("userID cannot be null");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching more items:", error);
  //     }
  //   };

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
      <Button title="Signup" onPress={signupUser} />
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
// import * as React from 'react';
// import { View, useWindowDimensions } from 'react-native';
// import { TabView, SceneMap } from 'react-native-tab-view';

// const renderScene = SceneMap({
//   first: FirstRoute,
//   second: SecondRoute,
// });

// const routes = [
//   { key: 'first', title: 'First' },
//   { key: 'second', title: 'Second' },
// ];

// export default function TabViewExample() {
//   const layout = useWindowDimensions();
//   const [index, setIndex] = React.useState(0);

//   return (
//     <TabView
//       navigationState={{ index, routes }}
//       renderScene={renderScene}
//       onIndexChange={setIndex}
//       initialLayout={{ width: layout.width }}
//     />
//   );
// }
