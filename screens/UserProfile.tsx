import { Box } from "@/components/ui/box";
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
  SelectTrigger,
} from "@/components/ui/select";
import { VStack } from "@/components/ui/vstack";
import React from "react";
import { ScrollView, Text } from "react-native";
import { useRecoilState } from "recoil";
import {
  ageState,
  jwtDecodedState,
  jwtState,
  localizationState,
  picturesState,
  sexState,
} from "./states/user";

const UserProfileScreen: React.FC = () => {
  const [jwt, setJwt] = useRecoilState(jwtState);
  const [jwtDecoded, setJwtDecoded] = useRecoilState(jwtDecodedState);
  const [age, setAge] = useRecoilState(ageState);
  const [sex, setSex] = useRecoilState(sexState);
  const [localization, setLocalization] = useRecoilState(localizationState);
  const [pictures, setPictures] = useRecoilState(picturesState);

  return (
    <>
      <ScrollView>
        <Box className="justify-center h-full ">
          <Center className="bg-primary-500 h-[200px] w-[300px]">
            <Text className="text-typography-0 font-bold">
              Thématiques Selectionnées
            </Text>
          </Center>
          <FormControl className="p-4 border border-outline-300">
            <VStack space="xl">
              <VStack space="md">
                <Select>
                  <SelectTrigger variant="underlined" size="lg">
                    <SelectInput placeholder="Thème #1" />
                    {/* <SelectIcon className="mr-3" as={ChevronDownIcon} /> */}
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label="UX Research" value="ux" />
                      <SelectItem label="Web Development" value="web" />
                      <SelectItem
                        label="Cross Platform Development Process"
                        value="Cross Platform Development Process"
                      />
                      <SelectItem
                        label="UI Designing"
                        value="ui"
                        isDisabled={true}
                      />
                      <SelectItem label="Backend Development" value="backend" />
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </VStack>
              <VStack space="md">
                <Select>
                  <SelectTrigger variant="underlined" size="lg">
                    <SelectInput placeholder="Thème #2" />
                    {/* <SelectIcon className="mr-3" as={ChevronDownIcon} /> */}
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label="UX Research" value="ux" />
                      <SelectItem label="Web Development" value="web" />
                      <SelectItem
                        label="Cross Platform Development Process"
                        value="Cross Platform Development Process"
                      />
                      <SelectItem
                        label="UI Designing"
                        value="ui"
                        isDisabled={true}
                      />
                      <SelectItem label="Backend Development" value="backend" />
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </VStack>
              <VStack space="md">
                <Select>
                  <SelectTrigger variant="underlined" size="lg">
                    <SelectInput placeholder="Thème #3" />
                    {/* <SelectIcon className="mr-3" as={ChevronDownIcon} /> */}
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectItem label="UX Research" value="ux" />
                      <SelectItem label="Web Development" value="web" />
                      <SelectItem
                        label="Cross Platform Development Process"
                        value="Cross Platform Development Process"
                      />
                      <SelectItem
                        label="UI Designing"
                        value="ui"
                        isDisabled={true}
                      />
                      <SelectItem label="Backend Development" value="backend" />
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </VStack>
            </VStack>
          </FormControl>
          <Center className="bg-primary-500 h-[200px] w-[300px]">
            <Text className="text-typography-0 font-bold">
              Informations Personelle
            </Text>
          </Center>
          <FormControl className="p-4 border border-outline-300">
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
              <VStack space="xs">
                <Text className="text-typography-500">Code Postal</Text>
                <Input className="text-center">
                  <InputField
                    value={localization || ""}
                    onChangeText={(text) => setLocalization(text)}
                  />
                </Input>
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
          <Center className="bg-primary-500 h-[200px] w-[300px]">
            <Text className="text-typography-0 font-bold">
              Photos Publique & Privée
            </Text>
          </Center>
          <FormControl className="p-4 border border-outline-300">
            <HStack space="2xl" className="justify-center">
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
          </FormControl>
          {/* <Text> {jwt.jwt}</Text> */}
        </Box>
      </ScrollView>
    </>
  );
};

export default UserProfileScreen;
