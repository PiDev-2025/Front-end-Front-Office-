// src/components/ProfessionalProfile.jsx
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import Surreal from "surrealdb";

// Individual GlueStack UI imports
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

// Lucide icons
import { Briefcase, Mail, MapPin } from "lucide-react-native";

// Jotai atoms
const professionalsAtom = atomWithStorage("professionals", []);
const loadingAtom = atomWithStorage("loading", false);
const errorAtom = atomWithStorage("error", null);

// SurrealDB instance
const db = new Surreal("http://localhost:8000/rpc"); // Adjust URL as needed

// Professional types enum
const ProfessionalTypes = {
	DEVELOPER: "Developer",
	DESIGNER: "Designer",
	MANAGER: "Manager",
	CONSULTANT: "Consultant",
};

// SurrealDB fetch function
const fetchProfessionalsFromDB = async () => {
	try {
		// Connect to SurrealDB
		await db.connect();

		// Sign in (adjust credentials as needed)
		await db.signin({
			user: "root",
			pass: "root",
		});

		// Select namespace and database
		await db.use("sw", "core");

		// Fetch all professionals
		const professionals = await db.select("professional");

		return professionals;
	} catch (error) {
		throw new Error(
			"Failed to fetch professionals from SurrealDB: " + error.message
		);
	} finally {
		// Optional: Close connection if needed
		// await db.close();
	}
};

// Professional Card Component
const ProfessionalCard = ({ professional }) => {
	const getBadgeColor = (type) => {
		switch (type) {
			case ProfessionalTypes.DEVELOPER:
				return "success";
			case ProfessionalTypes.DESIGNER:
				return "info";
			case ProfessionalTypes.MANAGER:
				return "warning";
			case ProfessionalTypes.CONSULTANT:
				return "error";
			default:
				return "muted";
		}
	};

	return (
		<Card className="p-5 rounded-lg m-3">
			<HStack space="md">
				<Avatar size="lg">
					<AvatarImage
						source={{
							uri:
								professional.avatar ||
								"https://via.placeholder.com/150",
						}}
						alt={`${professional.name}'s avatar`}
					/>
				</Avatar>
				<VStack flex={1}>
					<Heading size="md">{professional.name}</Heading>
					<HStack space="sm" className="mt-1">
						<Badge
							size="sm"
							variant="solid"
							action={getBadgeColor(professional.type)}
						>
							<BadgeIcon as={Briefcase} className="mr-1" />
							<BadgeText>{professional.type}</BadgeText>
						</Badge>
						<Badge size="sm" variant="outline" action="muted">
							<BadgeIcon as={MapPin} className="mr-1" />
							<BadgeText>{professional.location}</BadgeText>
						</Badge>
					</HStack>
					<Text size="sm" className="mt-2" color="$text600">
						{professional.bio}
					</Text>
					<HStack space="md" className="mt-3">
						<Button size="sm" action="primary">
							<ButtonText>Contact</ButtonText>
							<Mail
								size={16}
								color="white"
								style={{ marginLeft: 4 }}
							/>
						</Button>
						<Button size="sm" variant="outline">
							<ButtonText>View Profile</ButtonText>
						</Button>
					</HStack>
				</VStack>
			</HStack>
		</Card>
	);
};

// Main Professional Profile Component
const ProfessionalProfile = () => {
	const [professionals, setProfessionals] = useAtom(professionalsAtom);
	const [loading, setLoading] = useAtom(loadingAtom);
	const [error, setError] = useAtom(errorAtom);

	useEffect(() => {
		const loadProfessionals = async () => {
			setLoading(true);
			try {
				const data = await fetchProfessionalsFromDB();
				setProfessionals(data);
				setError(null);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		if (!professionals.length) {
			loadProfessionals();
		}
	}, [setProfessionals, setLoading, setError]);

	// Mock data for development
	const mockProfessionals = [
		{
			id: "1",
			name: "John Doe",
			type: ProfessionalTypes.DEVELOPER,
			location: "San Francisco, CA",
			bio: "Senior Full-Stack Developer with 8+ years of experience",
			avatar: "https://randomuser.me/api/portraits/men/1.jpg",
		},
		{
			id: "2",
			name: "Jane Smith",
			type: ProfessionalTypes.DESIGNER,
			location: "New York, NY",
			bio: "Creative UI/UX Designer specializing in mobile apps",
			avatar: "https://randomuser.me/api/portraits/women/2.jpg",
		},
		{
			id: "3",
			name: "Mike Johnson",
			type: ProfessionalTypes.MANAGER,
			location: "Chicago, IL",
			bio: "Project Manager with expertise in Agile methodologies",
			avatar: "https://randomuser.me/api/portraits/men/3.jpg",
		},
	];

	if (loading) {
		return (
			<Box className="flex-1 justify-center items-center">
				<Spinner size="large" />
			</Box>
		);
	}

	if (error) {
		return (
			<Box className="flex-1 justify-center items-center">
				<Text color="$error600">{error}</Text>
				<Button onPress={() => loadProfessionals()} className="mt-4">
					<ButtonText>Retry</ButtonText>
				</Button>
			</Box>
		);
	}

	return (
		<ScrollView style={styles.container}>
			<Box className="p-4">
				<Heading size="xl" className="mb-4">
					Professional Directory
				</Heading>
				<VStack space="md">
					{(professionals.length > 0
						? professionals
						: mockProfessionals
					).map((professional) => (
						<ProfessionalCard
							key={professional.id}
							professional={professional}
						/>
					))}
				</VStack>
			</Box>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
});

export default ProfessionalProfile;

// Optional: Function to seed initial data (run this separately or on first load)
// const seedDatabase = async () => {
// 	try {
// 		await db.connect();
// 		await db.signin({
// 			user: "root",
// 			pass: "root",
// 		});
// 		await db.use("namespace", "database");

// 		const seedData = [
// 			{
// 				id: "professional:1",
// 				name: "John Doe",
// 				type: ProfessionalTypes.DEVELOPER,
// 				location: "San Francisco, CA",
// 				bio: "Senior Full-Stack Developer with 8+ years of experience",
// 				avatar: "https://randomuser.me/api/portraits/men/1.jpg",
// 			},
// 			// Add more seed data as needed
// 		];

// 		await db.create("professional", seedData);
// 	} catch (error) {
// 		console.error("Failed to seed database:", error);
// 	}
// };
