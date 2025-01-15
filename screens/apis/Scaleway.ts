import axios, { AxiosRequestConfig } from "axios";
import * as crypto from "crypto";
import { createReadStream } from "fs";

const BUCKET_NAME = "cms-sw";
const REGION = "fr-par"; // or 'nl-ams', 'pl-waw'
const ACCESS_KEY = "SCW9X045H2N8P6VMN15X";
const SECRET_KEY = "0ac9fe50-21bb-4dfd-a958-f1ef6fab9a21";

// Function to sign the request for AWS V4 Signature
function signRequest(
	method: string,
	path: string,
	payload: string,
	dateStamp: string,
	region: string,
	service: string,
	accessKey: string,
	secretKey: string,
	ENDPOINT: string
): AxiosRequestConfig {
	const algorithm = "AWS4-HMAC-SHA256";
	const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
	const canonicalQueryString = "";
	const canonicalHeaders = `host:${new URL(ENDPOINT).host}\n`;
	const signedHeaders = "host";
	const canonicalRequest = `${method}\n${path}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${crypto
		.createHash("sha256")
		.update(payload)
		.digest("hex")}`;

	const stringToSign = `${algorithm}\n${new Date()
		.toISOString()
		.replace(/[-:]/g, "")
		.slice(0, 8)}T000000Z\n${credentialScope}\n${crypto
		.createHash("sha256")
		.update(canonicalRequest)
		.digest("hex")}`;

	const signingKey = (function (
		key: string,
		dateStamp: string,
		regionName: string,
		serviceName: string
	) {
		const kDate = crypto
			.createHmac("sha256", `AWS4${key}`)
			.update(dateStamp)
			.digest();
		const kRegion = crypto
			.createHmac("sha256", kDate)
			.update(regionName)
			.digest();
		const kService = crypto
			.createHmac("sha256", kRegion)
			.update(serviceName)
			.digest();
		return crypto
			.createHmac("sha256", kService)
			.update("aws4_request")
			.digest();
	})(secretKey, dateStamp, region, service);

	const signature = crypto
		.createHmac("sha256", signingKey)
		.update(stringToSign)
		.digest("hex");

	return {
		headers: {
			Authorization: `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
			"x-amz-date": `${new Date()
				.toISOString()
				.replace(/[-:]/g, "")
				.slice(0, 8)}T000000Z`,
			"x-amz-content-sha256": crypto
				.createHash("sha256")
				.update(payload)
				.digest("hex"),
		},
	};
}

async function sendObject(filePath: string, objectKey: string) {
	const FILE_PATH = filePath;
	const OBJECT_KEY = objectKey;
	const ENDPOINT = `https://s3.${REGION}.scw.cloud/${BUCKET_NAME}/${OBJECT_KEY}`;
	const fileStream = createReadStream(FILE_PATH);
	const payload = await new Promise<string>((resolve, reject) => {
		const hash = crypto.createHash("sha256");
		const readStream = fileStream;
		readStream.on("data", (chunk) => hash.update(chunk));
		readStream.on("end", () => resolve(hash.digest("hex")));
		readStream.on("error", reject);
	});

	const dateStamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 8);
	const config = signRequest(
		"PUT",
		`/${BUCKET_NAME}/${OBJECT_KEY}`,
		payload,
		dateStamp,
		REGION,
		"s3",
		ACCESS_KEY,
		SECRET_KEY,
		ENDPOINT
	);

	const response = await axios.put(ENDPOINT, fileStream, config);
	console.log("Object uploaded:", response.status);
}

// sendObject().catch(console.error);
export { sendObject };
