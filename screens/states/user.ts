import { atom } from "jotai";
import { getThemes, hardData } from "../apis/Theme";
import { getUserInformation } from "../apis/User";

const usernameState = atom<string | null>("dams_qct");
const emailState = atom<string | null>("damien+5@sympathyworld.co");
const passwordState = atom<string | null>("Test1234");
const sexState = atom<string | undefined>("Homme");
const localizationState = atom<object | null>({
	code: "34070",
	country: "France",
});
const ageState = atom<string | null>("35");

const jwtState = atom<string | null>("s");
const jwtDecodedState = atom<object | null>({});
const userIDAtom = atom<string>("");
const picturesState = atom<object | null>({
	public: "https://cms-sw.s3.fr-par.scw.cloud/mandala-001.jpg",
	private: "https://cms-sw.s3.fr-par.scw.cloud/public-picture-001.jpg",
});
const themesStates = atom<object[] | null>([{ parents: [], childs: [] }]);
const themesSelectedStates = atom<
	{
		theme: { name: null; id: null };
		subTheme: { name: null; id: null }[];
	}[]
>([
	{
		theme: { name: null, id: null },
		subTheme: { name: null, id: null },
	},
	{
		theme: { name: null, id: null },
		subTheme: { name: null, id: null },
	},
	{
		theme: { name: null, id: null },
		subTheme: { name: null, id: null },
	},
]);

const usernameAtom = atom<string | null>("dams_qct");
const emailAtom = atom<string | null>("damien+5@sympathyworld.co");
const passwordAtom = atom<string | null>("Test1234");

const sexAtom = atom<string | undefined>("Homme");
const localizationAtom = atom<object | null>({
	code: "34070",
	country: "France",
});
const ageAtom = atom<string | null>("35");

const jwtAtom = atom<string | null>("");
const jwtDecodedAtom = atom<object | null>({});
const picturesAtom = atom<object | null>({
	public: "https://cms-sw.s3.fr-par.scw.cloud/mandala-001.jpg",
	private: "https://cms-sw.s3.fr-par.scw.cloud/public-picture-001.jpg",
});

const themesAtom = atom<object[] | null>(hardData);

const fetchThemesAtom = atom(
	(get) => get(themesAtom),
	async (get, set, { jwt }) => {
		console.log("fetchThemesAtom");
		// const jwt = get(jwtAtom);
		console.log("fetchThemesAtom:jwt", jwt);
		try {
			const data = await getThemes(jwt);
			set(themesAtom, data);
		} catch (error) {
			console.error("Failed to fetch themes:", error);
			set(themesAtom, []);
		}
	}
);

const userInformationAtom = atom<object[] | null>([
	{},
	// {
	// 	age: 34,
	// 	created_at: "2025-01-21T08:47:32.235Z",
	// 	id: "user_information:cd1097tqfcfpo4n889i5",
	// 	localization_code: 34076,
	// 	localization_country: "France",
	// 	modified_at: "2025-01-23T09:47:21.585Z",
	// 	pictures_private: ["blabla", "bloublou"],
	// 	pictures_public: ["blabla", "bloublou"],
	// 	sex: "Homme",
	// 	themes: [
	// 		"core_theme:x83zrcjfn2izrqpwtiju",
	// 		"core_theme:x0kkfso783iyru5kxrpv",
	// 		"core_theme:ih3i51qjp8xwoir5fefl",
	// 		"core_theme:vw2wpw4sa1sr2mkbb05y",
	// 		"core_theme:566do1no48vvbwfwxjjm",
	// 		"core_theme:x0kkfso783iyru5kxrpv",
	// 	],
	// 	user_id: "user:thzr0wwtsspvdm3jtdz4",
	// },
]);

const fetchUserInformationAtom = atom(
	(get) => get(userInformationAtom),
	async (get, set) => {
		console.log();
		// console.log("fetchUserInformationAtom", jwt, userId);
		const jwt = get(jwtAtom); // Assuming you have a jwtAtom
		const userId = get(userIDAtom); // Assuming you have a userIdAtom
		console.log("Final values used:", { jwt, userId });

		// console.log("Arguments received:", { jwt, userId });

		// Retrieve jwt and userId from Jotai state if needed
		// console.log("State values:", { stateJwt, stateUserId });

		// Use state values if arguments are empty
		// jwt = jwt || stateJwt;
		// userId = userId || stateUserId;

		try {
			var data = await getUserInformation(jwt, userId.split(":")[1]);
			// if (!data) {
			// 	data = await getUserInformation(jwt, userId.split(":")[1]);
			// }
			console.log(data);
			if (data) {
				console.log("userInformationAtom:data", data);
				set(userInformationAtom, data);
				set(ageAtom, data.age ? String(data.age) : null);
				set(localizationAtom, {
					code: data.localization_code || 34076,
					country: data.localization_country || "France",
				});
			}
		} catch (error) {
			console.error("Failed to fetch user information:", error);
		}
	}
);

const themesSelectedAtoms = atom<
	{
		theme: { name: null; id: null };
		subTheme: { name: null; id: null }[];
	}[]
>([
	{
		theme: { name: null, id: null },
		subTheme: { name: null, id: null },
	},
	{
		theme: { name: null, id: null },
		subTheme: { name: null, id: null },
	},
	{
		theme: { name: null, id: null },
		subTheme: { name: null, id: null },
	},
]);

// const userIDAtom = atom<string | null>("");

export {
	usernameState,
	emailState,
	passwordState,
	jwtState,
	jwtDecodedState,
	sexState,
	localizationState,
	// ageState,
	picturesState,
	themesStates,
	themesSelectedStates,
	// userDataState,
	ageAtom,
	usernameAtom,
	emailAtom,
	passwordAtom,
	jwtAtom,
	jwtDecodedAtom,
	sexAtom,
	localizationAtom,
	// ageAtom,
	picturesAtom,
	themesAtom,
	fetchThemesAtom,
	themesSelectedAtoms,
	// userDataAtom,
	userInformationAtom,
	fetchUserInformationAtom,
	userIDAtom,
};
