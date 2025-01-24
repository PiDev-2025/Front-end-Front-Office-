import axios from "axios";

const hardData = {
	parents: [
		{
			created_at: "2025-01-14T21:01:28.120Z",
			id: "core_theme:8g1899b8sayedmpn864m",
			modified_at: "2025-01-14T21:01:28.120Z",
			name: "difficulte_professionnelle",
			orientation: "mal_etre",
		},
		{
			created_at: "2025-01-14T21:01:28.197Z",
			id: "core_theme:jfn2k4ykxtsxo2r3i74t",
			modified_at: "2025-01-14T21:01:28.197Z",
			name: "addiction",
			orientation: "mal_etre",
		},
		{
			created_at: "2025-01-14T21:01:28.037Z",
			id: "core_theme:sv1nyr36yy0aosc9ivry",
			modified_at: "2025-01-14T21:01:28.037Z",
			name: "harcelement",
			orientation: "mal_etre",
		},
		{
			created_at: "2025-01-14T21:01:27.965Z",
			id: "core_theme:vw2wpw4sa1sr2mkbb05y",
			modified_at: "2025-01-14T21:01:27.965Z",
			name: "violences_conjugales",
			orientation: "mal_etre",
		},
		{
			created_at: "2025-01-14T21:01:28.274Z",
			id: "core_theme:x0kkfso783iyru5kxrpv",
			modified_at: "2025-01-14T21:01:28.274Z",
			name: "relation_de_couple",
			orientation: "mal_etre",
		},
	],
	childs: [
		{
			created_at: "2025-01-14T21:01:28.276Z",
			id: "core_theme:0qzfy3qma0v62esddhzu",
			modified_at: "2025-01-14T21:01:28.276Z",
			name: "physique",
			orientation: "mal_etre",
			parent: "core_theme:vw2wpw4sa1sr2mkbb05y",
			tags: [
				"core_tag:qawy3zqj11stz4nv6ajj",
				"core_tag:ib7bd5s1lwns3hnquodi",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.575Z",
			id: "core_theme:3j8qyncq3lom6g18s6ef",
			modified_at: "2025-01-14T21:01:28.575Z",
			name: "lutter_contre_la_dependance",
			orientation: "mal_etre",
			parent: "core_theme:jfn2k4ykxtsxo2r3i74t",
			tags: [
				"core_tag:x3zeoy00pqkm2qg3whk4",
				"core_tag:9km8daajkz90qboqeev6",
				"core_tag:k63kh1wzj9j5iifsezlt",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.417Z",
			id: "core_theme:452j7vk4f8i2vctsdh2k",
			modified_at: "2025-01-14T21:01:28.418Z",
			name: "moral",
			orientation: "mal_etre",
			parent: "core_theme:sv1nyr36yy0aosc9ivry",
			tags: [
				"core_tag:67cdl3n8snwiwuzf2l5u",
				"core_tag:hxwpfti66tsenpal1xm9",
				"core_tag:x9mp9f5b5nb3fwoxl2up",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.634Z",
			id: "core_theme:4t1lleofv260wsh3vvsc",
			modified_at: "2025-01-14T21:01:28.634Z",
			name: "difficultes_sexuelles",
			orientation: "mal_etre",
			parent: "core_theme:x0kkfso783iyru5kxrpv",
			tags: [
				"core_tag:v94puc7jsay446lidj52",
				"core_tag:2otxz8il5yjv1ey60o43",
				"core_tag:823dyla0snkhnlpbx5rv",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.628Z",
			id: "core_theme:53feebxkyj94mpkw4uqx",
			modified_at: "2025-01-14T21:01:28.628Z",
			name: "infidelite",
			orientation: "mal_etre",
			parent: "core_theme:x0kkfso783iyru5kxrpv",
			tags: [
				"core_tag:1si9mtht93x4bfa6lrs6",
				"core_tag:z5gdzo60rygl62rxqixe",
				"core_tag:81sz1faj2d0p9pkup12g",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.625Z",
			id: "core_theme:566do1no48vvbwfwxjjm",
			modified_at: "2025-01-14T21:01:28.625Z",
			name: "communication",
			orientation: "mal_etre",
			parent: "core_theme:x0kkfso783iyru5kxrpv",
			tags: [
				"core_tag:op0lryx8lo237w6u5fnt",
				"core_tag:6ndamyp8oo87k0xoqhom",
				"core_tag:8p30bu3ra82u44k5m37z",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.120Z",
			id: "core_theme:8g1899b8sayedmpn864m",
			modified_at: "2025-01-14T21:01:28.120Z",
			name: "difficulte_professionnelle",
			orientation: "mal_etre",
		},
		{
			created_at: "2025-01-14T21:01:28.490Z",
			id: "core_theme:akqdqw32ere2t8afzb97",
			modified_at: "2025-01-14T21:01:28.490Z",
			name: "manque_de_reconnaissance",
			orientation: "mal_etre",
			parent: "core_theme:8g1899b8sayedmpn864m",
			tags: [
				"core_tag:1dpc4p2anidj4ni8bd5l",
				"core_tag:6fl5d5ymg6g334j0dvao",
				"core_tag:hxwpfti66tsenpal1xm9",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.572Z",
			id: "core_theme:d09vgjff3neittewyg9r",
			modified_at: "2025-01-14T21:01:28.572Z",
			name: "jeu_video",
			orientation: "mal_etre",
			parent: "core_theme:jfn2k4ykxtsxo2r3i74t",
			tags: [
				"core_tag:ufqyo3w4uuw58r5jm2xq",
				"core_tag:q7cojjcj3kr1c13ofv82",
				"core_tag:jr2fvx7ygdzo0jgb7177",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.488Z",
			id: "core_theme:fcpodgsrgn4lto93djil",
			modified_at: "2025-01-14T21:01:28.488Z",
			name: "relation_hierarchique",
			orientation: "mal_etre",
			parent: "core_theme:8g1899b8sayedmpn864m",
			tags: [
				"core_tag:a9mtwdjywn4me5bhd8c4",
				"core_tag:hxwpfti66tsenpal1xm9",
				"core_tag:rl9u19zn7ko48csyre9b",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.491Z",
			id: "core_theme:gxf7ohpr7yw9ab0hlal9",
			modified_at: "2025-01-14T21:01:28.491Z",
			name: "bore_out",
			orientation: "mal_etre",
			parent: "core_theme:8g1899b8sayedmpn864m",
			tags: [
				"core_tag:rapvm1zcqy5otf2sx41i",
				"core_tag:b6smu37z9fw0iev4g03e",
				"core_tag:4zaopv57qylyug2z6c0v",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.302Z",
			id: "core_theme:ih3i51qjp8xwoir5fefl",
			modified_at: "2025-01-14T21:01:28.302Z",
			name: "morale",
			orientation: "mal_etre",
			parent: "core_theme:vw2wpw4sa1sr2mkbb05y",
			tags: [
				"core_tag:0nb3d3o9a408l66btsv3",
				"core_tag:2h92mst0q2ethm5p6aoo",
				"core_tag:8p12zmqdslpk03i6xgv9",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.377Z",
			id: "core_theme:ixjhm6t0v2ba4khjgozh",
			modified_at: "2025-01-14T21:01:28.377Z",
			name: "ecole",
			orientation: "mal_etre",
			parent: "core_theme:sv1nyr36yy0aosc9ivry",
			tags: [
				"core_tag:fu5mi2thnwwysomcwnfw",
				"core_tag:pd88a52fi6ycn3u552dx",
				"core_tag:gmnr134dnq5vboeglzv8",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.556Z",
			id: "core_theme:j2ybx0iy2q5q8f9nvo6m",
			modified_at: "2025-01-14T21:01:28.556Z",
			name: "drogue",
			orientation: "mal_etre",
			parent: "core_theme:jfn2k4ykxtsxo2r3i74t",
			tags: [
				"core_tag:77ofgsb2uj3gdv0hxmpk",
				"core_tag:lcmul6jpygl6zyr0dada",
				"core_tag:8uqjfmyfs4ghjlm91e1x",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.197Z",
			id: "core_theme:jfn2k4ykxtsxo2r3i74t",
			modified_at: "2025-01-14T21:01:28.197Z",
			name: "addiction",
			orientation: "mal_etre",
		},
		{
			created_at: "2025-01-14T21:01:28.483Z",
			id: "core_theme:ldqdpeaf9c9lh5gw0zmy",
			modified_at: "2025-01-14T21:01:28.483Z",
			name: "licenciement",
			orientation: "mal_etre",
			parent: "core_theme:8g1899b8sayedmpn864m",
			tags: [
				"core_tag:chhdd8apfj0cqfkxeurj",
				"core_tag:8suah42ptz53la82499h",
				"core_tag:f1zku76ed5mczvbdc40m",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.488Z",
			id: "core_theme:o8v4ratbfbi7ic5rnh63",
			modified_at: "2025-01-14T21:01:28.488Z",
			name: "burn_out",
			orientation: "mal_etre",
			parent: "core_theme:8g1899b8sayedmpn864m",
			tags: [
				"core_tag:67e0h4ohbkl1sdjfiaim",
				"core_tag:2ebct5p2m9j6uee2axc1",
				"core_tag:to629f28ajg35g1ikmdq",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.559Z",
			id: "core_theme:oybvsf5q5p6p6br192y8",
			modified_at: "2025-01-14T21:01:28.559Z",
			name: "nouvelles_technologies",
			orientation: "mal_etre",
			parent: "core_theme:jfn2k4ykxtsxo2r3i74t",
			tags: [
				"core_tag:eg4go4i0uefeybpiu23p",
				"core_tag:k0c7ryf1dgy3nc593etd",
				"core_tag:wwaph0m4n8rbube4iwqc",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.492Z",
			id: "core_theme:s0v4j97sjj2mfvfv1r11",
			modified_at: "2025-01-14T21:01:28.492Z",
			name: "perte_de_mon_entreprise",
			orientation: "mal_etre",
			parent: "core_theme:8g1899b8sayedmpn864m",
			tags: [
				"core_tag:bl5wliazqvziwoyp18ci",
				"core_tag:xssrkiy9pyrdmpnewi3o",
				"core_tag:m7yrmnq4l9iut0h6h3sr",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.037Z",
			id: "core_theme:sv1nyr36yy0aosc9ivry",
			modified_at: "2025-01-14T21:01:28.037Z",
			name: "harcelement",
			orientation: "mal_etre",
		},
		{
			created_at: "2025-01-14T21:01:28.410Z",
			id: "core_theme:tdzky6g63dswwac3ld7n",
			modified_at: "2025-01-14T21:01:28.410Z",
			name: "cyber",
			orientation: "mal_etre",
			parent: "core_theme:sv1nyr36yy0aosc9ivry",
			tags: [
				"core_tag:6u9ami05ynhibuczb0gp",
				"core_tag:v554mvrd7vikv9bvrrh0",
				"core_tag:tkm2bl05v15kbi5ft01p",
			],
		},
		{
			created_at: "2025-01-14T21:01:27.965Z",
			id: "core_theme:vw2wpw4sa1sr2mkbb05y",
			modified_at: "2025-01-14T21:01:27.965Z",
			name: "violences_conjugales",
			orientation: "mal_etre",
		},
		{
			created_at: "2025-01-14T21:01:28.555Z",
			id: "core_theme:wdhrgcek3909jrws0hoj",
			modified_at: "2025-01-14T21:01:28.555Z",
			name: "alcool",
			orientation: "mal_etre",
			parent: "core_theme:jfn2k4ykxtsxo2r3i74t",
			tags: [
				"core_tag:gjfx7gx1u3go63jj1ddi",
				"core_tag:28ip3s48240zh5ctaojf",
				"core_tag:j3of2ptgltxg3f5n2gta",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.274Z",
			id: "core_theme:x0kkfso783iyru5kxrpv",
			modified_at: "2025-01-14T21:01:28.274Z",
			name: "relation_de_couple",
			orientation: "mal_etre",
		},
		{
			created_at: "2025-01-14T21:01:28.631Z",
			id: "core_theme:x83zrcjfn2izrqpwtiju",
			modified_at: "2025-01-14T21:01:28.631Z",
			name: "divorce_separation",
			orientation: "mal_etre",
			parent: "core_theme:x0kkfso783iyru5kxrpv",
			tags: [
				"core_tag:w8p2g82ejv68nnx9mmot",
				"core_tag:igtvbc5umrzt4ua0lzbj",
				"core_tag:dr6phwv3toz62ldkvhdf",
			],
		},
		{
			created_at: "2025-01-14T21:01:28.624Z",
			id: "core_theme:zs0tslm8lc8cybs0dbmj",
			modified_at: "2025-01-14T21:01:28.624Z",
			name: "violence",
			orientation: "mal_etre",
			parent: "core_theme:x0kkfso783iyru5kxrpv",
			tags: [
				"core_tag:2v2d00og0dwx0em20wzc",
				"core_tag:srln9u7yymagyfc64lpj",
				"core_tag:ob5u0zguhl450xzqxwxt",
			],
		},
	],
};

async function getThemes(token: string) {
	console.log("getThemes.l0", token);
	const origin = "qct-sw.react-native.screens.apis.UserProfile.getThemes";
	if (token) {
		console.log(
			"api/getThemes",
			origin,
			token,
			`${process.env.API_URL}/core/theme/`
		);
		const options = {
			method: "GET",
			url: `${process.env.API_URL}/core/theme/`,
			headers: { origin: origin, authorization: token },
		};
		// console.log("options", options);
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
			// console.log("data", data);
			if (data.length > 0) {
				return data;
			} else {
				return hardData;
			}
		} catch (error) {
			console.error(error);
			console.error(error.response.data);
		}
	} else {
		return hardData;
		// throw new Error("jwt is null");
	}
}

export { getThemes, hardData };
