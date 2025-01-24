import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { FormControl } from "@/components/ui/form-control";
import { Grid, GridItem } from "@/components/ui/grid";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Input, InputField } from "@/components/ui/input";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Pressable } from "@/components/ui/pressable";
import {
	Radio,
	RadioGroup,
	RadioIndicator,
	RadioLabel,
} from "@/components/ui/radio";
import {
	Select,
	SelectBackdrop,
	SelectContent,
	SelectDragIndicator,
	SelectDragIndicatorWrapper,
	SelectInput,
	SelectItem,
	SelectPortal,
	SelectScrollView,
	SelectTrigger,
} from "@/components/ui/select";
import { VStack } from "@/components/ui/vstack";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { ScrollView, Text } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

import { userSaveProfile } from "./apis/User";
import {
	ageAtom,
	fetchUserInformationAtom,
	jwtAtom,
	localizationAtom,
	sexAtom,
	themesAtom,
	themesSelectedAtoms,
	userIDAtom,
} from "./states/user";
interface UserProfileThemeParentProps {
	theme: any;
	index: number;
}
const UserProfileThemeChild: React.FC<
	UserProfileThemeParentProps & {
		themes: any;
		themesSelected: any;
		setThemesSelected: any;
	}
> = ({ theme, index, themes, themesSelected, setThemesSelected }) => {
	const getSubThemes = (parent: any) => {
		const _parent = themes.parents.filter((p: any) => p.name === parent);
		const parentId = _parent[0].id;
		return themes.childs.filter((child: any) => child.parent === parentId);
	};

	return (
		<Grid
			className="gap-3"
			_extra={{ className: "grid-cols-5 grid-rows-2" }}
		>
			<GridItem
				className="p-3 rounded-md text-center"
				_extra={{ className: "col-span-1" }}
			>
				<Center>
					<Text className="text-typography-500">Spé</Text>
				</Center>
			</GridItem>
			<GridItem
				className="bg-background-50 rounded-md text-center"
				_extra={{ className: "col-span-4" }}
			>
				<Select
					onValueChange={(value) =>
						setThemesSelected((prev: any) =>
							prev.map((item: any, i: number) =>
								i === index
									? {
											...item,
											subTheme: {
												name: value,
												id: themes.childs.filter(
													(c: any) => c.name === value
												)[0].id,
											},
									  }
									: item
							)
						)
					}
				>
					<SelectTrigger variant="underlined" size="lg">
						<SelectInput
							placeholder={`Sous-Thème #${index + 1}`}
							value={theme.subTheme.name}
						/>
					</SelectTrigger>
					<SelectPortal className="z-50">
						<SelectBackdrop />
						<SelectScrollView style={{ zIndex: 999 }}>
							<SelectContent style={{ zIndex: 1000 }}>
								<SelectDragIndicatorWrapper>
									<SelectDragIndicator />
								</SelectDragIndicatorWrapper>
								{theme.theme.name &&
									getSubThemes(theme.theme.name).map(
										(theme: any) => (
											<SelectItem
												key={theme.id}
												label={theme.name}
												value={theme.name}
											/>
										)
									)}
							</SelectContent>
						</SelectScrollView>
					</SelectPortal>
				</Select>
			</GridItem>
		</Grid>
	);
};

const UserProfileThemeParent: React.FC<
	UserProfileThemeParentProps & {
		themes: any;
		themesSelected: any;
		setThemesSelected: any;
	}
> = ({ theme, index, themes, themesSelected, setThemesSelected }) => {
	return (
		<Grid
			className="gap-3"
			_extra={{ className: "grid-cols-5 grid-rows-2" }}
		>
			<GridItem
				className="p-3 rounded-md text-center"
				_extra={{ className: "col-span-1" }}
			>
				<Center>
					<Text className="text-typography-500">Gen</Text>
				</Center>
			</GridItem>
			<GridItem
				className="bg-background-50 rounded-md text-center"
				_extra={{ className: "col-span-4" }}
			>
				<Select
					onValueChange={(value) =>
						setThemesSelected((prev: any) =>
							prev.map((item: any, i: number) =>
								i === index
									? {
											...item,
											theme: {
												name: value,
												id: themes.parents.filter(
													(p: any) => p.name === value
												)[0].id,
											},
									  }
									: item
							)
						)
					}
				>
					<SelectTrigger variant="underlined" size="lg">
						<SelectInput
							placeholder={`Thème Générique #${index + 1}`}
							value={theme.theme.name}
						/>
					</SelectTrigger>
					<SelectPortal>
						<SelectBackdrop />
						<SelectScrollView style={{ zIndex: 999 }}>
							<SelectContent style={{ zIndex: 1000 }}>
								<SelectDragIndicatorWrapper>
									<SelectDragIndicator />
								</SelectDragIndicatorWrapper>
								{themes.parents.map((theme: any) => (
									<SelectItem
										key={theme.id}
										label={theme.name}
										value={theme.name}
									/>
								))}
							</SelectContent>
						</SelectScrollView>
					</SelectPortal>
				</Select>
			</GridItem>
		</Grid>
	);
};
const UserProfileThemes: React.FC<
	UserProfileThemeParentProps & {
		themes: any;
		themesSelected: any;
		setThemesSelected: any;
		setThemes: any;
		jwt: string;
	}
> = ({ theme, index, jwt }) => {
	const [themes, setThemes] = useAtom(themesAtom);
	const [themesSelected, setThemesSelected] = useAtom(themesSelectedAtoms);

	useEffect(() => {
		if (jwt) {
			setThemes(jwt); // This will trigger the fetch
		}
	}, [jwt, setThemes]);

	return (
		<>
			<Center className="bg-primary-500 h-[200px] w-[300px]">
				<LinearGradient
					className="w-full items-center py-2"
					colors={["#FFFFFF", "#CFF1EB"]}
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 0 }}
				>
					<Text className="text-typography-sw font-bold">
						Thématiques Sélectionnées
					</Text>
				</LinearGradient>
			</Center>
			<FormControl className="p-4 border border-outline-300">
				<VStack space="xl">
					{themes &&
						themes.parents &&
						themes.childs &&
						themesSelected?.map((theme, index) => (
							<VStack space="xl" key={index}>
								<UserProfileThemeParent
									theme={theme}
									index={index}
									themes={themes}
									themesSelected={themesSelected}
									setThemesSelected={setThemesSelected}
								/>
								<UserProfileThemeChild
									theme={theme}
									index={index}
									themes={themes}
									themesSelected={themesSelected}
									setThemesSelected={setThemesSelected}
								/>
							</VStack>
						))}
				</VStack>
			</FormControl>
		</>
	);
};
const UserProfileInformations: React.FC = () => {
	const [sex, setSex] = useAtom(sexAtom);
	const [age, setAge] = useAtom(ageAtom);
	const [localization, setLocalization] = useAtom(localizationAtom);
	console.log("UserProfileInformations", sex, age, localization);
	return (
		<>
			<Center className="bg-primary-500 h-[200px] w-[300px]">
				<LinearGradient
					className="w-full items-center py-2"
					colors={["#FFFFFF", "#CFF1EB"]}
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 0 }}
				>
					<Text className="text-typography-sw font-bold">
						Informations Personelle
					</Text>
				</LinearGradient>
			</Center>
			<FormControl className="p-2 border border-outline-300">
				<VStack space="xl">
					<VStack space="md">
						<RadioGroup value={sex} onChange={setSex}>
							<HStack space="2xl">
								<Radio value="Homme">
									<RadioIndicator />
									<RadioLabel>Homme</RadioLabel>
								</Radio>
								<Radio value="Femme">
									<RadioIndicator />
									<RadioLabel>Femme</RadioLabel>
								</Radio>
								<Radio value="Autre">
									<RadioIndicator />
									<RadioLabel>Autre</RadioLabel>
								</Radio>
							</HStack>
						</RadioGroup>
					</VStack>
					<VStack space="xl">
						<HStack space="xl">
							<Box className="w-1/4">
								<Text className="text-typography-500 color-tertiary-500">
									Code
								</Text>
								<Input className="text-center bg-tertiary-500">
									<InputField
										value={String(localization.code)}
										onChangeText={(text) =>
											setLocalization({
												...localization,
												code: text,
											})
										}
									/>
								</Input>
							</Box>
							<Box className="w-3/4">
								<Text className="text-typography-500">
									Pays
								</Text>
								<Input className="text-center">
									<InputField
										value={localization.country}
										onChangeText={(text) =>
											setLocalization({
												...localization,
												country: String(text),
											})
										}
									/>
								</Input>
							</Box>
						</HStack>
					</VStack>
					<VStack space="xs">
						<Text className="text-typography-500">Age</Text>
						<Input className="text-center">
							<InputField
								value={age || ""}
								onChangeText={(text) => setAge(text)}
							/>
						</Input>
					</VStack>
				</VStack>
			</FormControl>
		</>
	);
};
const UserProfilePictures: React.FC<{
	pictures: any;
	setPictures: any;
}> = ({ pictures, setPictures }) => {
	const chooseImage = async (privacyType: string) => {
		console.log("chooseImage");
		const result = await launchImageLibrary({
			mediaType: "photo",
			includeBase64: false,
			maxHeight: 200,
			maxWidth: 200,
		});

		if (!result.didCancel && !result.errorCode) {
			console.log(result.assets[0].uri);
			if (privacyType === "public") {
				setPictures((prev: any) => ({
					...prev,
					public: result.assets[0].uri,
				}));
			} else if (privacyType === "private") {
				setPictures((prev: any) => ({
					...prev,
					private: result.assets[0].uri,
				}));
			}
		}
		console.log(pictures);
	};
	return (
		<>
			<Center className="bg-primary-500 h-[200px] w-[300px]">
				<LinearGradient
					className="w-full items-center py-2"
					colors={["#FFFFFF", "#CFF1EB"]}
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 0 }}
				>
					<Text className="text-typography-sw font-bold">
						Photos Publique & Privée
					</Text>
				</LinearGradient>
			</Center>
			<FormControl className="p-4 border border-outline-300">
				<HStack space="md" className="justify-center">
					<Center className="flex-1">
						<Pressable onPress={() => chooseImage("public")}>
							<Image
								size="xl"
								source={{
									uri: pictures.public,
								}}
								alt="image"
							/>
						</Pressable>
					</Center>
					<Center className="flex-1">
						<Pressable onPress={() => chooseImage("private")}>
							<Image
								size="xl"
								source={{
									uri: pictures.private,
								}}
								alt="image"
							/>
						</Pressable>
					</Center>
				</HStack>
			</FormControl>
		</>
	);
};

const UserProfileName: React.FC<{
	username: string;
}> = ({ username }) => {
	return (
		<Center className="bg-primary-500 h-[200px] w-[300px]">
			<LinearGradient
				className="w-full items-center py-2"
				colors={["#FFFFFF", "#CFF1EB"]}
				start={{ x: 0, y: 1 }}
				end={{ x: 1, y: 0 }}
			>
				{username && (
					<Text className="text-typography-sw font-bold">
						{username}
					</Text>
				)}
			</LinearGradient>
		</Center>
	);
};

const UserProfileScreen: React.FC = () => {
	const [jwt, setJwt] = useAtom(jwtAtom);
	const [userId] = useAtom(userIDAtom);
	const [age, setAge] = useAtom(ageAtom);
	const [sex, setSex] = useAtom(sexAtom);
	const [localization, setLocalization] = useAtom(localizationAtom);
	const [userInformation, setUserInformation] = useAtom(
		fetchUserInformationAtom
	);
	// console.log("userInformation", userInformation);
	useEffect(() => {
		if (jwt && userId) {
			console.log("useEffect", jwt, userId);
			setUserInformation();
			if (userInformation.age) {
				setAge(userInformation.age);
			}
			if (userInformation.sex) {
				setSex(userInformation.sex);
			}
			if (
				userInformation.localization_code &&
				userInformation.localization_country
			) {
				setLocalization({
					code: String(userInformation.localization_code),
					country: userInformation.localization_country,
				});
			}
			// if ()
			// setUserInformation({ jwt, userID: userID.split(":")[1] });
		}
	}, [jwt, userId, setUserInformation]);

	return (
		<LinearGradient
			className="w-full items-center py-2 h-full "
			colors={["#E1E2E3", "#CFF1EB"]}
			start={{ x: 0, y: 1 }}
			end={{ x: 1, y: 0 }}
		>
			<ScrollView className="w-full h-full ">
				<Box className="justify-center h-full">
					<VStack space="lg" className="" id="user-profile">
						{userInformation.username && (
							<UserProfileName
								username={userInformation.username}
							/>
						)}
						<UserProfileInformations
							age={age}
							setAge={setAge}
							sex={sex}
							setSex={setSex}
							localization={localization}
							setLocalization={setLocalization}
						/>
						{/* <UserProfilePictures
								pictures={pictures}
								setPictures={setPictures}
							/>
							<UserProfileThemes />*/}
					</VStack>

					<Button
						// mode="contained"
						onPress={async () => {
							await userSaveProfile();
						}}
					>
						<ButtonText>Enregistrerr</ButtonText>
					</Button>
				</Box>
			</ScrollView>
		</LinearGradient>
	);
};

export default UserProfileScreen;
