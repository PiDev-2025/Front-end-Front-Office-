function toRadians(degrees) {
	return (degrees * Math.PI) / 180;
}

function haversineDistance(lat1, lon1, lat2, lon2) {
	const R = 6371; // Radius of the Earth in kilometers
	const dLat = toRadians(lat2 - lat1);
	const dLon = toRadians(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRadians(lat1)) *
			Math.cos(toRadians(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c; // Distance in km
}

// Coordinates approximation for each postal code
const coords = {
	"34070": [43.6109, 3.8772], // Montpellier
	"75008": [48.8738, 2.3112], // Paris 8th arrondissement
	"44000": [47.2184, -1.5536], // Nantes
	"33000": [44.8378, -0.5792], // Bordeaux
};

const profiles = [
	{
		id: "001",
		name: "Chloé",
		picture: "https://cms-sw.s3.fr-par.scw.cloud/public-picture-001.jpg",
		localization_code: "34070",
		localization_country: "France",
	},
	{
		id: "002",
		name: "Tzin",
		picture: "https://cms-sw.s3.fr-par.scw.cloud/profile-picture-003.jpg",
		localization_code: "75008",
		localization_country: "France",
	},
	{
		id: "003",
		name: "Julie",
		picture: "https://cms-sw.s3.fr-par.scw.cloud/public-picture-002.jpg",
		localization_code: "44000",
		localization_country: "France",
	},
	{
		id: "004",
		name: "Emilio",
		picture: "https://cms-sw.s3.fr-par.scw.cloud/profile-picture-004.jpg",
		localization_code: "33000",
		localization_country: "France",
	},
];

// Your postal code
const myPostalCode = "34070";

// Calculate distances from your location to each profile
const distances = profiles.map((profile) => {
	if (profile.localization_code !== myPostalCode) {
		const distance = haversineDistance(
			coords[myPostalCode][0],
			coords[myPostalCode][1],
			coords[profile.localization_code][0],
			coords[profile.localization_code][1]
		);
		return { ...profile, distance: distance.toFixed(2) };
	}
	return { ...profile, distance: "0.00" }; // Distance to self is 0
});

// Print results
distances.forEach((profile) => {
	console.log(`${profile.name}: ${profile.distance} km`);
});
