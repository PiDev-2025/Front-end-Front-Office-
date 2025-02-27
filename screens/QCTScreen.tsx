import React from "react";
import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	View,
	useColorScheme,
} from "react-native";

import { Colors } from "react-native/Libraries/NewAppScreen";

import Section from "./components/Section";

// import {
// 	animated,
// 	createInterpolator,
// 	to as interpolate,
// 	useSpring,
// } from "@react-spring/native";
// import { cubicCoordinates, stepsCoordinates } from "easing-coordinates";

// const easeMap = {
// 	"ease-in-out": { x1: 0.42, y1: 0, x2: 0.58, y2: 1 },
// 	"ease-out": { x1: 0, y1: 0, x2: 0.58, y2: 1 },
// 	"ease-in": { x1: 0.42, y1: 0, x2: 1, y2: 1 },
// 	ease: { x1: 0.25, y1: 0.1, x2: 0.25, y2: 1 },
// 	linear: { x1: 0.25, y1: 0.25, x2: 0.75, y2: 0.75 },
// };
// import styles from "./QCTScreen.css";

// import {Button as PaperButton} from 'react-native-paper';

// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

function QCTScreen(): React.JSX.Element {
	// const [from, setFrom] = useState("#0bd1ff");
	// const [mid, setMid] = useState("#ffa3ff");
	// const [to, setTo] = useState("#ffd34e");
	// const [angle, setAngle] = useState(32);
	// const [stops, setStops] = useState(5);
	// const [easing, setEasing] = useState("ease-in-out");
	// const [easeCustom, setEaseCustom] = useState("");

	// const { colorFrom, colorMid, colorTo } = useSpring({
	// 	colorFrom: from,
	// 	colorMid: mid,
	// 	colorTo: to,
	// });

	// const coordinates = React.useMemo(() => {
	// 	let coordinates;
	// 	const customBezier = easeCustom.split(",").map(Number);
	// 	if (customBezier.length <= 1) {
	// 		if (easing === "steps") {
	// 			coordinates = stepsCoordinates(stops, "skip-none");
	// 		} else {
	// 			const { x1, y1, x2, y2 } = easeMap[easing];
	// 			coordinates = cubicCoordinates(x1, y1, x2, y2, stops);
	// 		}
	// 	} else {
	// 		coordinates = cubicCoordinates(
	// 			customBezier[0],
	// 			customBezier[1],
	// 			customBezier[2],
	// 			customBezier[3],
	// 			stops
	// 		);
	// 	}

	// 	return coordinates;
	// }, [easing, easeCustom, stops]);

	// const allStops = interpolate(
	// 	[colorFrom, colorMid, colorTo],
	// 	(from, mid, to) => {
	// 		const blend = createInterpolator({
	// 			range: [0, 0.5, 1],
	// 			output: [from, mid, to],
	// 		});

	// 		return coordinates.map(({ x, y }) => {
	// 			const color = blend(y);

	// 			return `${color} ${x * 100}%`;
	// 		});
	// 	}
	// );

	const isDarkMode = useColorScheme() === "dark";
	const backgroundStyle = {
		backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
	};

	return (
		<SafeAreaView style={backgroundStyle}>
			{/* <animated.div
				className={styles.container}
				style={{
					backgroundImage: allStops.to(
						(...args) =>
							`linear-gradient(${angle}deg, ${args.join(", ")})`
					),
				}}
			/> */}
			<StatusBar
				barStyle={isDarkMode ? "light-content" : "dark-content"}
				backgroundColor={backgroundStyle.backgroundColor}
			/>
			<ScrollView
				contentInsetAdjustmentBehavior="automatic"
				style={backgroundStyle}
			>
				<View
					style={{
						backgroundColor: isDarkMode
							? Colors.black
							: Colors.white,
					}}
				>
					{/* <Text style={{ fontSize: 20, textAlign: "center", marginTop: 25 }}>
            SympathyWorld - 0.0.1
          </Text> */}
					{/* <Section title="Environment" /> */}
					{/* <Section title="APIs" /> */}
					{/* <Section title="States" /> */}
					<Section title="User" />
					<Section title="UserProfile" />
					<Section title="Pro" />
					<Section title="ChatList" />
					{/* <Section title="VideoChat" /> */}
					{/* <Section title="Chats" /> */}
					{/* <LearnMoreLinks /> */}
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

// const styles = {
// 	container: {
// 		width: "100%",
// 		height: "100%",
// 	},
// };

export default QCTScreen;
