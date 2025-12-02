import { NextResponse } from "next/server";

export async function POST() {
	const participantId =
		typeof crypto !== "undefined" && "randomUUID" in crypto
			? crypto.randomUUID()
			: Math.random().toString(36).slice(2);

	return NextResponse.json({ participantId });
}


