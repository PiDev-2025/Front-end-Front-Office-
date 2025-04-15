import { atom } from "jotai";
import { getThemes } from "../apis/Theme";
import { getUserInformation } from "../apis/User";
import { log } from "../libs/logger";
const userIDAtom = atom<string>("");

const usernameAtom = atom<string | null>("dams_qct");

const emailAtom = atom<string | null>("dams_qct@sympathyworld.co");

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

const themesAtom = atom<object[] | null>([{}]);

const fetchThemesAtom = atom(
	(get) => get(themesAtom),
	async (get, set) => {
		console.log("fetchThemesAtom");
		const jwt = get(jwtAtom);
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
		const jwt = get(jwtAtom); // Assuming you have a jwtAtom
		const userId = get(userIDAtom); // Assuming you have a userIdAtom
		try {
			var data = await getUserInformation(jwt, userId.split(":")[1]);
			if (data) {
				// we dont need to interact since its read only
				log.info("userInformationAtom:data", data);
				set(userInformationAtom, data);
				set(ageAtom, data.age ? String(data.age) : null);
				set(localizationAtom, {
					code: data.localization_code || 34076,
					country: data.localization_country || "France",
				});
				set(themesSelectedAtoms, data.selectedThemes);
			} else {
				// there isnt profile yet so we need to create one and so need all availables themes
				set(fetchThemesAtom);
				console.log("fetchUserInformationAtom:themes", get(themesAtom));
			}
		} catch (error) {
			console.error("Failed to fetch user information:", error);
		}
	}
);

const themesSelectedAtoms = atom<
	{
		theme: { name: null; id: null };
		subTheme: { name: null; id: null };
	}[]
>();

export {
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
