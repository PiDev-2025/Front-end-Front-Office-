// src/components/ProfessionalProfile.jsx
import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import React, { useEffect } from "react";
import { ScrollView, StyleSheet, Pressable } from "react-native";
import Surreal from "surrealdb";
import LinearGradient from 'react-native-linear-gradient';

// Individual GlueStack UI imports
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

// Lucide icons
import { 
	Briefcase, 
	Code, 
	Palette, 
	UserCog, 
	MapPin, 
	Mail, 
	Brain,
	Heart,
	Smile,
	Users,
	Clock,
	Target,
	Lightbulb,
	Coffee,
	Sparkles,
	LucideIcon,
	ChevronDown
} from "lucide-react-native";

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
} as const;

type ProfessionalType = typeof ProfessionalTypes[keyof typeof ProfessionalTypes];

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

interface Skill {
	name: string;
	icon: LucideIcon;
	color: string;
}

interface SkillMap {
	[key: string]: Skill[];
}

// Professional Card Component
const ProfessionalCard = ({ 
	professional, 
	isExpanded, 
	onToggle 
}: { 
	professional: any, 
	isExpanded: boolean,
	onToggle: (expanded: boolean) => void
}) => {
	const getBadgeColor = (type: ProfessionalType) => {
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

	const getBadgeIcon = (type: ProfessionalType) => {
		switch (type) {
			case ProfessionalTypes.DEVELOPER:
				return Code;
			case ProfessionalTypes.DESIGNER:
				return Palette;
			case ProfessionalTypes.MANAGER:
				return UserCog;
			case ProfessionalTypes.CONSULTANT:
				return Briefcase;
			default:
				return Briefcase;
		}
	};

	const getSkillBadges = (): Skill[] => {
		const skillsMap: SkillMap = {
			DEVELOPER: [
				{ name: "Problem Solving", icon: Brain, color: "#22C55E" },
				{ name: "Anxiety", icon: Heart, color: "#EF4444" },
				{ name: "Depression", icon: Smile, color: "#F59E0B" },
				{ name: "Group Therapy", icon: Users, color: "#0EA5E9" },
				{ name: "Crisis Management", icon: Target, color: "#EF4444" }
			],
			DESIGNER: [
				{ name: "Emotional Design", icon: Heart, color: "#EF4444" },
				{ name: "Mindfulness", icon: Brain, color: "#22C55E" },
				{ name: "Stress Relief", icon: Coffee, color: "#F59E0B" },
				{ name: "Creative Therapy", icon: Palette, color: "#0EA5E9" },
				{ name: "Positive Thinking", icon: Sparkles, color: "#22C55E" }
			],
			MANAGER: [
				{ name: "Leadership", icon: UserCog, color: "#F59E0B" },
				{ name: "Team Building", icon: Users, color: "#0EA5E9" },
				{ name: "Time Management", icon: Clock, color: "#22C55E" },
				{ name: "Crisis Support", icon: Target, color: "#EF4444" },
				{ name: "Innovation", icon: Lightbulb, color: "#F59E0B" }
			],
			CONSULTANT: [
				{ name: "Strategy", icon: Target, color: "#EF4444" },
				{ name: "Mentoring", icon: Users, color: "#0EA5E9" },
				{ name: "Quick Response", icon: Clock, color: "#22C55E" },
				{ name: "Solutions", icon: Lightbulb, color: "#F59E0B" },
				{ name: "Empathy", icon: Heart, color: "#EF4444" }
			]
		};

		return skillsMap[professional.type] || skillsMap.CONSULTANT;
	};

	return (
		<Card className="py-5 pr-5 rounded-lg my-3 relative">
			<HStack space="xs">
				<VStack space="sm" style={{ alignItems: 'center', width: 120 }}>
					<Avatar size="2xl">
						<AvatarImage
							source={{
								uri:
									professional.avatar ||
									"https://via.placeholder.com/150",
							}}
							alt={`${professional.name}'s avatar`}
						/>
					</Avatar>
				</VStack>
				<VStack flex={1}>
					<Heading size="md">{professional.name}</Heading>
					<HStack space="sm" className="mt-1">
						<Badge
							size="sm"
							variant="solid"
							action={getBadgeColor(professional.type)}
						>
							<Box style={{ flexDirection: 'row', alignItems: 'center' }}>
								<BadgeIcon as={getBadgeIcon(professional.type)} size="sm" />
								<Box style={{ width: 4 }} />
								<BadgeText>{professional.type}</BadgeText>
							</Box>
						</Badge>
						<Badge size="sm" variant="outline" action="muted">
							<Box style={{ flexDirection: 'row', alignItems: 'center' }}>
								<BadgeIcon as={MapPin} size="sm" />
								<Box style={{ width: 4 }} />
								<BadgeText>{professional.location}</BadgeText>
							</Box>
						</Badge>
					</HStack>
					<Box className="px-3 bg-gray-50 rounded-lg mt-2">
						<Text size="sm" italic>
							{professional.bio}
						</Text>
					</Box>
					<Box className="mt-3">
						<HStack space="xs" className="mb-1">
							<Text size="xs" bold>Compatibility:</Text>
							<Text size="xs">{professional.compatibility || 85}%</Text>
						</HStack>
						<Progress size="sm" value={professional.compatibility || 85}>
							<ProgressFilledTrack>
								<LinearGradient
									start={{x: 0, y: 0}}
									end={{x: 1, y: 0}}
									colors={['#22C55E', '#0EA5E9']}
									style={StyleSheet.absoluteFill}
								/>
							</ProgressFilledTrack>
						</Progress>
					</Box>

					{isExpanded && (
						<Box className="mt-4 px-3 py-2 bg-gray-50 rounded-lg">
							<VStack space="sm">
								<HStack space="sm" className="mb-2">
									<Text size="sm" bold>Experience:</Text>
									<Text size="sm">{professional.experience || '5+ years'}</Text>
								</HStack>
								<HStack space="sm" className="mb-2">
									<Text size="sm" bold>Specialties:</Text>
									<Text size="sm">{professional.specialties || 'Full-stack Development'}</Text>
								</HStack>
								<HStack space="sm" className="mb-2">
									<Text size="sm" bold>Languages:</Text>
									<Text size="sm">{professional.languages || 'English, Spanish'}</Text>
								</HStack>
								<HStack space="sm" className="mb-2">
									<Text size="sm" bold>Availability:</Text>
									<Text size="sm">{professional.availability || 'Full-time'}</Text>
								</HStack>
							</VStack>
						</Box>
					)}
				</VStack>
			</HStack>
			<Box style={{ 
				position: 'absolute',
				left: 0,
				right: 0,
				bottom: -12,
				alignItems: 'center',
				zIndex: 10
			}}>
				<Pressable 
					onPress={() => onToggle(!isExpanded)}
					style={{
						backgroundColor: 'white',
						borderRadius: 15,
						padding: 2,
						shadowColor: "#000",
						shadowOffset: {
							width: 0,
							height: 2,
						},
						shadowOpacity: 0.15,
						shadowRadius: 3,
						elevation: 3,
					}}
				>
					<ChevronDown
						size={20}
						color="#666"
						style={{
							transform: [{ rotate: isExpanded ? '180deg' : '0deg' }]
						}}
					/>
				</Pressable>
			</Box>
		</Card>
	);
};

// Main Professional Profile Component
const ProfessionalProfile = () => {
	const [professionals, setProfessionals] = useAtom(professionalsAtom);
	const [loading, setLoading] = useAtom(loadingAtom);
	const [error, setError] = useAtom(errorAtom);
	const [expandedCards, setExpandedCards] = React.useState<Set<string>>(new Set());

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

		setError(false);

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

	// if (error) {
	// 	return (
	// 		<Box className="flex-1 justify-center items-center">
	// 			<Text color="$error600">{error}</Text>
	// 			<Button onPress={() => loadProfessionals()} className="mt-4">
	// 				<ButtonText>Retry</ButtonText>
	// 			</Button>
	// 		</Box>
	// 	);
	// }

	return (
		<ScrollView style={styles.container}>
			<Box className="p-4">
				<VStack space="md">
					{(professionals.length > 0
						? professionals
						: mockProfessionals
					).map((professional) => (
						<ProfessionalCard
							key={professional.id}
							professional={professional}
							isExpanded={expandedCards.has(professional.id)}
							onToggle={(expanded) => {
								const newSet = new Set(expandedCards);
								if (expanded) {
									newSet.add(professional.id);
								} else {
									newSet.delete(professional.id);
								}
								setExpandedCards(newSet);
							}}
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
