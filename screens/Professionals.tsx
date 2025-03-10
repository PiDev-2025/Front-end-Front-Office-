// import { SafeAreaView } from "react-native";

// // Main screen
// function ProfessionalsScreen(): React.JSX.Element {
// 	return <SafeAreaView style={{ flex: 1, padding: 20 }}></SafeAreaView>;
// }

// export default ProfessionalsScreen;
// import { config } from "@gluestack-ui/config";
import { Box } from "components/ui/box";
import { Divider } from "components/ui/divider";

import { Heading } from "components/ui/heading";
import { HStack } from "components/ui/hstack";
import { Icon } from "components/ui/icon";
import { Text } from "components/ui/text";
import { VStack } from "components/ui/vstack";
import { atom, useAtom } from "jotai";
import { Brain, Heart, Leaf, Sun, User } from "lucide-react-native";
import React from "react";
import { FlatList, TouchableOpacity } from "react-native";

// Types
interface Professional {
	id: string;
	name: string;
	type: "psychotherapist" | "naturopath" | "yoga" | "counselor" | "wellness";
	specialty: string;
	location: string;
}

// State Management with Jotai
const professionalsAtom = atom<Professional[]>([
	{
		id: "1",
		name: "Dr. Sarah Johnson",
		type: "psychotherapist",
		specialty: "Cognitive Behavioral Therapy",
		location: "New York, NY",
	},
	{
		id: "2",
		name: "Michael Chen",
		type: "naturopath",
		specialty: "Herbal Medicine",
		location: "Portland, OR",
	},
	{
		id: "3",
		name: "Lisa Patel",
		type: "yoga",
		specialty: "Vinyasa Flow",
		location: "San Francisco, CA",
	},
	{
		id: "4",
		name: "James Wilson",
		type: "counselor",
		specialty: "Family Therapy",
		location: "Chicago, IL",
	},
	{
		id: "5",
		name: "Emma Davis",
		type: "wellness",
		specialty: "Mindfulness Coaching",
		location: "Austin, TX",
	},
]);

const selectedProfessionalAtom = atom<Professional | null>(null);

// Professional Card Component
const ProfessionalCard: React.FC<{ professional: Professional }> = ({
	professional,
}) => {
	const [, setSelected] = useAtom(selectedProfessionalAtom);

	const getIcon = (type: Professional["type"]) => {
		switch (type) {
			case "psychotherapist":
				return Brain;
			case "naturopath":
				return Leaf;
			case "yoga":
				return Sun;
			case "counselor":
				return User;
			case "wellness":
				return Heart;
			default:
				return User;
		}
	};

	const getLabelColor = (type: Professional["type"]) => {
		switch (type) {
			case "psychotherapist":
				return "$blue500";
			case "naturopath":
				return "$green500";
			case "yoga":
				return "$yellow500";
			case "counselor":
				return "$purple500";
			case "wellness":
				return "$pink500";
			default:
				return "$gray500";
		}
	};

	return (
		<TouchableOpacity onPress={() => setSelected(professional)}>
			<Box
				bg="$white"
				p="$4"
				m="$2"
				borderRadius="$lg"
				borderWidth="$1"
				borderColor="$gray200"
			>
				<HStack space="md" alignItems="center">
					<Icon
						as={getIcon(professional.type)}
						size="xl"
						color={getLabelColor(professional.type)}
					/>
					<VStack flex={1}>
						<Text fontWeight="$bold" fontSize="$lg">
							{professional.name}
						</Text>
						<Text
							color={getLabelColor(professional.type)}
							fontSize="$sm"
						>
							{professional.type.charAt(0).toUpperCase() +
								professional.type.slice(1)}
						</Text>
						<Text fontSize="$sm" color="$gray600">
							{professional.specialty}
						</Text>
						<Text fontSize="$xs" color="$gray500">
							{professional.location}
						</Text>
					</VStack>
				</HStack>
			</Box>
		</TouchableOpacity>
	);
};

// Main Component
const Professionals: React.FC = () => {
	const [professionals] = useAtom(professionalsAtom);
	const [selectedProfessional] = useAtom(selectedProfessionalAtom);

	return (
		<Box flex={1} bg="$gray100">
			<VStack space="md" p="$4">
				<Heading size="xl" textAlign="center" py="$4">
					Wellbeing Professionals
				</Heading>

				<FlatList
					data={professionals}
					renderItem={({ item }) => (
						<ProfessionalCard professional={item} />
					)}
					keyExtractor={(item) => item.id}
					showsVerticalScrollIndicator={false}
				/>

				{selectedProfessional && (
					<Box
						bg="$white"
						p="$4"
						m="$2"
						borderRadius="$lg"
						borderWidth="$1"
						borderColor="$gray200"
					>
						<Heading size="md">Selected Professional</Heading>
						<Divider my="$2" />
						<Text fontWeight="$bold">
							{selectedProfessional.name}
						</Text>
						<Text>{selectedProfessional.type}</Text>
						<Text>{selectedProfessional.specialty}</Text>
						<Text>{selectedProfessional.location}</Text>
					</Box>
				)}
			</VStack>
		</Box>
	);
};
export default Professionals;
