// https://recoiljs.org/docs/guides/asynchronous-data-queries

import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, View, Button, TextInput } from "react-native";
import axios from "axios";
// import ReconnectingWebSocket from 'reconnecting-websocket';

function RESTElysia(): React.JSX.Element {
  const API_URL = process.env.API_URL;
  const [data, setData] = useState<{
    s?: string;
    v?: string;
    err?: string;
  } | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/status`, {
          headers: { origin: "react-native.APIsScreen.status" },
        });
        console.log(response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching status:", error);
        setData({ err: "Error fetching status" });
      }
    };

    fetchStatus();
  }, []);

  return (
    <SafeAreaView>
      <View>
        <Text>
          {data && data.s === "running" ? "🟢" : ""} API :{" "}
          {data ? data.s : "Loading..."} :: {data ? data.v : "Loading..."}
        </Text>
      </View>
    </SafeAreaView>
  );
}
function WSElysia(): React.JSX.Element {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  const connectWebSocket = () => {
    const ws = new WebSocket(
      process.env.WS_URL || "ws://devapi-sw.qazar.cloud/ws"
    );

    ws.onopen = () => {
      console.log("Connected to the WebSocket server.");
      ws.send("something"); // send a message
    };

    ws.onmessage = (e) => {
      console.log(e.data);
    };

    ws.onerror = (e) => {
      console.log(e.message);
    };

    ws.onclose = (e) => {
      console.log(e.code, e.reason);
    };

    return ws;
  };

  const disconnectWebSocket = (ws: WebSocket) => {
    if (ws) {
      ws.close();
      console.log("Disconnected from the WebSocket server.");
    }
  };

  const sendMessage = (ws: WebSocket, message: string) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(message);
      console.log("Message sent:", message);
    } else {
      console.log("WebSocket is not open. Ready state:", ws.readyState);
    }
  };
  return (
    <SafeAreaView>
      <View>
        <Text>WebSockets</Text>
        <Button
          title="Connect"
          onPress={() => {
            const newWs = connectWebSocket();
            setWs(newWs);
          }}
        />
        <Button
          title="Disconnect"
          onPress={() => {
            if (ws) {
              disconnectWebSocket(ws);
              setWs(null);
            }
          }}
        />
        <TextInput
          placeholder="Enter message"
          value={message}
          onChangeText={setMessage}
          style={{ borderWidth: 1, padding: 5, marginVertical: 10 }}
        />
        <Button
          title="Send"
          onPress={() => {
            if (ws) {
              sendMessage(ws, message);
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

// Main screen
function APIsScreen(): React.JSX.Element {
  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      <View>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Connection Status
        </Text>
        <View style={{ marginVertical: 10 }}>
          <RESTElysia />
          <WSElysia />
        </View>
      </View>
    </SafeAreaView>
  );
}

export default APIsScreen;
