import * as React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRecoilState } from "recoil";
import { aKeyboardVisible } from "../../states/chat";
import { ChatInputProps } from "./types";
export const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [message, setMessage] = React.useState("");
  const [keyboardVisible, setKeyboardVisible] =
    useRecoilState(aKeyboardVisible);
  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Écrire un message"
          value={message}
          onChangeText={setMessage}
          multiline
          accessibilityLabel="Message input field"
          // onPressIn={() => setKeyrboardVisible(true)}
        />
      </View>
      <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
        <Image
          source={{
            uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/5f03c393f3102fd6c48d1b3bdfcffdff60c97615900b5cced378de053843dd63?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
          }}
          style={styles.sendIcon}
          resizeMode="contain"
        />
        <Text style={styles.sendText}>Envoyer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: "#D9D9D9",
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    maxHeight: 100,
  },
  inputWrapper: {
    flex: 1,
    marginRight: 15,
  },
  input: {
    fontFamily: "Archivo",
    fontSize: 14,
    color: "#919191",
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sendIcon: {
    width: 20,
    height: 20,
  },
  sendText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#919191",
  },
});
