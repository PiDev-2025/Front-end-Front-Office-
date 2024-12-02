import * as React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { FeedbackProps } from "./types";

export const Feedback: React.FC<FeedbackProps> = ({
  question,
  onYes,
  onNo,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={onYes}>
          <Text style={styles.actionText}>Oui</Text>
        </TouchableOpacity>
        <View style={styles.slider}>
          <View style={styles.sliderKnob} />
        </View>
        <TouchableOpacity onPress={onNo}>
          <Text style={styles.actionText}>Non</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#C9F3FF",
    borderRadius: 10,
    padding: 16,
    paddingHorizontal: 32,
    marginHorizontal: 32,
    marginVertical: 32,
  },
  question: {
    fontSize: 12,
    fontFamily: "Archivo",
    fontWeight: "600",
    color: "#000000",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 6,
  },
  actionText: {
    fontSize: 12,
    fontFamily: "Archivo",
    fontWeight: "500",
    color: "#646464",
  },
  slider: {
    flex: 1,
    height: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 10,
  },
  sliderKnob: {
    width: 15,
    height: 15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#23C2EE",
  },
});
