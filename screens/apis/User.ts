import axios from "axios";

async function userSignUp(username: string, email: string, password: string) {
	const origin = "qct-sw.react-native.screens.apis.User.userSignUp";
	console.log(origin);
	const options = {
		method: "POST",
		url: `${process.env.API_URL}/auth/user/signup`,
		headers: {
			"content-type": "application/json",
			origin: origin,
			authorization: `Bearer ${process.env.API_ELYSIA_JWT_USER_SIGNUP__SIGNIN}`,
		},
		data: { email, password, username },
	};

	try {
		const { data } = await axios.request(options);
		console.log(data);
		return data;
	} catch (error) {
		console.error(error);
	}
}

async function userSignIn(email: string, password: string) {
	const origin = "qct-sw.react-native.screens.apis.User.userSignIn";
	console.log(origin);
	const options = {
		method: "POST",
		url: `${process.env.API_URL}/auth/user/signin`,
		headers: {
			"content-type": "application/json",
			origin: origin,
			authorization: `Bearer ${process.env.API_ELYSIA_JWT_USER_SIGNUP__SIGNIN}`,
		},
		data: { email, password },
	};

	try {
		const { data } = await axios.request(options);
		console.log("axios.userSignIn", data);
		return data;
	} catch (error) {
		console.error(error);
	}
}

async function userSaveProfile(data: object, userId: string, jwt: string) {
	console.log("userSaveProfile");
	const origin = "qct-sw.react-native.screens.apis.User.userSaveProfile";
	// console.log(origin, data.themesSelected);
	//  themes: t.Array(SurrealDBRecordId),
	//             age: t.Number(),
	//             localization_code: t.Number(),
	//             localization_country: t.String(),
	//             sex: t.String(),
	//             pictures: t.Object({private: t.Array(t.String()), public: t.Array(t.String())}),
	// const FILE_PATH = "/path/to/local/file";
	// const OBJECT_KEY = "path/to/your/object";
	// console.log(data.pictures);

	// console.log(themesId);
	const payload = {
		themes: data.themesSelected.flatMap((theme: any) => [
			theme.subTheme.id,
			theme.theme.id,
		]),
		age: Number(data.age),
		localization_code: Number(data.localization.code),
		localization_country: data.localization.country,
		sex: data.sex,
		pictures: {
			private: ["blabla", "bloublou"],
			public: ["blabla", "bloublou"],
		},
	};
	const options = {
		method: "POST",
		url: `${process.env.API_URL}/user/information/`,
		headers: {
			"content-type": "application/json",
			origin: origin,
			authorization: jwt,
		},
		data: payload,
	};
	console.log(payload, options);
	try {
		const { data } = await axios.request(options);
		console.log("axios.userSaveProfile", data);
		return data;
	} catch (error) {
		console.error(error);
		console.error(error.response.data);
	}
}

async function userGetProfile(jwt: string, userId: string) {
	const origin = "qct-sw.react-native.screens.apis.User.userGetProfile";
	console.log(origin);
	const options = {
		method: "GET",
		url: `${process.env.API_URL}/core/user/informations/${userId}`,
		headers: {
			"content-type": "application/json",
			origin: origin,
			authorization: jwt,
		},
	};

	try {
		const { data } = await axios.request(options);
		console.log("axios.getUserProfile", data);
		return data;
	} catch (error) {
		console.error(error);
	}
}

export { userSignUp, userSignIn, userSaveProfile, userGetProfile };
