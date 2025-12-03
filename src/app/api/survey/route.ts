import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/sqlite";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json().catch(() => ({}));
		const participantId: string = body?.participantId;
		const age: number = Number(body?.age);
		const gender: string = String(body?.gender ?? "");
		const education: string = String(body?.education ?? "");
		const llmUsage: string = String(body?.llmUsage ?? "");

		if (
			!participantId ||
			!Number.isFinite(age) ||
			age < 18 ||
			age > 99 ||
			!gender ||
			!education ||
			!llmUsage
		) {
			return NextResponse.json({ error: "Неверные данные" }, { status: 400 });
		}

		const stmt = db.prepare(
			`INSERT INTO "Survey" (participantId, age, gender, education, llmUsage) VALUES (?, ?, ?, ?, ?)`,
		);
		stmt.run(participantId, age, gender, education, llmUsage);

		return NextResponse.json({ ok: true });
	} catch (e) {
		return NextResponse.json({ error: "Ошибка сохранения" }, { status: 500 });
	}
}


