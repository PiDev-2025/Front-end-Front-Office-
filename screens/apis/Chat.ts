import axios from "axios";

async function create1V1Chat(userId1: string, userId2: string) {
  const origin = "qct-sw.react-native.screens.apis.Chat.create1V1Chat";
  console.log(origin);
  const options = {
    method: "POST",
    url: `${process.env.API_URL}/chat/create1V1`,
    headers: {
      "content-type": "application/json",
      origin: origin,
    },
    data: { userId1, userId2 },
  };

  try {
    const { data } = await axios.request(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function send1V1Message(
  chatId: string,
  senderId: string,
  message: string
) {
  const origin = "qct-sw.react-native.screens.apis.Chat.send1V1Message";
  console.log(origin);
  const options = {
    method: "POST",
    url: `${process.env.API_URL}/chat/send1V1Message`,
    headers: {
      "content-type": "application/json",
      origin: origin,
    },
    data: { chatId, senderId, message },
  };

  try {
    const { data } = await axios.request(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function get1V1Messages(chatId: string, range: number, cursor: number) {
  const origin = "qct-sw.react-native.screens.apis.Chat.get1V1Messages";
  console.log(origin);
  const options = {
    method: "GET",
    url: `${process.env.API_URL}/chat/get1V1Messages/${chatId}/${range}/${cursor}`,
    Headers: { origin: origin },
  };
  try {
    const { data } = await axios.request(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function get1V1MessagesAmount(chatId: string) {
  const origin = "qct-sw.react-native.screens.apis.Chat.get1V1MessagesAmount";
  console.log(origin);
  const options = {
    method: "GET",
    url: `${process.env.API_URL}/chat/get1V1MessagesAmount/${chatId}/`,
    Headers: {
      origin: origin,
    },
  };
  try {
    const { data } = await axios.request(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function getUserChats(userId: string) {
  const origin = "qct-sw.react-native.screens.apis.Chat.getUserChats";
  console.log(origin);
  const options = {
    method: "GET",
    url: `${process.env.API_URL}/chat/getUserChats/${userId}/`,
    Headers: {
      origin: origin,
    },
  };
  try {
    const { data } = await axios.request(options);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export {
  create1V1Chat,
  send1V1Message,
  get1V1Messages,
  get1V1MessagesAmount,
  getUserChats,
};
