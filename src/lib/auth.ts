import crypto from "crypto";

const DEFAULT_EMAIL = "admin@ya.ru";
const DEFAULT_PASSWORD = "9yt-uey-aKC-gQH";
const DEFAULT_SECRET = "change-this-secret";

export function getAuthConfig() {
	const email = process.env.AUTH_EMAIL ?? DEFAULT_EMAIL;
	const password = process.env.AUTH_PASSWORD ?? DEFAULT_PASSWORD;
	const secret = process.env.AUTH_SECRET ?? DEFAULT_SECRET;
	return { email, password, secret };
}

function base64url(input: Buffer | string) {
	return Buffer.from(input)
		.toString("base64")
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
}

export function signToken(payload: Record<string, unknown>): string {
	const { secret } = getAuthConfig();
	const header = { alg: "HS256", typ: "JWT" };
	const encodedHeader = base64url(JSON.stringify(header));
	const encodedPayload = base64url(JSON.stringify(payload));
	const data = `${encodedHeader}.${encodedPayload}`;
	const signature = crypto.createHmac("sha256", secret).update(data).digest();
	const encodedSignature = base64url(signature);
	return `${data}.${encodedSignature}`;
}

export function verifyToken(token: string): Record<string, unknown> | null {
	try {
		const { secret } = getAuthConfig();
		const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");
		if (!encodedHeader || !encodedPayload || !encodedSignature) return null;
		const data = `${encodedHeader}.${encodedPayload}`;
		const expected = base64url(crypto.createHmac("sha256", secret).update(data).digest());
		const a = Buffer.from(encodedSignature);
		const b = Buffer.from(expected);
		if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
		const payload = JSON.parse(Buffer.from(encodedPayload, "base64").toString("utf8"));
		const now = Math.floor(Date.now() / 1000);
		if (typeof payload.exp === "number" && now > payload.exp) return null;
		return payload;
	} catch {
		return null;
	}
}


