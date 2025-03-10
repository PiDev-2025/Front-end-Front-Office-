import { Image } from "@gluestack-ui/themed";
import React, { useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";

const Carousel = ({ images }) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const { width } = Dimensions.get("window");

	return (
		<View>
			<ScrollView
				horizontal
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				onMomentumScrollEnd={(event) => {
					const contentOffset =
						event.nativeEvent.contentOffset;
					const viewSize =
						event.nativeEvent.layoutMeasurement;
					// Calculate the current index based on the scroll position
					const newIndex = Math.floor(
						contentOffset.x / viewSize.width
					);
					setActiveIndex(newIndex);
				}}
			>
				{images.map((image, index) => (
					<View key={index} style={{ width }}>
						{" "}
						// Each slide should be as wide as the
						screen
						<Image
							source={{ uri: image.uri }}
							alt={`Carousel Image ${index}`}
							width={width} // Full width of the screen
							height={200} // Set according to your needs
						/>
					</View>
				))}
			</ScrollView>
			{/* Optional: Add indicators or navigation buttons */}
		</View>
	);
};

// Example usage
const MyComponent = () => {
	const images = [
		{ uri: "path_to_image1.jpg" },
		{ uri: "path_to_image2.jpg" },
		{ uri: "path_to_image3.jpg" },
	];

	return <Carousel images={images} />;
};

export default MyComponent;
