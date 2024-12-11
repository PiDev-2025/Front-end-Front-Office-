import * as React from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

type MessageProps = {
  avatar: string;
  name: string;
  message: string;
  time: string;
  isOutgoing?: boolean;
};

type ChatHeaderProps = {
  themeIcon: string;
  groupIcon: string;
  themeName: string;
  memberCount: number;
};

const Message: React.FC<MessageProps> = ({
  avatar,
  name,
  message,
  time,
  isOutgoing,
}) => {
  if (isOutgoing) {
    return (
      <View className="flex flex-col justify-center py-0.5 mt-3 w-full">
        <View className="flex flex-col justify-center w-full">
          <View className="p-3 w-full text-sm text-white bg-cyan-400 rounded-xl">
            <Text>{message}</Text>
          </View>
          <View className="gap-2.5 self-stretch px-3 mt-1 w-full text-xs text-neutral-400">
            <Text>{time}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex flex-col justify-center items-start py-0.5 w-full text-sm text-black">
      <View className="flex flex-col max-w-full w-[317px]">
        <View className="flex gap-1.5 justify-center items-center self-start whitespace-nowrap">
          <Image
            source={{ uri: avatar }}
            className="object-contain shrink-0 self-stretch my-auto rounded-full aspect-square w-[18px]"
          />
          <View className="self-stretch my-auto">
            <Text>{name}</Text>
          </View>
        </View>
        <View className="p-3 mt-1 rounded-xl bg-neutral-200">
          <Text>{message}</Text>
        </View>
        <View className="gap-2.5 self-stretch px-3 mt-1 w-full text-xs text-neutral-400">
          <Text>{time}</Text>
        </View>
      </View>
    </View>
  );
};

const ChatHeader: React.FC<ChatHeaderProps> = ({
  themeIcon,
  groupIcon,
  themeName,
  memberCount,
}) => (
  <View className="flex flex-col justify-center py-2 pr-6 pl-4 w-full border-b bg-neutral-50 border-zinc-300">
    <View className="flex gap-9 justify-between items-center w-full min-h-[40px]">
      <View className="flex relative gap-2 justify-center items-start self-stretch my-auto font-medium">
        <View className="flex z-0 gap-2 items-center my-auto">
          <Image
            source={{ uri: themeIcon }}
            className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
          />
          <Image
            source={{ uri: groupIcon }}
            className="object-contain shrink-0 self-stretch my-auto w-10 rounded aspect-square"
          />
          <View className="flex flex-col justify-center self-stretch my-auto">
            <View className="text-sm text-black">
              <Text>{themeName}</Text>
            </View>
            <View className="text-xs text-neutral-400">
              <Text>{memberCount} membres</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="flex gap-6 justify-center items-center self-stretch my-auto">
        {["ext_3-", "ext_4-", "ext_5-"].map((icon, index) => (
          <Image
            key={index}
            source={{ uri: `http://b.io/${icon}` }}
            className="object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]"
          />
        ))}
      </View>
    </View>
  </View>
);

const ThemeChatScreen: React.FC = () => {
  const messages: MessageProps[] = [
    {
      avatar:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/09534b4d2a9ac3383cb3858912714a3bdea0d5a6dba0627671943b17493dfabc?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
      name: "Sandra",
      message: "Hello comment vas-tu ?",
      time: "10min ago",
    },
    {
      message: "Salut ça va super et toi ?",
      time: "10min ago",
      isOutgoing: true,
    },
    {
      avatar:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/d863ed261a67b538712ab4ace9351ef081280f520fe0b64e3a147b24af3b2a73?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
      name: "Eric",
      message: "Yes nickel alors tu as pensé quoi de Alien Romulus ?",
      time: "10min ago",
    },
    {
      message:
        "C'était génial j'ai adoré le casting est incroyable, le scénraio très réussi.\nVFX au top du top bref j'ai pris ma claque!",
      time: "10min ago",
      isOutgoing: true,
    },
  ];

  return (
    <View className="flex overflow-hidden flex-col mx-auto w-full bg-white max-w-[480px]">
      <View className="flex flex-col justify-between w-full h-[854px]">
        <View className="flex flex-col w-full">
          <ChatHeader
            themeIcon="https://cdn.builder.io/api/v1/image/assets/TEMP/45998531dc3f7c079cc79046d8f66085b23cf1e513954095aec35d31cad5463c?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12"
            groupIcon="https://cdn.builder.io/api/v1/image/assets/TEMP/7949539254f43c9e57fd6c3131b3fcccb6596f0d9adbc61b0c91439ee01689d4?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12"
            themeName="Thematique : Anxiété"
            memberCount={308}
          />

          <View className="flex flex-col justify-center items-center mt-8 w-full">
            <View className="flex flex-col justify-center px-8 py-4 max-w-full bg-cyan-50 rounded-xl border border-cyan-100 border-solid w-[352px]">
              <View className="text-xs font-semibold text-black">
                <Text>Cette conversation vous est-elle utile ?</Text>
              </View>
              <View className="flex gap-3 items-center mt-1.5 w-full">
                <View className="self-stretch my-auto text-xs font-medium text-stone-500">
                  <Text>Oui</Text>
                </View>
                <View className="flex flex-col self-stretch my-auto h-[7px] w-[221px]">
                  <View className="flex flex-col items-start w-full h-2 bg-cyan-400 rounded-xl">
                    <View className="flex bg-white rounded-full border border-cyan-400 border-solid h-[15px] min-h-[15px] w-[15px]" />
                  </View>
                </View>
                <View className="self-stretch my-auto text-xs font-medium text-stone-500">
                  <Text>Non</Text>
                </View>
              </View>
            </View>
          </View>

          <ScrollView className="flex flex-col px-8 mt-8 w-full font-medium">
            {messages.map((msg, index) => (
              <Message key={index} {...msg} />
            ))}
          </ScrollView>
        </View>

        <View className="flex flex-col px-6 w-full border-t bg-neutral-50 border-zinc-300 text-neutral-400">
          <View className="flex gap-4 justify-between items-center w-full min-h-[40px]">
            <TextInput
              placeholder="Écrire un message"
              className="flex relative gap-3 justify-center items-start self-stretch my-auto text-sm font-medium min-w-[240px] w-[251px]"
              accessibilityLabel="Message input field"
            />
            <TouchableOpacity className="flex gap-2 items-center self-stretch my-auto text-xs font-bold whitespace-nowrap">
              <Image
                source={{
                  uri: "https://cdn.builder.io/api/v1/image/assets/TEMP/5f03c393f3102fd6c48d1b3bdfcffdff60c97615900b5cced378de053843dd63?placeholderIfAbsent=true&apiKey=6dcac0f27775456c9f3cdecc44b5bd12",
                }}
                className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
              />
              <Text>Envoyer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ThemeChatScreen;
