import axios from "axios";

async function getThemes(jwt: string) {
	console.log("getThemes", jwt);
	const origin = "qct-sw.react-native.screens.apis.UserProfile.getThemes";
	console.log(origin);
	console.log(`${process.env.API_URL}/core/theme/nested`);
	console.log(jwt);
	const options = {
		method: "GET",
		url: `${process.env.API_URL}/core/theme/`,
		headers: { origin: origin, authorization: jwt },
	};
	try {
		const { data } = await axios
			.request(options)
			.catch(async (error) => {
				if (error.response && error.response.status >= 500) {
					console.log("Retrying request...");
					return await axios.request(options);
				}
				throw error;
			});
		console.log(data);
		return data;
	} catch (error) {
		console.error(error);
	}
}

export { getThemes };
