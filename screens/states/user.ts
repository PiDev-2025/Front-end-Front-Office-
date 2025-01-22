import { atom } from "jotai";
import { getThemes } from "../apis/Theme";

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

const jwtAtom = atom<object | null>({});
const jwtDecodedAtom = atom<object | null>({});
const picturesAtom = atom<object | null>({
	public: "https://cms-sw.s3.fr-par.scw.cloud/mandala-001.jpg",
	private: "https://cms-sw.s3.fr-par.scw.cloud/public-picture-001.jpg",
});

const themesAtom = atom<object[] | null>([{ parents: [], childs: [] }]);

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
};
