import { atom } from "recoil";

const usernameState = atom<string | null>({
	key: "usernameState",
	default: "dams_qct",
});
const emailState = atom<string | null>({
	key: "emailState",
	default: "damien@qazar.cloud",
});
const passwordState = atom<string | null>({
	key: "passwordState",
	default: "Test1234",
});
const sexState = atom<string | undefined>({
	key: "sexState",
	default: "Homme",
});
const localizationState = atom<object | null>({
	key: "localizationState",
	default: {
		code: "34070",
		country: "France",
	},
});
const ageState = atom<string | null>({
	key: "ageState",
	default: "35",
});
const jwtState = atom<object | null>({
	key: "jwtState",
	default: {},
});
const jwtDecodedState = atom<object | null>({
	key: "jwtDecoded",
	default: {},
});
const picturesState = atom<object | null>({
	key: "picturesState",
	default: {
		public: "https://cms-sw.s3.fr-par.scw.cloud/mandala-001.jpg",
		private: "https://cms-sw.s3.fr-par.scw.cloud/public-picture-001.jpg",
	},
});
const themesStates = atom<object | null>({
	key: "themeState",
	default: { parents: [], childs: [] },
});
const themesSelectedStates = atom<
	{
		theme: { name: null; id: null };
		subTheme: { name: null; id: null }[];
	}[]
>({
	key: "themesSelectedState",
	default: [
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
	],
});

export {
	usernameState,
	emailState,
	passwordState,
	jwtState,
	jwtDecodedState,
	sexState,
	localizationState,
	ageState,
	picturesState,
	themesStates,
	themesSelectedStates,
};
