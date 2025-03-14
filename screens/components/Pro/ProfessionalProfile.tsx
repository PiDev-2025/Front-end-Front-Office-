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
	ChevronDown,
	Apple,
	Flower,
	Star,
	PenTool,
	Magnet,
	Leaf,
	Music,
	Hash,
	BrainCircuit,
	Hand,
	Activity,
	Eye,
	Zap,
	Dumbbell,
	CalendarPlus,
	Clapperboard
} from "lucide-react-native";

// Types
interface Professional {
	id: string;
	name: string;
	type: ProfessionalType;
	location: string;
	distance: string;
	bio: string;
	avatar: string;
	compatibility: number;
	satisfaction: number;
	experience: string;
	specialties: string;
	languages: string;
	[key: string]: unknown;
}

// Jotai atoms
const professionalsAtom = atomWithStorage<Professional[]>("professionals", []);
const loadingAtom = atomWithStorage<boolean>("loading", false);
const errorAtom = atomWithStorage<string | null>("error", null);

// Professional types enum
const ProfessionalTypes = {
	DIETETICIEN: "Diététicien",
	SOPHROLOGUE: "Sophrologue",
	AROMATHERAPEUTE: "Aromathérapeute",
	COACH_VIE: "Coach de vie",
	COACH_SEDUCTION: "Coach en séduction",
	COACH_SPORTIF: "Coach sportif",
	ASTROLOGUE: "Astrologue",
	GRAPHOLOGUE: "Graphologue",
	MAGNETISEUR: "Magnétiseur",
	NATUROPATHE: "Naturopathe",
	MUSICOTHERAPEUTE: "Musicothérapeute",
	NUMEROLOGUE: "Numérologue",
	PSYCHANALYSTE: "Psychanalyste",
	PSYCHOLOGUE: "Psychologue",
	PSYCHOPRATICIEN: "Psycho praticien",
	BIO_ENERGETICIEN: "Bio énergéticien",
	REIKI: "Reiki",
	SHIATSU: "Shiatsu",
	YOGA_THERAPEUTE: "Yoga thérapeute",
	HYPNOTISEUR: "Hypnotiseur",
	PHYTOTHERAPEUTE: "Phytothérapeute",
} as const;

type ProfessionalType = typeof ProfessionalTypes[keyof typeof ProfessionalTypes];

// Color and icon mappings for each professional type
const professionalStyles = {
	DIETETICIEN: {
		icon: Apple,
		color: "#4CAF50", // Green
		gradient: ["#4CAF50", "#81C784"]
	},
	SOPHROLOGUE: {
		icon: Brain,
		color: "#2196F3", // Blue
		gradient: ["#2196F3", "#64B5F6"]
	},
	AROMATHERAPEUTE: {
		icon: Flower,
		color: "#9C27B0", // Purple
		gradient: ["#9C27B0", "#BA68C8"]
	},
	COACH_VIE: {
		icon: Heart,
		color: "#E91E63", // Pink
		gradient: ["#E91E63", "#F48FB1"]
	},
	COACH_SEDUCTION: {
		icon: Sparkles,
		color: "#FF9800", // Orange
		gradient: ["#FF9800", "#FFB74D"]
	},
	COACH_SPORTIF: {
		icon: Dumbbell,
		color: "#F44336", // Red
		gradient: ["#F44336", "#EF5350"]
	},
	ASTROLOGUE: {
		icon: Star,
		color: "#673AB7", // Deep Purple
		gradient: ["#673AB7", "#9575CD"]
	},
	GRAPHOLOGUE: {
		icon: PenTool,
		color: "#795548", // Brown
		gradient: ["#795548", "#A1887F"]
	},
	MAGNETISEUR: {
		icon: Magnet,
		color: "#3F51B5", // Indigo
		gradient: ["#3F51B5", "#7986CB"]
	},
	NATUROPATHE: {
		icon: Leaf,
		color: "#8BC34A", // Light Green
		gradient: ["#8BC34A", "#AED581"]
	},
	MUSICOTHERAPEUTE: {
		icon: Music,
		color: "#FF5722", // Deep Orange
		gradient: ["#FF5722", "#FF8A65"]
	},
	NUMEROLOGUE: {
		icon: Hash,
		color: "#607D8B", // Blue Grey
		gradient: ["#607D8B", "#90A4AE"]
	},
	PSYCHANALYSTE: {
		icon: BrainCircuit,
		color: "#9C27B0", // Purple
		gradient: ["#9C27B0", "#BA68C8"]
	},
	PSYCHOLOGUE: {
		icon: Brain,
		color: "#2196F3", // Blue
		gradient: ["#2196F3", "#64B5F6"]
	},
	PSYCHOPRATICIEN: {
		icon: Brain,
		color: "#2196F3", // Blue
		gradient: ["#2196F3", "#64B5F6"]
	},
	BIO_ENERGETICIEN: {
		icon: Zap,
		color: "#FFC107", // Amber
		gradient: ["#FFC107", "#FFD54F"]
	},
	REIKI: {
		icon: Sparkles,
		color: "#00BCD4", // Cyan
		gradient: ["#00BCD4", "#4DD0E1"]
	},
	SHIATSU: {
		icon: Hand,
		color: "#795548", // Brown
		gradient: ["#795548", "#A1887F"]
	},
	YOGA_THERAPEUTE: {
		icon: Activity,
		color: "#4CAF50", // Green
		gradient: ["#4CAF50", "#81C784"]
	},
	HYPNOTISEUR: {
		icon: Eye,
		color: "#3F51B5", // Indigo
		gradient: ["#3F51B5", "#7986CB"]
	},
	PHYTOTHERAPEUTE: {
		icon: Leaf,
		color: "#8BC34A", // Light Green
		gradient: ["#8BC34A", "#AED581"]
	}
} as const;



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
		const key = Object.entries(ProfessionalTypes).find(([_, value]) => value === type)?.[0];
		return key ? professionalStyles[key as keyof typeof professionalStyles]?.color : "#666";
	};

	const getBadgeIcon = (type: ProfessionalType) => {
		const key = Object.entries(ProfessionalTypes).find(([_, value]) => value === type)?.[0];
		return key ? professionalStyles[key as keyof typeof professionalStyles]?.icon : Briefcase;
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
			<Box
				style={{
					position: 'absolute',
					left: 0,
					bottom: 0,
					width: 3 ,
					top: 0,
					overflow: 'hidden',
				}}
			>
				<LinearGradient
					start={{x: 0, y: 0}}
					end={{x: 0, y: 1}}
					colors={(() => {
						const key = Object.entries(ProfessionalTypes).find(([_, value]) => value === professional.type)?.[0];
						return key ? [...professionalStyles[key as keyof typeof professionalStyles]?.gradient] : ['#22C55E', '#0EA5E9'];
					})()}
					style={StyleSheet.absoluteFill}
				/>
			</Box>
			<Box
				style={{
					position: 'absolute',
					left: 0,
					bottom: 0,
					right: 0,
					height: 2,
					overflow: 'hidden',
				}}
			>
				{/* <LinearGradient
					start={{x: 0, y: 0}}
					end={{x: 1, y: 0}}
					colors={(() => {
						const key = Object.entries(ProfessionalTypes).find(([_, value]) => value === professional.type)?.[0];
						return key ? [...professionalStyles[key as keyof typeof professionalStyles]?.gradient] : ['#22C55E', '#0EA5E9'];
					})()}
					style={StyleSheet.absoluteFill}
				/> */}
			</Box>
			{/* Top Section */}
			<VStack space="md">
				<HStack space="md" style={{ alignItems: 'flex-start' }}>
					<VStack space="xs" style={{ width: 110 }}>
						<Avatar size="2xl">
							<AvatarImage
								source={{
									uri: professional.avatar || "https://via.placeholder.com/150",
								}}
								alt={`${professional.name}'s avatar`}
							/>
						</Avatar>
						<VStack space="xs" style={{ width: '100%', gap: 2 }}>
							<HStack 
								space="xs" 
								style={{ 
									alignItems: 'center',
									justifyContent: 'flex-start',
									width: '100%',
									gap: 4
								}}
							>
								<Button
									size="sm"
									variant="link"
									style={{
										borderColor: getBadgeColor(professional.type),
										padding: 2
									}}
								>
									<MapPin size={14} color={getBadgeColor(professional.type)} />
								</Button>
								<Text size="xs" italic>locate me</Text>
							</HStack>
							<HStack 
								space="xs" 
								style={{ 
									alignItems: 'center',
									justifyContent: 'flex-start',
									width: '100%',
									gap: 4
								}}
							>
								<Button
									size="sm"
									variant="link"
									style={{
										borderColor: getBadgeColor(professional.type),
										padding: 2
									}}
								>
									<Mail size={14} color={getBadgeColor(professional.type)} />
								</Button>
								<Text size="xs" italic>chat with me</Text>
							</HStack>
							<HStack 
								space="xs" 
								style={{ 
									alignItems: 'center',
									justifyContent: 'flex-start',
									width: '100%',
									gap: 4
								}}
							>
								<Button
									size="sm"
									variant="link"
									style={{
										borderColor: getBadgeColor(professional.type),
										padding: 2
									}}
								>
									<Target size={14} color={getBadgeColor(professional.type)} />
								</Button>
								<Text size="xs" italic>see my programs</Text>
							</HStack>
							<HStack 
								space="xs" 
								style={{ 
									alignItems: 'center',
									justifyContent: 'flex-start',
									width: '100%',
									gap: 4
								}}
							>
								<Button
									size="sm"
									variant="link"
									style={{
										borderColor: getBadgeColor(professional.type),
										padding: 2
									}}
								>
									<Clapperboard size={14} color={getBadgeColor(professional.type)} />
								</Button>
								<Text size="xs" italic>see my content</Text>
							</HStack>
						</VStack>
					</VStack>
					<VStack space="xs" style={{ flex: 1 }}>
						<Heading size="md">{professional.name}</Heading>
						<VStack space="sm">
							<Badge
								size="sm"
								variant="solid"
								style={{
									backgroundColor: getBadgeColor(professional.type)
								}}
							>
								<Box style={{ flexDirection: 'row', alignItems: 'center' }}>
									<BadgeIcon 
										as={getBadgeIcon(professional.type)} 
										size="sm"
										color="white"
									/>
									<Box style={{ width: 4 }} />
									<BadgeText style={{ color: 'white' }}>{professional.type}</BadgeText>
								</Box>
							</Badge>
							<HStack space="xs" style={{ width: '100%' }}>
								<Badge 
									size="sm" 
									variant="outline" 
									style={{ 
										borderColor: '#666',
										flex: 4
									}}
								>
									<Box style={{ flexDirection: 'row', alignItems: 'center' }}>
										<BadgeIcon as={MapPin} size="sm" color="#666" />
										<Box style={{ width: 4 }} />
										<BadgeText style={{ color: '#666' }}>{professional.location}</BadgeText>
									</Box>
								</Badge>
								<Badge 
									size="sm" 
									variant="outline" 
									style={{ 
										borderColor: '#666',
										flex: 2
									}}
								>
									<Box style={{ flexDirection: 'row', alignItems: 'center' }}>
										<BadgeIcon as={Target} size="sm" color="#666" />
										<Box style={{ width: 4 }} />
										<BadgeText style={{ color: '#666' }}>{professional.distance} km</BadgeText>
									</Box>
								</Badge>
							</HStack>
						</VStack>
						<Box className="bg-gray-50 rounded-lg p-2 mt-1">
							<Text size="sm" italic>
								{professional.bio}
							</Text>
						</Box>
						<Box className="mt-2">
							<VStack space="xs">
								<Box>
									<HStack space="xs" className="mb-1">
										<Text size="xs" bold>Compatibility:</Text>
										<Text size="xs">{professional.compatibility || 85}%</Text>
									</HStack>
									<Box style={{ position: 'relative' }}>
										<Progress size="sm" value={100}>
											<ProgressFilledTrack>
												<LinearGradient
													start={{x: 0, y: 0}}
													end={{x: 1, y: 0}}
													colors={['#E5E7EB', '#D1D5DB']}
													style={StyleSheet.absoluteFill}
												/>
											</ProgressFilledTrack>
										</Progress>
										<Box style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
											<Progress size="sm" value={professional.compatibility || 85}>
												<ProgressFilledTrack>
													<LinearGradient
														start={{x: 0, y: 0}}
														end={{x: 1, y: 0}}
														colors={(() => {
															const key = Object.entries(ProfessionalTypes).find(([_, value]) => value === professional.type)?.[0];
															const gradient = key ? professionalStyles[key as keyof typeof professionalStyles]?.gradient : ['#22C55E', '#0EA5E9'];
															return [...gradient];
														})()}
														style={StyleSheet.absoluteFill}
													/>
												</ProgressFilledTrack>
											</Progress>
										</Box>
									</Box>
								</Box>
								<Box>
									<HStack space="xs" className="mb-1">
										<Text size="xs" bold>Satisfaction:</Text>
										<Text size="xs">{professional.satisfaction || 90}%</Text>
									</HStack>
									<Box style={{ position: 'relative' }}>
										<Progress size="sm" value={100}>
											<ProgressFilledTrack>
												<LinearGradient
													start={{x: 0, y: 0}}
													end={{x: 1, y: 0}}
													colors={['#E5E7EB', '#D1D5DB']}
													style={StyleSheet.absoluteFill}
												/>
											</ProgressFilledTrack>
										</Progress>
										<Box style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
											<Progress size="sm" value={professional.satisfaction || 90}>
												<ProgressFilledTrack>
													<LinearGradient
														start={{x: 0, y: 0}}
														end={{x: 1, y: 0}}
														colors={['#F59E0B', '#FCD34D']}
														style={StyleSheet.absoluteFill}
													/>
												</ProgressFilledTrack>
											</Progress>
										</Box>
									</Box>
								</Box>
								<Box>
									<HStack space="xs" className="mb-1">
										<Text size="xs" bold>Accompanied:</Text>
										<Text size="xs">{professional.satisfaction || 90} persons</Text>
									</HStack>
									<Box style={{ position: 'relative' }}>
										<Progress size="sm" value={100}>
											<ProgressFilledTrack>
												<LinearGradient
													start={{x: 0, y: 0}}
													end={{x: 1, y: 0}}
													colors={['#E5E7EB', '#D1D5DB']}
													style={StyleSheet.absoluteFill}
												/>
											</ProgressFilledTrack>
										</Progress>
										<Box style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
											<Progress size="sm" value={professional.satisfaction || 90}>
												<ProgressFilledTrack>
													<LinearGradient
														start={{x: 0, y: 0}}
														end={{x: 1, y: 0}}
														colors={['#F59E0B', '#FCD34D']}
														style={StyleSheet.absoluteFill}
													/>
												</ProgressFilledTrack>
											</Progress>
										</Box>
									</Box>
								</Box>
							</VStack>
						</Box>
					</VStack>
				</HStack>

				{/* Expandable Section */}
				{isExpanded && (
					<Box className="bg-gray-50 rounded-lg p-4 mt-2">
						<VStack space="md">
							<HStack space="md">
								<Text size="sm" bold style={{ width: 100 }}>Experience:</Text>
								<Text size="sm">{professional.experience}</Text>
							</HStack>
							<HStack space="md" style={{ alignItems: 'flex-start' }}>
								<Text size="sm" bold style={{ width: 100 }}>Specialties:</Text>
								<Text size="sm" style={{ flex: 1 }}>{professional.specialties}</Text>
							</HStack>
							<HStack space="md">
								<Text size="sm" bold style={{ width: 100 }}>Languages:</Text>
								<Text size="sm">{professional.languages}</Text>
							</HStack>
							{/* <HStack space="md">
								<Text size="sm" bold style={{ width: 100 }}>Availability:</Text>
								<Text size="sm">{professional.availability}</Text>
							</HStack> */}
						</VStack>
					</Box>
				)}
			</VStack>

			{/* Expand/Collapse Button */}
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

// API fetch function
const fetchProfessionalsFromDB = async (): Promise<Professional[]> => {
	try {
		const response = await fetch('http://127.0.0.1:8000/professionals');
		if (!response.ok) {
			throw new Error('Failed to fetch professionals');
		}
		const data = await response.json();
		return data as Professional[];
	} catch (error) {
		console.error('Error fetching professionals:', error);
		return [];
	}
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
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError('An unknown error occurred');
				}
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
			name: "Marie Dubois",
			type: ProfessionalTypes.DIETETICIEN,
			location: "Paris, FR",
			distance: "2.5",
			bio: "Diététicienne spécialisée en rééquilibrage alimentaire et nutrition sportive",
			avatar: "https://randomuser.me/api/portraits/women/1.jpg",
			compatibility: 88,
			experience: "8 ans",
			specialties: "Nutrition sportive, Rééquilibrage alimentaire, Allergies alimentaires",
			languages: "Français, Anglais",
			availability: "Lundi-Vendredi, 9h-19h"
		},
		{
			id: "2",
			name: "Sophie Martin",
			type: ProfessionalTypes.SOPHROLOGUE,
			location: "Lyon, FR",
			distance: "5.8",
			bio: "Sophrologue certifiée, spécialisée en gestion du stress et sommeil",
			avatar: "https://randomuser.me/api/portraits/women/2.jpg",
			compatibility: 92,
			experience: "12 ans",
			specialties: "Gestion du stress, Troubles du sommeil, Préparation mentale",
			languages: "Français, Espagnol",
			availability: "Lundi-Samedi, 8h-20h"
		},
		{
			id: "3",
			name: "Lucas Bernard",
			type: ProfessionalTypes.AROMATHERAPEUTE,
			location: "Nice, FR",
			distance: "8.3",
			bio: "Aromathérapeute passionné par les huiles essentielles et le bien-être naturel",
			avatar: "https://randomuser.me/api/portraits/men/3.jpg",
			compatibility: 75,
			experience: "6 ans",
			specialties: "Huiles essentielles, Phytothérapie, Massages aromatiques",
			languages: "Français, Italien",
			availability: "Mardi-Samedi, 10h-18h"
		},
		{
			id: "4",
			name: "Emma Petit",
			type: ProfessionalTypes.COACH_VIE,
			location: "Bordeaux, FR",
			distance: "12.1",
			bio: "Coach de vie certifiée, spécialisée en développement personnel et professionnel",
			avatar: "https://randomuser.me/api/portraits/women/4.jpg",
			compatibility: 95,
			experience: "10 ans",
			specialties: "Développement personnel, Coaching professionnel, Gestion des transitions",
			languages: "Français, Anglais, Espagnol",
			availability: "Lundi-Vendredi, 9h-18h"
		},
		{
			id: "5",
			name: "Thomas Moreau",
			type: ProfessionalTypes.COACH_SEDUCTION,
			location: "Paris, FR",
			distance: "3.2",
			bio: "Expert en développement des relations et confiance en soi",
			avatar: "https://randomuser.me/api/portraits/men/5.jpg",
			compatibility: 70,
			experience: "7 ans",
			specialties: "Confiance en soi, Communication, Relations interpersonnelles",
			languages: "Français, Anglais",
			availability: "Lundi-Samedi, 10h-22h"
		},
		{
			id: "6",
			name: "Julie Leroy",
			type: ProfessionalTypes.COACH_SPORTIF,
			location: "Marseille, FR",
			distance: "15.7",
			bio: "Coach sportive spécialisée en remise en forme et nutrition sportive",
			avatar: "https://randomuser.me/api/portraits/women/6.jpg",
			compatibility: 85,
			experience: "9 ans",
			specialties: "Remise en forme, Musculation, Course à pied",
			languages: "Français, Anglais",
			availability: "Lundi-Samedi, 7h-20h"
		},
		{
			id: "7",
			name: "Antoine Roux",
			type: ProfessionalTypes.ASTROLOGUE,
			location: "Toulouse, FR",
			distance: "9.4",
			bio: "Astrologue professionnel, expert en thèmes natals et synastries",
			avatar: "https://randomuser.me/api/portraits/men/7.jpg",
			compatibility: 78,
			experience: "15 ans",
			specialties: "Thème natal, Synastrie, Transits planétaires",
			languages: "Français, Anglais",
			availability: "Mardi-Dimanche, 10h-22h"
		},
		{
			id: "8",
			name: "Claire Fontaine",
			type: ProfessionalTypes.GRAPHOLOGUE,
			location: "Nantes, FR",
			distance: "7.6",
			bio: "Graphologue experte en analyse d'écriture et développement personnel",
			avatar: "https://randomuser.me/api/portraits/women/8.jpg",
			compatibility: 72,
			experience: "11 ans",
			specialties: "Analyse d'écriture, Orientation professionnelle, Développement personnel",
			languages: "Français, Allemand",
			availability: "Lundi-Vendredi, 9h-17h"
		},
		{
			id: "9",
			name: "Pierre Dupont",
			type: ProfessionalTypes.MAGNETISEUR,
			location: "Strasbourg, FR",
			distance: "11.2",
			bio: "Magnétiseur expérimenté, pratique les soins énergétiques depuis 15 ans",
			avatar: "https://randomuser.me/api/portraits/men/9.jpg",
			compatibility: 82,
			experience: "15 ans",
			specialties: "Soins énergétiques, Magnétisme curatif, Rééquilibrage",
			languages: "Français, Allemand",
			availability: "Lundi-Samedi, 9h-19h"
		},
		{
			id: "10",
			name: "Sarah Lambert",
			type: ProfessionalTypes.NATUROPATHE,
			location: "Lille, FR",
			distance: "6.9",
			bio: "Naturopathe holistique, spécialisée en nutrition et plantes médicinales",
			avatar: "https://randomuser.me/api/portraits/women/10.jpg",
			compatibility: 89,
			experience: "13 ans",
			specialties: "Nutrition naturelle, Phytothérapie, Iridologie",
			languages: "Français, Anglais",
			availability: "Lundi-Vendredi, 9h-18h"
		},
		{
			id: "11",
			name: "Marc Girard",
			type: ProfessionalTypes.MUSICOTHERAPEUTE,
			location: "Montpellier, FR",
			distance: "13.5",
			bio: "Musicothérapeute certifié, utilisant la musique comme outil thérapeutique",
			avatar: "https://randomuser.me/api/portraits/men/11.jpg",
			compatibility: 77,
			experience: "8 ans",
			specialties: "Thérapie par la musique, Relaxation sonore, Expression musicale",
			languages: "Français, Espagnol",
			availability: "Lundi-Samedi, 10h-19h"
		},
		{
			id: "12",
			name: "Isabelle Blanc",
			type: ProfessionalTypes.NUMEROLOGUE,
			location: "Rennes, FR",
			distance: "4.8",
			bio: "Numérologue passionnée par les nombres et leur influence sur notre vie",
			avatar: "https://randomuser.me/api/portraits/women/12.jpg",
			compatibility: 68,
			experience: "6 ans",
			specialties: "Numérologie karmique, Analyse des cycles, Prédictions",
			languages: "Français, Anglais",
			availability: "Mardi-Samedi, 11h-20h"
		},
		{
			id: "13",
			name: "François Rousseau",
			type: ProfessionalTypes.PSYCHANALYSTE,
			location: "Grenoble, FR",
			distance: "10.3",
			bio: "Psychanalyste formé à l'approche freudienne et jungienne",
			avatar: "https://randomuser.me/api/portraits/men/13.jpg",
			compatibility: 91,
			experience: "20 ans",
			specialties: "Psychanalyse freudienne, Psychanalyse jungienne, Thérapie analytique",
			languages: "Français, Anglais, Allemand",
			availability: "Lundi-Vendredi, 9h-19h"
		},
		{
			id: "14",
			name: "Aurélie Durand",
			type: ProfessionalTypes.PSYCHOLOGUE,
			location: "Tours, FR",
			distance: "8.7",
			bio: "Psychologue clinicienne spécialisée en thérapie cognitive et comportementale",
			avatar: "https://randomuser.me/api/portraits/women/14.jpg",
			compatibility: 93,
			experience: "14 ans",
			specialties: "TCC, Thérapie des traumatismes, Thérapie de couple",
			languages: "Français, Anglais",
			availability: "Lundi-Vendredi, 9h-18h"
		},
		{
			id: "15",
			name: "Laurent Martin",
			type: ProfessionalTypes.PSYCHOPRATICIEN,
			location: "Dijon, FR",
			distance: "14.2",
			bio: "Psychopraticien intégratif, combinant différentes approches thérapeutiques",
			avatar: "https://randomuser.me/api/portraits/men/15.jpg",
			compatibility: 87,
			experience: "12 ans",
			specialties: "Thérapie intégrative, Gestalt-thérapie, Psychothérapie humaniste",
			languages: "Français, Anglais",
			availability: "Lundi-Samedi, 9h-19h"
		},
		{
			id: "16",
			name: "Céline Robert",
			type: ProfessionalTypes.BIO_ENERGETICIEN,
			location: "Angers, FR",
			distance: "7.1",
			bio: "Bio-énergéticienne expérimentée en rééquilibrage énergétique",
			avatar: "https://randomuser.me/api/portraits/women/16.jpg",
			compatibility: 79,
			experience: "10 ans",
			specialties: "Bioénergie, Rééquilibrage énergétique, Thérapie vibratoire",
			languages: "Français, Espagnol",
			availability: "Mardi-Samedi, 10h-19h"
		},
		{
			id: "17",
			name: "Nicolas Mercier",
			type: ProfessionalTypes.REIKI,
			location: "Le Mans, FR",
			distance: "5.5",
			bio: "Maître Reiki certifié, pratiquant les soins énergétiques traditionnels",
			avatar: "https://randomuser.me/api/portraits/men/17.jpg",
			compatibility: 83,
			experience: "16 ans",
			specialties: "Reiki Usui, Reiki Karuna, Soins énergétiques",
			languages: "Français, Anglais",
			availability: "Lundi-Samedi, 9h-20h"
		},
		{
			id: "18",
			name: "Émilie Fournier",
			type: ProfessionalTypes.SHIATSU,
			location: "Clermont-Ferrand, FR",
			distance: "16.8",
			bio: "Praticienne en Shiatsu certifiée, experte en médecine traditionnelle japonaise",
			avatar: "https://randomuser.me/api/portraits/women/18.jpg",
			compatibility: 86,
			experience: "13 ans",
			specialties: "Shiatsu thérapeutique, Médecine traditionnelle japonaise, Acupression",
			languages: "Français, Japonais",
			availability: "Lundi-Vendredi, 9h-19h"
		},
		{
			id: "19",
			name: "David Simon",
			type: ProfessionalTypes.YOGA_THERAPEUTE,
			location: "Aix-en-Provence, FR",
			distance: "17.3",
			bio: "Professeur de yoga thérapeutique, spécialisé dans la gestion du stress",
			avatar: "https://randomuser.me/api/portraits/men/19.jpg",
			compatibility: 90,
			experience: "11 ans",
			specialties: "Yoga thérapeutique, Méditation, Gestion du stress",
			languages: "Français, Anglais, Sanskrit",
			availability: "Lundi-Samedi, 7h-20h"
		},
		{
			id: "20",
			name: "Mathilde Leroux",
			type: ProfessionalTypes.HYPNOTISEUR,
			location: "Reims, FR",
			distance: "18.9",
			bio: "Hypnothérapeute certifiée, spécialisée en gestion des phobies et addictions",
			avatar: "https://randomuser.me/api/portraits/women/20.jpg",
			compatibility: 84,
			experience: "9 ans",
			specialties: "Hypnose ericksonienne, Gestion des phobies, Arrêt du tabac",
			languages: "Français, Anglais",
			availability: "Lundi-Vendredi, 9h-19h"
		},
		{
			id: "21",
			name: "Philippe Gauthier",
			type: ProfessionalTypes.PHYTOTHERAPEUTE,
			location: "Orléans, FR",
			distance: "9.8",
			bio: "Phytothérapeute expert en plantes médicinales et remèdes naturels",
			avatar: "https://randomuser.me/api/portraits/men/21.jpg",
			compatibility: 81,
			experience: "17 ans",
			specialties: "Plantes médicinales, Herboristerie, Aromathérapie",
			languages: "Français, Latin",
			availability: "Lundi-Samedi, 9h-18h"
		}
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

