// https://recoiljs.org/docs/guides/asynchronous-data-queries
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form-control";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { jwtDecode } from "jwt-decode";
// import { EyeIcon, EyeOffIcon } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { EyeIcon, EyeOffIcon } from "lucide-react-native";
import React from "react";
import { SafeAreaView, Text } from "react-native";
import { useRecoilState } from "recoil";
import { userSignIn } from "./apis/User";
import {
  emailState,
  jwtDecodedState,
  jwtState,
  passwordState,
  usernameState,
} from "./states/user";
function UserSignUp(): React.JSX.Element {
  const navigation = useNavigation();
  const [username, setUsername] = useRecoilState(usernameState);
  const [email, setEmail] = useRecoilState(emailState);
  const [password, setPassword] = useRecoilState(passwordState);
  const [jwt, setJwt] = useRecoilState(jwtState);
  const [jwtDecoded, setJwtDecoded] = useRecoilState(jwtDecodedState);
  const [showPassword, setShowPassword] = React.useState(false);
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState;
    });
  };
  const signinUser = async () => {
    try {
      if (username && email && password) {
        const data = await userSignIn(email, password);
        setJwt(data);
        setJwtDecoded(jwtDecode(data.jwt));
        navigation.navigate("SympathyWorld", {});
      } else {
        console.error("userID cannot be null");
      }
    } catch (error) {
      console.error("Error fetching more items:", error);
    }
  };

  return (
    <SafeAreaView>
      <Box className="justify-center h-full ">
        <FormControl className="p-4 border border-outline-300">
          <VStack space="xl">
            <VStack space="xs">
              <Text className="text-typography-500">Email</Text>
              <Input className="min-w-[250px]">
                <InputField
                  type="text"
                  value={email || ""}
                  onChangeText={(text) => setEmail(text)}
                />
              </Input>
            </VStack>
            <VStack space="xs">
              <Text className="text-typography-500">Password</Text>
              <Input className="text-center">
                <InputField
                  type={showPassword ? "text" : "password"}
                  value={password || ""}
                  onChangeText={(text) => setPassword(text)}
                />
                <InputSlot className="pr-3" onPress={handleState}>
                  <InputIcon as={showPassword ? EyeIcon : EyeOffIcon} />
                </InputSlot>
              </Input>
            </VStack>
            <Button variant="solid" className="mt-2" onPress={signinUser}>
              <ButtonText>SignIn</ButtonText>
            </Button>
          </VStack>
        </FormControl>
        <Text> {jwt.jwt}</Text>
      </Box>
    </SafeAreaView>
  );
}

// Main screen
function UserSignUpScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <UserSignUp />
    </SafeAreaView>
  );
}

export default UserSignUpScreen;
