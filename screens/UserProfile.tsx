import { Box } from "@/components/ui/box";
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
import { Button } from "react-native-paper";
import { userSaveProfile } from "./apis/User";
import {
	ageAtom,
	fetchThemesAtom,
	fetchUserInformationAtom,
	jwtAtom,
	jwtDecodedAtom,
	localizationAtom,
	picturesAtom,
	sexAtom,
	themesAtom,
	themesSelectedAtoms,
} from "./states/user";
interface UserProfileThemeParentProps {
	theme: any;
	index: number;
}

const UserProfileThemeChild: React.FC<UserProfileThemeParentProps> = ({
	theme,
	index,
}) => {
	const [themes, setThemes] = useAtom(themesAtom);
	const [themesSelected, setThemesSelected] = useAtom(themesSelectedAtoms);
	console.log(themes, themesSelected);
	// React.useEffect(() => {
	// 	const fetchThemes = async () => {
	// 		const themesFromApi = await getThemes(jwt);
	// 		setThemes({
	// 			parents: themesFromApi.parents,
	// 			childs: themesFromApi.childs,
	// 		});
	// 	};

	// 	fetchThemes();
	// }, [jwt]);
	const getSubThemes = (parent: any) => {
		console.log("getSubThemes:parent", parent);
		const _parent = themes.parents.filter((p: any) => p.name === parent);
		const parentId = _parent[0].id;
		console.log("getSubThemes", parent, _parent, parentId);
		return themes.childs.filter((child: any) => child.parent === parentId);
		// return [];
	};
	return (
		<Grid
			className="gap-3"
			_extra={{
				className: "grid-cols-5 grid-rows-2",
			}}
		>
			<GridItem
				className=" p-3 rounded-md text-center"
				_extra={{
					className: "col-span-1",
				}}
			>
				<Center className="">
					<Text className="text-typography-500">Spé</Text>
				</Center>
			</GridItem>
			<GridItem
				className="bg-background-50 rounded-md text-center"
				_extra={{
					className: "col-span-4",
				}}
			>
				<Select
					onValueChange={(value) =>
						setThemesSelected((prev) =>
							prev.map((item, i) =>
								i === index
									? {
											...item,
											subTheme: {
												name: value,
												id: themes.childs.filter(
													(c) => c.name === value
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
						{/* <SelectIcon className="mr-3" as={ChevronDownIcon} /> */}
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

const UserProfileThemeParent: React.FC<UserProfileThemeParentProps> = ({
	theme,
	index,
}) => {
	const [themes, setThemes] = useAtom(themesAtom);
	const [themesSelected, setThemesSelected] = useAtom(themesSelectedAtoms);
	return (
		<Grid
			className="gap-3"
			_extra={{
				className: "grid-cols-5 grid-rows-2",
			}}
		>
			<GridItem
				className=" p-3 rounded-md text-center"
				_extra={{
					className: "col-span-1",
				}}
			>
				<Center className="">
					<Text className="text-typography-500">Gen</Text>
				</Center>
			</GridItem>
			<GridItem
				className="bg-background-50 rounded-md text-center"
				_extra={{
					className: "col-span-4",
				}}
			>
				<Select
					// className="absolute bottom-0"
					onValueChange={(value) =>
						setThemesSelected((prev) =>
							prev.map((item, i) =>
								i === index
									? {
											...item,
											theme: {
												name: value,
												id: themes.parents.filter(
													(p) => p.name === value
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
							className="flex-1"
						/>
						{/* <SelectIcon className="mr-3" as={ChevronDownIcon} /> */}
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

const UserProfileThemes: React.FC = () => {
	const [jwt, setJwt] = useAtom(jwtAtom);
	const [jwtDecoded, setJwtDecoded] = useAtom(jwtDecodedAtom);
	const [themes, setThemes] = useAtom(fetchThemesAtom);
	const [themesSelected, setThemesSelected] = useAtom(themesSelectedAtoms);
	// console.log("UserProfileThemes", jwt, themes, themesSelected);
	// const getThemesFromApi = async (token: string) => {
	// 	const themesFromApi = await getThemes(token);
	// 	setThemes({
	// 		parents: themesFromApi.parents,
	// 		childs: themesFromApi.childs,
	// 	});
	// };
	// (async () => {
	// 	await getThemesFromApi(jwt);
	// })();
	// React.useEffect(() => {
	// 	console.log("getThemesFromApi >");
	// 	(async () => {
	// 		await getThemesFromApi(jwt);
	// 	})();
	// 	console.log("getThemesFromApi <");
	// }, [jwt]);
	useEffect(() => {
		if (jwt) {
			setThemes(); // This will trigger the fetch
		}
	}, [jwt, setThemes]);
	// console.log("UserProfileThemes", themes, themesSelected);
	return (
		<>
			<Center className="bg-primary-500 h-[200px] w-[300px]">
				<LinearGradient
					className="w-full items-center py-2"
					colors={["#FFFFFF", "#CFF1EB"]}
					start={{ x: 0, y: 1 }}
					end={{ x: 1, y: 0 }}
				>
					<Text className="text-typography-sw font-borld">
						Thématiques Selectionnées
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
								/>
								<UserProfileThemeChild
									theme={theme}
									index={index}
								/>
							</VStack>
						))}
				</VStack>
			</FormControl>
		</>
	);
};

const UserProfileInformations: React.FC = () => {
	const [age, setAge] = useAtom(ageAtom);
	const [sex, setSex] = useAtom(sexAtom);
	const [localization, setLocalization] = useAtom(localizationAtom);
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
									<RadioIndicator>
										{/* <XCircle /> */}
										{/* <RadioIcon as={CircleIcon} /> */}
									</RadioIndicator>
									<RadioLabel>Homme</RadioLabel>
								</Radio>
								<Radio value="Femme">
									<RadioIndicator>
										{/* <XCircle /> */}
										{/* <RadioIcon as={CircleIcon} /> */}
									</RadioIndicator>
									<RadioLabel>Femme</RadioLabel>
								</Radio>
								<Radio value="Autre">
									<RadioIndicator>
										{/* <XCircle /> */}
										{/* <RadioIcon as={CircleIcon} /> */}
									</RadioIndicator>
									<RadioLabel>Autre</RadioLabel>
								</Radio>
							</HStack>
						</RadioGroup>
					</VStack>
					<VStack space="xl">
						<HStack space="xl" className="">
							<Box className="w-1/4">
								<Text className="text-typography-500">
									Code Postal
								</Text>
								<Input className="text-center">
									<InputField
										value={localization.code || ""}
										onChangeText={(text) =>
											setLocalization({
												...localization,
												code: text,
											})
										}
									/>
								</Input>
							</Box>
							<Box className="w-1/2">
								<Text className="text-typography-500">
									Pays
								</Text>
								<Input classNameqsd="text-center">
									<InputField
										value={localization.country || ""}
										onChangeText={(text) =>
											setLocalization({
												...localization,
												country: text,
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

const UserProfilePictures: React.FC = () => {
	const [pictures, setPictures] = useAtom(picturesAtom);
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
				setPictures((prev) => ({
					...prev,
					public: result.assets[0].uri,
				}));
			} else if (privacyType === "private") {
				setPictures((prev) => ({
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

const UserProfileScreen: React.FC = () => {
	const [jwt, setJwt] = useAtom(jwtAtom);
	const [jwtDecoded, setJwtDecoded] = useAtom(jwtDecodedAtom);
	// ---
	// const [userData, setUserData] = useAtom(userDataAtom);
	// console.log("userData", userData);
	const [age, setAge] = useAtom(ageAtom);
	const [sex, setSex] = useAtom(sexAtom);
	const [localization, setLocalization] = useAtom(localizationAtom);
	const [pictures, setPictures] = useAtom(picturesAtom);
	const [themes, setThemes] = useAtom(themesAtom);
	const [themesSelected, setThemesSelected] = useAtom(themesSelectedAtoms);

	const [userInformation, setUserInformation] = useAtom(
		fetchUserInformationAtom
	);
	useEffect(() => {
		if (jwt) {
			setUserInformation(); // This will trigger the fetch
		}
	}, [jwt, setUserInformation]);

	return (
		<ScrollView>
			<Box className="justify-center h-full">
				<VStack space="lg" className="p-4" id="user-profile">
					<Center className="bg-primary-500 h-[200px] w-[300px]">
						<LinearGradient
							className="w-full items-center py-2"
							colors={["#FFFFFF", "#CFF1EB"]}
							start={{ x: 0, y: 1 }}
							end={{ x: 1, y: 0 }}
						>
							<Text className="text-typography-sw font-bold">
								{/* {jwtDecoded.ID} */}
								*username
							</Text>
						</LinearGradient>
					</Center>
					<UserProfilePictures />
					<UserProfileThemes />
					<UserProfileInformations />
				</VStack>
				<Button
					mode="contained"
					onPress={async () => {
						await userSaveProfile(
							{
								age,
								sex,
								localization,
								pictures,
								themes,
								themesSelected,
							},
							jwtDecoded.ID,
							jwt
						);
					}}
				>
					Enregistrer
				</Button>
			</Box>
		</ScrollView>
	);
};

export default UserProfileScreen;
