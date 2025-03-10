import { Icon } from "@/components/ui/icon";
import { BriefcaseMedicalIcon, LeafIcon, UserIcon } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import View from "react-native/Libraries/Components/View/View";
// Custom Marker Component
const CustomMarker = ({
	name,
	coordinate,
	logo,
}: {
	name: string;
	coordinate: { latitude: number; longitude: number };
	logo: string;
}) => {
	const [count, setCount] = useState(0);
	console.log(logo);
	return (
		<Marker coordinate={coordinate}>
			<TouchableOpacity
				style={styles.markerContainer}
				onPress={() => setCount(count + 1)}
			>
				{/* <Text style={styles.markerCount}>{count}</Text> */}
				{logo === "leaf" ? (
					<>
						<Icon as={LeafIcon} size="md" />
						<Text style={styles.markerText}>{name}</Text>
					</>
				) : logo === "briefcase-medical" ? (
					<>
						<Icon as={BriefcaseMedicalIcon} size="md" />
						<Text style={styles.markerText}>{name}</Text>
					</>
				) : logo === "user" ? (
					<>
						<Icon as={UserIcon} size="md" />
						<Text style={styles.markerText}>{name}</Text>
					</>
				) : null}
				{/* <Icon as={LeafIcon} size="md" /> */}
			</TouchableOpacity>
		</Marker>
	);
};

// Main App Component
export default function App() {
	const initialRegion = {
		latitude: 43.6119,
		longitude: 3.8772,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	};

	const markers = [
		{
			name: "Alycia",
			coordinate: { latitude: 43.605, longitude: 3.8793 },
			logo: "user",
		},
		{
			name: "Albert",
			coordinate: { latitude: 43.6119, longitude: 3.8772 },
			logo: "user",
		},
		{
			name: "Docteur Ferrand",
			coordinate: { latitude: 43.6152, longitude: 3.8823 },
			logo: "briefcase-medical",
		},
		{
			name: "Naturopathe Léa",
			coordinate: { latitude: 43.6193, longitude: 3.8772 },
			logo: "leaf",
		},
	];

	return (
		<View style={styles.container}>
			<MapView style={styles.map} initialRegion={initialRegion}>
				{markers.map((marker, index) => (
					<CustomMarker
						key={index}
						name={marker.name}
						coordinate={marker.coordinate}
						logo={marker.logo}
					/>
				))}
			</MapView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
	markerContainer: {
		backgroundColor: "#fff",
		padding: 8,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#ccc",
		alignItems: "center",
	},
	markerText: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#333",
	},
	markerCount: {
		fontSize: 12,
		color: "#666",
	},
});
