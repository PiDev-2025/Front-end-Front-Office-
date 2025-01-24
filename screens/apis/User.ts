import axios from "axios";
import { useAtom } from "jotai";
import {
	ageAtom,
	jwtAtom,
	localizationAtom,
	sexAtom,
	themesSelectedAtoms,
	userIDAtom,
} from "../states/user";

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
		return data.jwt;
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
		return data.jwt;
	} catch (error) {
		console.error(error);
	}
}

async function userSaveProfile() {
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
	const [jwt, setJwt] = useAtom(jwtAtom);
	const [userId, setUserId] = useAtom(userIDAtom);
	const [themesSelected, setThemesSelected] = useAtom(themesSelectedAtoms);
	const [age, setAge] = useAtom(ageAtom);
	const [sex, setSex] = useAtom(sexAtom);
	const [localization, setLocalization] = useAtom(localizationAtom);
	// const [
	const payload = {
		user_id: userId,
		themes: themesSelected.flatMap((theme: any) => [
			theme.subTheme.id,
			theme.theme.id,
		]),
		age: Number(age),
		localization_code: Number(localization.code),
		localization_country: localization.country,
		sex: sex,
		pictures_public: ["blabla", "bloublou"],
		pictures_private: ["blabla", "bloublou"],
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

async function getUserInformation(jwt: string, userId: string) {
	const origin = "qct-sw.react-native.screens.apis.User.userGetProfile";
	console.log("getUserInformation", jwt, userId, origin);
	const options = {
		method: "GET",
		url: `${process.env.API_URL}/user/information/by_user_id/${userId}`,
		headers: {
			"content-type": "application/json",
			origin: origin,
			authorization: jwt,
		},
	};
	console.log(options);
	try {
		const { data } = await axios.request(options);
		console.log("axios.getUserProfile", data);
		return data;
	} catch (error) {
		console.error(error);
	}
}

export { userSignUp, userSignIn, userSaveProfile, getUserInformation };
