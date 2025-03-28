import {
	AlertDialog,
	AlertDialogBackdrop,
	AlertDialogBody,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Center } from "@/components/ui/center";
import {
	Checkbox,
	CheckboxGroup,
	CheckboxIcon,
	CheckboxIndicator,
	CheckboxLabel,
} from "@/components/ui/checkbox";
import {
	FormControl,
	FormControlHelper,
	FormControlHelperText,
	FormControlLabel,
	FormControlLabelText,
} from "@/components/ui/form-control";
import { Grid } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { VStack } from "@/components/ui/vstack";
import { useNavigation } from "@react-navigation/native";
import {
	CodeIcon,
	GlobeIcon,
	List,
	PinIcon,
	Square,
} from "lucide-react-native";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { useAtom } from 'jotai';
import { jwtAtom, jwtDecodedAtom } from '../../states/user';
import { sChats1V1Rooms } from "../../states/chat";

interface MessageItemProps {
	room: string;
}

import { Textarea, TextareaInput } from "@/components/ui/textarea";
const NewChatPopupSelect: React.FC<MessageItemProps> = ({ profile }) => {
	const [values, setValues] = React.useState(["bits"]);
	return (
		<>
			<FormControl>
				<FormControlLabel>
					<FormControlLabelText>
						Selectionner Vos Intentions
					</FormControlLabelText>
				</FormControlLabel>
				<CheckboxGroup
					className="my-2"
					value={values}
					onChange={(keys) => {
						setValues(keys);
					}}
				>
					<VStack space="sm">
						<Checkbox size="sm" value="bits">
							<CheckboxIndicator className="mr-2">
								<CheckboxIcon as={Square} />
							</CheckboxIndicator>
							<CheckboxLabel>Amical</CheckboxLabel>
						</Checkbox>
						<Checkbox size="sm" value="event">
							<CheckboxIndicator className="mr-2">
								<CheckboxIcon as={Square} />
							</CheckboxIndicator>
							<CheckboxLabel>Entraide</CheckboxLabel>
						</Checkbox>
						<Checkbox size="sm" value="sponsorship">
							<CheckboxIndicator className="mr-2">
								<CheckboxIcon as={Square} />
							</CheckboxIndicator>
							<CheckboxLabel>Flirt</CheckboxLabel>
						</Checkbox>
					</VStack>
				</CheckboxGroup>
				<FormControlHelper>
					<FormControlHelperText>
						Votre demande peut-être refusé
					</FormControlHelperText>
				</FormControlHelper>
			</FormControl>
			<FormControl>
				<FormControlLabel>
					<FormControlLabelText>Commentaire</FormControlLabelText>
				</FormControlLabel>
				<Textarea className="min-w-[200px] min-h-[400px] ">
					<TextareaInput placeholder="Laissez un message personnalisé qui donnera envie d'accepter votre requete" />
				</Textarea>
				<FormControlHelper>
					<FormControlHelperText></FormControlHelperText>
				</FormControlHelper>
			</FormControl>
		</>
	);
};

const NewChatPopup: React.FC<MessageItemProps> = ({ profile }) => {
	const [showAlertDialog, setShowAlertDialog] = React.useState(false);
	const handleClose = () => setShowAlertDialog(false);
	return (
		<>
			<Button onPress={() => setShowAlertDialog(true)}>
				<ButtonText>Parlons!</ButtonText>
			</Button>
			<AlertDialog
				isOpen={showAlertDialog}
				onClose={handleClose}
				size="md"
			>
				<AlertDialogBackdrop />
				<AlertDialogContent>
					<AlertDialogHeader>
						<Heading
							className="text-typography-950 font-semibold"
							size="md"
						>
							Précisez votre demande
						</Heading>
					</AlertDialogHeader>
					<AlertDialogBody className="mt-3 mb-4">
						<NewChatPopupSelect profile={profile} />
						{/* <Text size="sm">
							Deleting the post will remove it permanently and
							cannot be undone. Please confirm if you want to
							proceed.
						</Text> */}
					</AlertDialogBody>
					<AlertDialogFooter className="">
						<Button
							variant="outline"
							action="secondary"
							onPress={handleClose}
							size="sm"
						>
							<ButtonText>Envoyer</ButtonText>
						</Button>
						{/* <Button size="sm" onPress={handleClose}>
							<ButtonText>Delete</ButtonText>
						</Button> */}
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

const NewChat_ItemProfile: React.FC<MessageItemProps> = ({ profile }) => {
	console.log(profile);
	return (
		<Box className="justify-center w-full justify-center h-80">
			<Center>
				<VStack className="p-2" space="md" reversed={false}>
					<Card className="p-5 rounded-lg max-w-[360px] m-3">
						<Image
							source={{
								uri: profile.picture,
							}}
							style={{
								marginBottom: 24,
								height: 240,
								width: "100%",
								borderRadius: 8,
								aspectRatio: 4 / 3,
							}}
						/>
						<VStack className="mb-6">
							<Center>
								<Heading size="md" className="mb-2">
									{profile.name}
								</Heading>
								<Text size="sm">{profile.mantra.fr}</Text>
							</Center>
						</VStack>
						<Grid className="gap-2 mb-6">
							<Badge size="md" variant="solid" action="success">
								<BadgeIcon as={CodeIcon} className="ml-2" />
								<BadgeText className="ml-4">
									{profile.localization_code}
								</BadgeText>
							</Badge>
							<Badge size="md" variant="solid" action="warning">
								<BadgeIcon as={GlobeIcon} className="ml-2" />
								<BadgeText>
									{profile.localization_country}
								</BadgeText>
							</Badge>
							<Badge size="md" variant="solid" action="info">
								<BadgeIcon as={PinIcon} className="ml-2" />
								<BadgeText>{profile.distance} km</BadgeText>
							</Badge>
							<Badge size="md" variant="solid" action="error">
								<BadgeIcon as={List} className="ml-2" />
								<BadgeText>
									{profile.commonTheme} / 6 Thèmes
								</BadgeText>
							</Badge>
						</Grid>
						{/* <Text className="text-sm font-normal mb-2 text-typography-700">
							{profile.localization_code}{" "}
							{profile.localization_country}
						</Text> */}
						<Box className="flex-col sm:flex-row">
							<NewChatPopup profile={profile} />
							{/* <Button className="px-4 py-2 mr-0 mb-3 sm:mr-3 sm:mb-0 sm:flex-1">
								<ButtonText size="sm">Parlons!</ButtonText>
							</Button> */}
							{/* <Button
								variant="outline"
								className="px-4 py-2 border-outline-300 sm:flex-1"
							>
								<ButtonText
									size="sm"
									className="text-typography-600"
								>
									Wishlist
								</ButtonText>
							</Button> */}
						</Box>
					</Card>
				</VStack>
			</Center>
		</Box>
	);
};

const NewChat_Item: React.FC<MessageItemProps> = ({ item }) => {
	const navigation = useNavigation();
	const { room, usersInRoom, myUserId } = item;
	console.log(myUserId);
	console.log(room, usersInRoom);
	const goToChat = () => {
		navigation.navigate("ChatScreen", { room, usersInRoom });
	};
	return (
		<View style={styles2.messageContainer} onTouchEnd={goToChat}>
			<View style={styles2.messageContent}>
				<Image
					resizeMode="contain"
					source={{
						uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/d9e5323e3e31cdede93efcaa8bc9c2188f50e166bcf77987bf0ce0ce300bea47?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
					}}
					style={[
						styles2.avatar,
						// isThematic ? styles2.thematicAvatar : styles2.userAvatar,
					]}
				/>
				<View style={styles2.textContainer}>
					{/* <Text style={styles2.nameText}>
          {isThematic
            ? `Thematique : ${thematicType}`
            : isGroup
            ? `Groupe : ${name}`
            : name}
        </Text>
        <Text style={styles2.messageText}>
          {isThematic ? `${memberCount} membres` : message}
        </Text> */}
					<Text>{usersInRoom[0].userId2}</Text>
					<Text style={styles2.roomId}>room : {myUserId}</Text>
				</View>
			</View>
			{/* <Text style={styles2.timeText}>{time}</Text> */}
		</View>
	);
};
const NewChat: React.FC = () => {
	const [jwt] = useAtom(jwtAtom);
	const [jwtDecoded] = useAtom(jwtDecodedAtom);
	const [searchQuery, setSearchQuery] = React.useState("");
	const rooms1V1 = useRecoilValue(sChats1V1Rooms);
	const filteredRooms1V1 = rooms1V1.filter((msg) =>
		msg.room?.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const newChat = async () => {
		console.log(
			"go to matchmaking",
			searchQuery,
			jwtDecoded.ID.split(":")[1]
		);
		// console.log();
		// if (jwtDecoded && jwtDecoded.ID) {
		//   try {
		//     const data = await create1V1Chat(
		//       jwtDecoded.ID.split(":")[1],
		//       searchQuery,
		//       jwt
		//     );
		//     console.log("chat created supposed data here");
		//     console.log(data);
		//     if (data.chatId) {
		//       console.log("chatId", data.chatId);
		//       console.log(messages.length);
		//     }
		//     setSearchQuery("");
		//   } catch (error) {
		//     console.error("Error fetching more items:", error);
		//   }
		// } else {
		//   console.error("jwtDecoded or jwtDecoded.ID is null");
		// }
	};

	const profiles = [
		{
			id: "001",
			name: "Chloé",
			picture:
				"https://cms-sw.s3.fr-par.scw.cloud/public-picture-001.jpg",
			localization_code: "34070",
			localization_country: "France",
			distance: 0,
			commonTheme: 3,
			mantra: {
				sc: "Om Namah Shivaya",
				fr: "Je m'incline devant Shiva",
			},
		},
		{
			id: "002",
			name: "Joshua",
			picture:
				"https://cms-sw.s3.fr-par.scw.cloud/profile-picture-003.jpg",
			localization_code: "75008",
			localization_country: "France",
			distance: 658,
			commonTheme: 2,
			mantra: {
				sc: "Om Bhur Bhuvah Svah, Tat Savitur Varenyam, Bhargo Devasya Dhimahi, Dhiyo Yo Nah Prachodayat",
				fr: "Ô, Terre, Ciel et Au-delà, nous méditons sur l'éclat glorieux du Soleil divin, puisse-t-il stimuler notre intellect.",
			},
		},
		{
			id: "003",
			name: "Julie",
			picture:
				"https://cms-sw.s3.fr-par.scw.cloud/public-picture-002.jpg",
			localization_code: "44000",
			localization_country: "France",
			distance: 583,
			commonTheme: 5,
			mantra: {
				sc: "Om Mani Padme Hum",
				fr: "Ô, le joyau dans le lotus, hum",
			},
		},
		{
			id: "004",
			name: "Emilio",
			picture:
				"https://cms-sw.s3.fr-par.scw.cloud/profile-picture-004.jpg",
			localization_code: "33000",
			localization_country: "France",
			distance: 408,
			commonTheme: 4,
			mantra: {
				sc: "Lokah Samastah Sukhino Bhavantu",
				fr: "Puissent tous les êtres, dans tous les mondes, être heureux et libres",
			},
		},
	];
	// return (
	//   <View style={styles2.container}>
	//     <Text style={styles2.titleText}>{jwtDecoded.ID}</Text>

	//     <Select>
	//       <SelectTrigger variant="underlined" size="lg">
	//         <SelectInput placeholder="Thème #1" />
	//         {/* <SelectIcon className="mr-3" as={ChevronDownIcon} /> */}
	//       </SelectTrigger>
	//       <SelectPortal>
	//         <SelectBackdrop />
	//         <SelectContent>
	//           <SelectDragIndicatorWrapper>
	//             <SelectDragIndicator />
	//           </SelectDragIndicatorWrapper>
	//           <SelectItem label="UX Research" value="ux" />
	//           <SelectItem label="Web Development" value="web" />
	//           <SelectItem
	//             label="Cross Platform Development Process"
	//             value="Cross Platform Development Process"
	//           />
	//           <SelectItem label="UI Designing" value="ui" isDisabled={true} />
	//           <SelectItem label="Backend Development" value="backend" />
	//         </SelectContent>
	//       </SelectPortal>
	//     </Select>

	//     <Select>
	//       <SelectTrigger variant="underlined" size="lg">
	//         <SelectInput placeholder="Thème #2" />
	//         {/* <SelectIcon className="mr-3" as={ChevronDownIcon} /> */}
	//       </SelectTrigger>
	//       <SelectPortal>
	//         <SelectBackdrop />
	//         <SelectContent>
	//           <SelectDragIndicatorWrapper>
	//             <SelectDragIndicator />
	//           </SelectDragIndicatorWrapper>
	//           <SelectItem label="UX Research" value="ux" />
	//           <SelectItem label="Web Development" value="web" />
	//           <SelectItem
	//             label="Cross Platform Development Process"
	//             value="Cross Platform Development Process"
	//           />
	//           <SelectItem label="UI Designing" value="ui" isDisabled={true} />
	//           <SelectItem label="Backend Development" value="backend" />
	//         </SelectContent>
	//       </SelectPortal>
	//     </Select>

	//     <Select>
	//       <SelectTrigger variant="underlined" size="lg">
	//         <SelectInput placeholder="Thème #3" />
	//         {/* <SelectIcon className="mr-3" as={ChevronDownIcon} /> */}
	//       </SelectTrigger>
	//       <SelectPortal>
	//         <SelectBackdrop />
	//         <SelectContent>
	//           <SelectDragIndicatorWrapper>
	//             <SelectDragIndicator />
	//           </SelectDragIndicatorWrapper>
	//           <SelectItem label="UX Research" value="ux" />
	//           <SelectItem label="Web Development" value="web" />
	//           <SelectItem
	//             label="Cross Platform Development Process"
	//             value="Cross Platform Development Process"
	//           />
	//           <SelectItem label="UI Designing" value="ui" isDisabled={true} />
	//           <SelectItem label="Backend Development" value="backend" />
	//         </SelectContent>
	//       </SelectPortal>
	//     </Select>

	//     <Input
	//       variant="outline"
	//       size="md"
	//       isDisabled={false}
	//       isInvalid={false}
	//       isReadOnly={false}
	//     >
	//       <InputField placeholder="Enter Text here..." />
	//     </Input>
	//     {/* <View style={styles2.header}></View>
	//     {/* <View style={styles2.searchContainer}></View> */}
	//     {/* <TextInput
	//       style={styles2.searchInput}
	//       placeholder="Rechercher un contact"
	//       placeholderTextColor="rgba(145, 145, 145, 1)"
	//       accessibilityLabel="Search contacts input field"
	//       value={searchQuery}
	//       onChangeText={setSearchQuery}
	//     /> */}
	//     {/*
	//     <ScrollView style={styles2.messagesList}>
	//       {filteredRooms1V1.map((item, index) => (
	//         <NewChat_Item
	//           key={index}
	//           item={{ ...item, myUserId: jwtDecoded.ID.split(":")[1] }}
	//         />
	//       ))}
	//     </ScrollView> */}
	//     {/* <Button onPress={newChat}>+ Nouvelle Conversation</Button> */}
	//     {/* <FlatGrid
	//       itemDimension={210}
	//       data={[1, 2, 3]}
	//       renderItem={({ item }) => (
	//         <>
	//           {item === 1 && (
	//               <>
	//                   {console.log("item", item)}
	//               </>
	//           )}
	//         </>
	//       )}
	//     /> */}
	//   </View>
	// );

	return (
		<ScrollView>
			{profiles.map((profile: string) => (
				<NewChat_ItemProfile key={profile.id} profile={profile} />
			))}
		</ScrollView>
	);
};

const styles2 = StyleSheet.create({
	container: {
		flex: 1,
		marginHorizontal: "auto",
		maxWidth: 480,
		padding: 10,
	},
	header: {
		marginBottom: 24,
	},
	titleText: {
		fontSize: 20,
		color: "#000",
	},
	searchContainer: {
		flexDirection: "row",
		alignItems: "center",
		borderColor: "#CDCDCD",
		borderWidth: 1,
		borderRadius: 5,
		padding: 12,
		marginTop: 16,
	},
	searchIcon: {
		width: 20,
		height: 20,
		marginRight: 10,
	},
	searchInput: {
		flex: 1,
		fontSize: 14,
		maxHeight: 40,
		color: "#919191",
	},
	messagesList: {
		marginTop: 24,
	},
	messageContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 24,
	},
	messageContent: {
		flexDirection: "row",
		alignItems: "center",
	},
	avatar: {
		width: 40,
		height: 40,
		marginRight: 12,
	},
	userAvatar: {
		borderRadius: 20,
	},
	thematicAvatar: {
		borderRadius: 4,
	},
	textContainer: {
		flex: 1,
	},
	nameText: {
		fontSize: 14,
		color: "#000",
	},
	messageText: {
		fontSize: 12,
		color: "#919191",
	},
	timeText: {
		fontSize: 12,
		color: "#919191",
	},
	roomId: {
		fontSize: 10,
		color: "#3660da",
	},
});

export default NewChat;
