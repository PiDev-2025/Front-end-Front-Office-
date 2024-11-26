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
  // const [message, setMessage] = useState<string>('');
  // const [ws, setWs] = useState<WebSocket | null>(null);
  // const [isConnected, setIsConnected] = useState<boolean>(false);

  // const MESSAGE_ENUM = Object.freeze({
  //   SELF_CONNECTED: "SELF_CONNECTED",
  //   CLIENT_CONNECTED: "CLIENT_CONNECTED",
  //   CLIENT_DISCONNECTED: "CLIENT_DISCONNECTED",
  //   CLIENT_MESSAGE: "CLIENT_MESSAGE"
  // });

  // const connectWebSocket = () => {
  //   const newWs = new WebSocket(process.env.WS_URL || 'ws://devapi-sw.qazar.cloud/ws');
  //   newWs.onopen = () => {
  //     console.log("Connected to the WebSocket server.");
  //     setIsConnected(true);
  //     newWs.onmessage = evt => {
  //       let msg = JSON.parse(evt.data);
  //       switch (msg.type) {
  //         case MESSAGE_ENUM.CLIENT_MESSAGE:
  //           console.log(`${msg.sender} says: ${msg.body}`);
  //           break;
  //         case MESSAGE_ENUM.CLIENT_CONNECTED:
  //           console.log(`${msg.body.name} has joined the chat.`);
  //           break;
  //         case MESSAGE_ENUM.CLIENT_DISCONNECTED:
  //           console.log(`${msg.body.name} has left the chat.`);
  //           break;
  //         case MESSAGE_ENUM.SELF_CONNECTED:
  //           console.log(`You are connected! Your username is ${msg.body.name}`);
  //           break;
  //         default:
  //           console.log("Unknown message type.");
  //       }
  //     };
  //   };
  //   // newWs.onclose = () => {
  //   //   console.log("Disconnected from the WebSocket server.");
  //   //   setIsConnected(false);
  //   // };
  //   setWs(newWs);
  // };

  // const sendMessage = () => {
  //   if (ws) {
  //     let msg = {
  //       type: MESSAGE_ENUM.CLIENT_MESSAGE,
  //       body: message
  //     };
  //     ws.send(JSON.stringify(msg));
  //     setMessage('');
  //   } else {
  //     console.log("WebSocket is not connected.");
  //   }
  // };

  // const ws = new WebSocket(process.env.WS_URL || 'ws://devapi-sw.qazar.cloud/ws');

  // ws.onopen = () => {
  //   // connection opened
  //   ws.send('something'); // send a message
  // };

  // ws.onmessage = e => {
  //   // a message was received
  //   console.log(e.data);
  // };

  // ws.onerror = e => {
  //   // an error occurred
  //   console.log(e.message);
  // };

  // ws.onclose = e => {
  //   // connection closed
  //   console.log(e.code, e.reason);
  // };

  useEffect(() => {
    const ws = new WebSocket(
      process.env.WS_URL || "wss://devapi-sw.qazar.cloud/ws"
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

    return () => {
      ws.close();
    };
  }, []);
  return (
    <SafeAreaView>
      <View>
        <Text>WebSockets</Text>
        {/* <Button title={isConnected ? "Connected" : "Connect"} onPress={connectWebSocket} disabled={isConnected} />
        <TextInput value={message} onChangeText={setMessage} />
        <Button title="Send" onPress={sendMessage} disabled={!isConnected}></Button> */}
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
