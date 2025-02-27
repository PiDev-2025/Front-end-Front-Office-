import axios from "axios";

async function qcreate1V1Chat() {
	console.log("create1V1Chat");
}

async function create1V1Chat(userId1: string, userId2: string, jwt: string) {
	// const [jwt, setJwt] = useRecoilState(jwtState);
	console.log("jwt", jwt);
	const origin = "qct-sw.react-native.screens.apis.Chat.create1V1Chat";
	console.log(origin);
	const headers = {
		"content-type": "application/json",
		origin: origin,
		authorization: jwt,
	};
	console.log(headers);
	const options = {
		method: "POST",
		url: `${process.env.API_URL}/chat/create1V1`,
		headers: headers,
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
	message: string,
	isoTimeStamp: string,
	timestamp: number,
	jwt: string
) {
	// const [jwt] = useRecoilState(jwtState);
	const origin = "qct-sw.react-native.screens.apis.Chat.send1V1Message";
	console.log(origin);
	const options = {
		method: "POST",
		url: `${process.env.API_URL}/chat/send1V1Message`,
		headers: {
			"content-type": "application/json",
			origin: origin,
			authorization: jwt,
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

async function get1V1Messages(
	chatId: string,
	jwt: string,
	score: number = 0,
	range: number = 10,
	cursor: number = -1
) {
	const origin = "qct-sw.react-native.screens.apis.Chat.get1V1Messages";
	console.log(origin);
	console.log(
		`${process.env.API_URL}/chat/get1V1Messages/${chatId}/${range}/${cursor}/${score}`
	);
	console.log(jwt);
	const options = {
		method: "GET",
		url: `${process.env.API_URL}/chat/get1V1Messages/${chatId}/${range}/${cursor}/${score}`,
		headers: { origin: origin, authorization: jwt },
	};
	try {
		const { data } = await axios.request(options);
		console.log(data);
		return data;
	} catch (error) {
		console.error(error);
	}
}

async function get1V1MessagesAmount(chatId: string, jwt: string) {
	const origin = "qct-sw.react-native.screens.apis.Chat.get1V1MessagesAmount";
	console.log(origin);
	const options = {
		method: "GET",
		url: `${process.env.API_URL}/chat/get1V1MessagesAmount/${chatId}/`,
		headers: { origin: origin, authorization: jwt },
	};
	try {
		const { data } = await axios.request(options);
		// console.log(data);
		return data;
	} catch (error) {
		console.error(error);
	}
}

async function getUserChats(userId: string, jwt: string) {
	const origin = "qct-sw.react-native.screens.apis.Chat.getUserChats";
	console.log(`${process.env.API_URL}/chat/getUserChats/${userId}`);
	const headers = {
		origin: origin,
		authorization: jwt,
		// "content-type": "application/json",
	};
	// console.log(headers);
	const options = {
		method: "GET",
		url: `${process.env.API_URL}/chat/getUserChats/${userId}`,
		headers: headers,
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
