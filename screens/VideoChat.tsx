import React from "react";
import { SafeAreaView, Text, Button } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { List, MD3Colors } from "react-native-paper";
import { GIT_TAG, API_URL } from "@env";

import { StyleSheet, View, FlatList, ListRenderItem } from "react-native";
import { useEffect } from "react";
import {
  AudioSession,
  LiveKitRoom,
  useTracks,
  TrackReferenceOrPlaceholder,
  VideoTrack,
  isTrackReference,
  registerGlobals,
} from "@livekit/react-native";
import { Track } from "livekit-client";

// !! Note !!
// This sample hardcodes a token which expires in 2 hours.
const wsURL = "wss://sympathyworldv2-h27bhi08.livekit.cloud";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzM4NDA0MTQsImlzcyI6IkFQSXI0YjlWNmF5OFlmViIsIm5iZiI6MTczMzgzMzIxNCwic3ViIjoicXVpY2tzdGFydCB1c2VyIHNid21obCIsInZpZGVvIjp7ImNhblB1Ymxpc2giOnRydWUsImNhblB1Ymxpc2hEYXRhIjp0cnVlLCJjYW5TdWJzY3JpYmUiOnRydWUsInJvb20iOiJxdWlja3N0YXJ0IHJvb20iLCJyb29tSm9pbiI6dHJ1ZX19.yKFtEs9IqYfQvhNSe_dN6x778VTT_c6cwhvU7lGXYQo";
export function VideoChatScreen() {
  // Start the audio session first.
  useEffect(() => {
    let start = async () => {
      await AudioSession.startAudioSession();
    };

    start();
    return () => {
      AudioSession.stopAudioSession();
    };
  }, []);

  return (
    <LiveKitRoom
      serverUrl={wsURL}
      token={token}
      connect={true}
      options={{
        // Use screen pixel density to handle screens with differing densities.
        adaptiveStream: { pixelDensity: "screen" },
      }}
      audio={true}
      video={true}
    >
      <RoomView />
    </LiveKitRoom>
  );
}

const RoomView = () => {
  // Get all camera tracks.
  const tracks = useTracks([Track.Source.Camera]);

  const renderTrack: ListRenderItem<TrackReferenceOrPlaceholder> = ({
    item,
  }) => {
    // Render using the VideoTrack component.
    if (isTrackReference(item)) {
      return <VideoTrack trackRef={item} style={styles.participantView} />;
    } else {
      return <View style={styles.participantView} />;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList data={tracks} renderItem={renderTrack} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
  },
  participantView: {
    height: 300,
  },
});

// function VideoChatScreen(): React.JSX.Element {
//   const navigation = useNavigation();
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <List.Section style={{ marginLeft: 20 }}>
//         <List.Item
//           title={`GIT_TAG=${GIT_TAG}`}
//           left={() => <List.Icon icon="folder" />}
//         />
//         <List.Item
//           title={`API_URL=${API_URL}`}
//           left={() => <List.Icon color={MD3Colors.tertiary70} icon="folder" />}
//         />
//       </List.Section>
//       <Button title="Go Back" onPress={() => navigation.goBack()} />
//     </SafeAreaView>
//   );
// }

export default VideoChatScreen;
