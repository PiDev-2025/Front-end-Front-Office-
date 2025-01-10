import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { FormControl } from "@/components/ui/form-control";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Input, InputField } from "@/components/ui/input";
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
import React from "react";
import { Text } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useRecoilState } from "recoil";
import { getThemes } from "./apis/Theme";
import {
	ageState,
	jwtDecodedState,
	jwtState,
	localizationState,
	picturesState,
	sexState,
	themesSelectedStates,
	themesStates,
} from "./states/user";
const UserProfileThemes: React.FC = () => {
	const [jwt, setJwt] = useRecoilState(jwtState);
	const [themes, setThemes] = useRecoilState(themesStates);
	const [themesSelected, setThemesSelected] =
		useRecoilState(themesSelectedStates);
	console.log("themesSelected", themesSelected);
	const getThemesFromApi = async () => {
		const themesFromApi = await getThemes(jwt.jwt);
		themesFromApi.sort((a: any, b: any) =>
			a.name.localeCompare(b.name)
		);
		setThemes(themesFromApi.filter((theme: any) => !theme.parent));
		console.log(themes);
	};

	React.useEffect(() => {
		getThemesFromApi();
	}, []);
	return (
		<>
			<Center className="bg-primary-500 h-[200px] w-[300px]">
				<Text className="text-typography-0 font-bold">
					Thématiques Selectionnées
				</Text>
			</Center>
			<FormControl className="p-4 border border-outline-300">
				<VStack space="xl">
					{themesSelected?.map((theme, index) => (
						<VStack space="md" key={index}>
							<Select
								onValueChange={(value) =>
									setThemesSelected(
										(prev) =>
											prev.map(
												(
													t,
													i
												) =>
													i ===
													index
														? value
														: t
											)
									)
								}
							>
								<SelectTrigger
									variant="underlined"
									size="lg"
								>
									<SelectInput
										placeholder={`Thème #${
											index + 1
										}`}
										value={theme}
									/>
									{/* <SelectIcon className="mr-3" as={ChevronDownIcon} /> */}
								</SelectTrigger>
								<SelectPortal>
									<SelectBackdrop />
									<SelectScrollView>
										<SelectContent>
											<SelectDragIndicatorWrapper>
												<SelectDragIndicator />
											</SelectDragIndicatorWrapper>
											{themes.length >
												0 &&
												themes.map(
													(
														theme: any
													) => (
														<SelectItem
															key={
																theme.id
															}
															label={
																theme.name
															}
															value={
																theme.name
															}
														/>
													)
												)}
										</SelectContent>
									</SelectScrollView>
								</SelectPortal>
							</Select>
						</VStack>
					))}
				</VStack>
			</FormControl>
		</>
	);
};

const UserProfileInformations: React.FC = () => {
	const [age, setAge] = useRecoilState(ageState);
	const [sex, setSex] = useRecoilState(sexState);
	const [localization, setLocalization] = useRecoilState(localizationState);
	return (
		<>
			<Center className="bg-primary-500 h-[200px] w-[300px]">
				<Text className="text-typography-0 font-bold">
					Informations Personelle
				</Text>
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
									<RadioLabel>
										Homme
									</RadioLabel>
								</Radio>
								<Radio value="Femme">
									<RadioIndicator>
										{/* <XCircle /> */}
										{/* <RadioIcon as={CircleIcon} /> */}
									</RadioIndicator>
									<RadioLabel>
										Femme
									</RadioLabel>
								</Radio>
								<Radio value="Autre">
									<RadioIndicator>
										{/* <XCircle /> */}
										{/* <RadioIcon as={CircleIcon} /> */}
									</RadioIndicator>
									<RadioLabel>
										Autre
									</RadioLabel>
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
										value={
											localization.code ||
											""
										}
										onChangeText={(
											text
										) =>
											setLocalization(
												{
													...localization,
													code: text,
												}
											)
										}
									/>
								</Input>
							</Box>
							<Box className="w-1/2">
								<Text className="text-typography-500">
									Pays
								</Text>
								<Input className="text-center">
									<InputField
										value={
											localization.country ||
											""
										}
										onChangeText={(
											text
										) =>
											setLocalization(
												{
													...localization,
													country: text,
												}
											)
										}
									/>
								</Input>
							</Box>
						</HStack>
					</VStack>
					<VStack space="xs">
						<Text className="text-typography-500">
							Age
						</Text>
						<Input className="text-center">
							<InputField
								value={age || ""}
								onChangeText={(text) =>
									setAge(text)
								}
							/>
						</Input>
					</VStack>
				</VStack>
			</FormControl>
		</>
	);
};

const UserProfilePictures: React.FC = () => {
	const [pictures, setPictures] = useRecoilState(picturesState);
	const chooseImage = async () => {
		console.log("chooseImage");
		const result = await launchImageLibrary({
			mediaType: "photo",
			includeBase64: false,
			maxHeight: 200,
			maxWidth: 200,
		});

		if (!result.didCancel && !result.errorCode) {
			setPictures({ private: result.assets[0].uri });
		}
	};
	return (
		<>
			<Center className="bg-primary-500 h-[200px] w-[300px]">
				<Text className="text-typography-0 font-bold">
					Photos Publique & Privée
				</Text>
			</Center>
			<FormControl className="p-4 border border-outline-300">
				<HStack space="md" className="justify-center">
					<Center className="flex-1">
						<Image
							size="xl"
							source={{
								uri: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
							}}
							alt="image"
						/>
					</Center>
					<Center className="flex-1">
						<Image
							size="xl"
							source={{
								uri: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
							}}
							alt="image"
						/>
					</Center>
				</HStack>
				<Button onPress={chooseImage}>Choose Image</Button>
			</FormControl>
		</>
	);
};

const UserProfileScreen: React.FC = () => {
	const [jwt, setJwt] = useRecoilState(jwtState);
	const [jwtDecoded, setJwtDecoded] = useRecoilState(jwtDecodedState);

	return (
		<Box className="justify-center h-full">
			<VStack space="lg" className="p-4">
				<Center className="bg-primary-500">
					<Text className="text-typography-0 font-bold">
						{jwtDecoded.ID}
					</Text>
				</Center>
				<UserProfilePictures />
				<UserProfileThemes />
				<UserProfileInformations />
			</VStack>
		</Box>
	);
};

export default UserProfileScreen;
