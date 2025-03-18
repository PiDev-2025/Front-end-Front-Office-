import { Icon } from "@/components/ui/icon";
import { BriefcaseMedicalIcon, LeafIcon, UserIcon } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Modal, ScrollView, Pressable, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { ProfessionalTypes, professionalStyles } from "@/constants/professional-types";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import LinearGradient from 'react-native-linear-gradient';
import { Target, Mail, MapPin, ChevronDown, Clapperboard, Clock, Calendar as CalendarIcon } from "lucide-react-native";
import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from "@/components/ui/select";

// Add new interfaces
interface TimeSlot {
	time: string;
	available: boolean;
}

interface Service {
	id: string;
	name: string;
	duration: number;
	price: number;
}

// Add new interface for DaySlots
interface DaySlots {
	date: Date;
	slots: TimeSlot[];
}

// Professional Card Component from ProfessionalProfile
const ProfessionalCard = ({ 
	professional, 
	isExpanded, 
	onToggle,
	onClose 
}: { 
	professional: any, 
	isExpanded: boolean,
	onToggle: (expanded: boolean) => void,
	onClose: () => void
}) => {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [selectedService, setSelectedService] = useState<string>("");
	const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
	const [selectedDay, setSelectedDay] = useState<Date>(new Date());

	const getBadgeColor = (type: string) => {
		const key = Object.entries(ProfessionalTypes).find(([_, value]) => value === type)?.[0];
		return key ? professionalStyles[key as keyof typeof professionalStyles]?.color : "#666";
	};

	const getBadgeIcon = (type: string) => {
		const key = Object.entries(ProfessionalTypes).find(([_, value]) => value === type)?.[0];
		return key ? professionalStyles[key as keyof typeof professionalStyles]?.icon : BriefcaseMedicalIcon;
	};

	// Mock services data
	const services: Service[] = [
		{ id: '1', name: 'Initial Consultation', duration: 60, price: 80 },
		{ id: '2', name: 'Follow-up Session', duration: 45, price: 65 },
		{ id: '3', name: 'Quick Check-in', duration: 30, price: 45 },
	];

	// Generate time slots for a given date
	const generateTimeSlots = (date: Date): TimeSlot[] => {
		const slots: TimeSlot[] = [];
		const startHour = 9; // 9 AM
		const endHour = 18; // 6 PM

		for (let hour = startHour; hour < endHour; hour++) {
			for (let minute = 0; minute < 60; minute += 30) {
				const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
				slots.push({
					time,
					available: Math.random() > 0.3 // Random availability for demo
				});
			}
		}
		return slots;
	};

	// Generate next 7 days with their time slots
	const generateWeekSlots = (): DaySlots[] => {
		const weekSlots: DaySlots[] = [];
		const today = new Date();

		for (let i = 0; i < 7; i++) {
			const date = new Date(today);
			date.setDate(today.getDate() + i);
			weekSlots.push({
				date: date,
				slots: generateTimeSlots(date)
			});
		}
		return weekSlots;
	};

	const weekSlots = generateWeekSlots();

	// Format date to display day and date
	const formatDate = (date: Date): string => {
		const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
	};

	// Check if two dates are the same day
	const isSameDay = (date1: Date, date2: Date): boolean => {
		return date1.getDate() === date2.getDate() &&
			   date1.getMonth() === date2.getMonth() &&
			   date1.getFullYear() === date2.getFullYear();
	};

	return (
		<Modal
			animationType="slide"
			transparent={true}
			visible={true}
			onRequestClose={onClose}
		>
			<Box style={styles.modalContainer}>
				<ScrollView style={styles.modalContent}>
					<Card className="py-5 pr-5 rounded-lg my-3 relative">
						<Box style={{
							position: 'absolute',
							right: 10,
							top: 10,
							zIndex: 10
						}}>
							<Button
								size="sm"
								variant="link"
								onPress={onClose}
								style={{
									padding: 4,
									backgroundColor: 'rgba(0,0,0,0.1)',
									borderRadius: 20
								}}
							>
								<Text>✕</Text>
							</Button>
						</Box>
						<Box
							style={{
								position: 'absolute',
								left: 0,
								bottom: 0,
								width: 3,
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
												gap: 5
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
													color={(() => {
														const key = Object.entries(ProfessionalTypes).find(([_, value]) => value === professional.type)?.[0];
														return key ? professionalStyles[key as keyof typeof professionalStyles]?.text : '#FFFFFF';
													})()}
												/>
												<Box style={{ width: 4 }} />
												<BadgeText style={{ 
													color: (() => {
														const key = Object.entries(ProfessionalTypes).find(([_, value]) => value === professional.type)?.[0];
														return key ? professionalStyles[key as keyof typeof professionalStyles]?.text : '#FFFFFF';
													})()
												}}>{professional.type}</BadgeText>
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
										</VStack>
									</Box>
								</VStack>
							</HStack>
						</VStack>
					</Card>

					{/* Add Service Selection and Calendar after the compatibility section */}
					<Box className="mt-4 p-4 bg-white rounded-lg">
						<VStack space="md">
							<Heading size="sm">Book an Appointment</Heading>
							
							{/* Service Selection */}
							<Box>
								<Text size="xs" bold className="mb-2">Select Service</Text>
								<Select
									selectedValue={selectedService}
									onValueChange={setSelectedService}
									placeholder="Choose a service"
								>
									<SelectTrigger>
										<SelectInput />
										<SelectIcon>
											<ChevronDown size={20} />
										</SelectIcon>
									</SelectTrigger>
									<SelectPortal>
										<SelectBackdrop />
										<SelectContent>
											<SelectDragIndicatorWrapper>
												<SelectDragIndicator />
											</SelectDragIndicatorWrapper>
											{services.map((service) => (
												<SelectItem
													key={service.id}
													label={`${service.name} (${service.duration}min - €${service.price})`}
													value={service.id}
												/>
											))}
										</SelectContent>
									</SelectPortal>
								</Select>
							</Box>

							{/* Available Days and Time Slots */}
							<Box>
								<Text size="xs" bold className="mb-2">Available Time Slots</Text>
								<VStack space="md" style={{ maxHeight: 400 }}>
									{weekSlots.map((daySlot, dayIndex) => (
										<Box 
											key={dayIndex}
											style={[
												styles.dayContainer,
												isSameDay(daySlot.date, selectedDay) && {
													borderColor: getBadgeColor(professional.type),
													backgroundColor: 'rgba(0,0,0,0.02)'
												}
											]}
										>
											<Pressable
												onPress={() => setSelectedDay(daySlot.date)}
												style={styles.dayHeader}
											>
												<Text 
													size="sm" 
													bold
													style={{
														color: isSameDay(daySlot.date, selectedDay) 
															? getBadgeColor(professional.type)
															: '#333'
													}}
												>
													{formatDate(daySlot.date)}
												</Text>
											</Pressable>
											{isSameDay(daySlot.date, selectedDay) && (
												<Box style={styles.timeSlotsContainer}>
													<VStack space="xs">
														{daySlot.slots.map((slot, slotIndex) => (
															<Pressable
																key={slotIndex}
																onPress={() => slot.available && setSelectedTimeSlot(slot.time)}
																style={[
																	styles.timeSlotVertical,
																	{
																		backgroundColor: slot.available 
																			? selectedTimeSlot === slot.time 
																				? getBadgeColor(professional.type)
																			: '#fff'
																		: '#f5f5f5',
																		borderColor: slot.available 
																			? getBadgeColor(professional.type) 
																			: '#ddd'
																	}
																]}
																disabled={!slot.available}
															>
																<HStack space="xs" style={{ justifyContent: 'center' }}>
																	<Clock 
																		size={14} 
																		color={
																			selectedTimeSlot === slot.time 
																				? '#fff' 
																				: slot.available 
																					? getBadgeColor(professional.type)
																				: '#999'
																		} 
																	/>
																	<Text
																		size="sm"
																		style={{
																			color: selectedTimeSlot === slot.time 
																				? '#fff' 
																				: slot.available 
																					? getBadgeColor(professional.type)
																				: '#999'
																		}}
																	>
																		{slot.time}
																	</Text>
																</HStack>
															</Pressable>
														))}
													</VStack>
												</Box>
											)}
										</Box>
									))}
								</VStack>
							</Box>

							{/* Book Button */}
							{selectedService && selectedTimeSlot && (
								<Button
									size="md"
									variant="solid"
									style={{
										backgroundColor: getBadgeColor(professional.type),
										marginTop: 16
									}}
								>
									<ButtonText>Book Appointment</ButtonText>
								</Button>
							)}
						</VStack>
					</Box>
				</ScrollView>
			</Box>
		</Modal>
	);
};

// Custom Marker Component
const CustomMarker = ({
	professional,
	onPress,
}: {
	professional: any;
	onPress: () => void;
}) => {
	const getBadgeIcon = (type: string) => {
		const key = Object.entries(ProfessionalTypes).find(([_, value]) => value === type)?.[0];
		return key ? professionalStyles[key as keyof typeof professionalStyles]?.icon : BriefcaseMedicalIcon;
	};

	const IconComponent = getBadgeIcon(professional.type);

	return (
		<Marker 
			coordinate={{
				latitude: professional.coordinate.latitude,
				longitude: professional.coordinate.longitude
			}}
			onPress={onPress}
		>
			<Pressable
				style={styles.markerContainer}
			>
				<Icon as={IconComponent} size="md" />
				<Text style={styles.markerText}>{professional.name}</Text>
			</Pressable>
		</Marker>
	);
};

// Main App Component
export default function App() {
	const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
	const [expandedCards, setExpandedCards] = React.useState<Set<string>>(new Set());

	const initialRegion = {
		latitude: 43.6119,
		longitude: 3.8772,
		latitudeDelta: 0.0922,
		longitudeDelta: 0.0421,
	};

	const professionals = [
		{
			id: "1",
			name: "Marie Dubois",
			type: ProfessionalTypes.DIETETICIEN,
			coordinate: { latitude: 43.605, longitude: 3.8793 },
			location: "Montpellier, FR",
			distance: "2.5",
			bio: "Diététicienne spécialisée en rééquilibrage alimentaire et nutrition sportive",
			avatar: "https://randomuser.me/api/portraits/women/1.jpg",
			compatibility: 88,
		},
		{
			id: "2",
			name: "Sophie Martin",
			type: ProfessionalTypes.SOPHROLOGUE,
			coordinate: { latitude: 43.6119, longitude: 3.8772 },
			location: "Montpellier, FR",
			distance: "1.8",
			bio: "Sophrologue certifiée, spécialisée en gestion du stress et sommeil",
			avatar: "https://randomuser.me/api/portraits/women/2.jpg",
			compatibility: 92,
		},
		{
			id: "3",
			name: "Lucas Bernard",
			type: ProfessionalTypes.AROMATHERAPEUTE,
			coordinate: { latitude: 43.6152, longitude: 3.8823 },
			location: "Montpellier, FR",
			distance: "3.2",
			bio: "Aromathérapeute passionné par les huiles essentielles et le bien-être naturel",
			avatar: "https://randomuser.me/api/portraits/men/3.jpg",
			compatibility: 75,
		},
		{
			id: "4",
			name: "Emma Petit",
			type: ProfessionalTypes.NATUROPATHE,
			coordinate: { latitude: 43.6193, longitude: 3.8772 },
			location: "Montpellier, FR",
			distance: "4.1",
			bio: "Naturopathe holistique, spécialisée en nutrition et plantes médicinales",
			avatar: "https://randomuser.me/api/portraits/women/4.jpg",
			compatibility: 95,
		},
	];

	return (
		<View style={styles.container}>
			<MapView style={styles.map} initialRegion={initialRegion}>
				{professionals.map((professional) => (
					<CustomMarker
						key={professional.id}
						professional={professional}
						onPress={() => setSelectedProfessional(professional)}
					/>
				))}
			</MapView>
			{selectedProfessional && (
				<ProfessionalCard
					professional={selectedProfessional}
					isExpanded={expandedCards.has(selectedProfessional.id)}
					onToggle={(expanded) => {
						const newSet = new Set(expandedCards);
						if (expanded) {
							newSet.add(selectedProfessional.id);
						} else {
							newSet.delete(selectedProfessional.id);
						}
						setExpandedCards(newSet);
					}}
					onClose={() => setSelectedProfessional(null)}
				/>
			)}
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
	modalContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		backgroundColor: '#f5f5f5',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		padding: 16,
		maxHeight: '80%',
	},
	dayContainer: {
		borderWidth: 1,
		borderColor: '#ddd',
		borderRadius: 8,
		overflow: 'hidden',
	},
	dayHeader: {
		padding: 12,
		backgroundColor: '#fff',
		borderBottomWidth: 1,
		borderBottomColor: '#eee',
	},
	timeSlotsContainer: {
		padding: 12,
		backgroundColor: '#fff',
	},
	timeSlotVertical: {
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 8,
		borderWidth: 1,
		alignItems: 'center',
	},
});
